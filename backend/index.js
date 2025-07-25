import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { auth, storage, db } from "./config/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  query,
  where,
} from "firebase/firestore";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const sendError = (res, code, error) =>
  res.status(code).json({ error });

async function checkLogin(email, password) {
  if (!email || !password) return false;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user.uid;
  } catch {
    return false;
  }
}

let quizCache = [];

async function generateOneQuiz() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) throw new Error("OpenAI API key not set");

  const prompt = `
    Generate a fresh coding quiz. Vary the topics/questions each time.
    Provide EXACTLY 5 multiple-choice questions in this format:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correct": 0
      },
      ...
    ]
    No explanation. JSON only.
  `;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const raw = response.data.choices[0].message.content.trim();
  const clean = raw.replace(/^```json\n?/i, "").replace(/```$/i, "").trim();
  const parsed = JSON.parse(clean);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.quiz)) return parsed.quiz;
  throw new Error("Unexpected format");
}

async function refillCache() {
  while (quizCache.length < 5) {
    try {
      const quiz = await generateOneQuiz();
      quizCache.push(quiz);
    } catch (err) {
      console.error("Quiz generation failed during refill:", err.message);
      break;
    }
  }
}

refillCache();

app.get("/", (_, res) => {
  res.send("<h1>Express Server is running!</h1>");
});

app.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName)
    return sendError(res, 400, "All fields are required");
  if (password.length < 8)
    return sendError(res, 400, "Password must be at least 8 characters");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      fullName,
      createdAt: new Date().toISOString(),
    });
    res.json({ message: "User registered" });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const uid = await checkLogin(email, password);
  if (!uid) return sendError(res, 401, "Invalid email or password");

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    let streak = 1;
    const lastLogin = new Date().toISOString();

    if (userSnap.exists()) {
      const data = userSnap.data();
      const prevLastLogin = data.lastLogin;
      const prevStreak = data.streak || 1;

      if (prevLastLogin) {
        const prevDate = new Date(prevLastLogin);
        const now = new Date();
        const diffDays = Math.floor((now - prevDate) / (1000 * 60 * 60 * 24));
        streak = diffDays === 1 ? prevStreak + 1 : diffDays === 0 ? prevStreak : 1;
      }
    }

    await setDoc(userRef, { lastLogin, streak }, { merge: true });
    res.json({ isCorrect: uid, streak });
  } catch {
    sendError(res, 500, "Error during login");
  }
});

app.post("/add_information", upload.single("avatar"), async (req, res) => {
  const { email, password } = req.body;
  const uid = await checkLogin(email, password);
  if (!uid) return sendError(res, 401, "Invalid email or password");

  let updatedData = {};

  if (req.file) {
    try {
      const storageRef = ref(storage, `avatars/${uid}.jpg`);
      await uploadBytes(storageRef, req.file.buffer);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.avatar = downloadURL;
    } catch (error) {
      return sendError(res, 500, "Error uploading avatar: " + error.message);
    }
  }

  if (req.body.userData) {
    let userData;
    try {
      userData = typeof req.body.userData === 'string'
        ? JSON.parse(req.body.userData)
        : req.body.userData;
    } catch {
      console.error("Invalid userData JSON:", req.body.userData);
      return sendError(res, 400, "Invalid userData JSON");
    }

    const allowed = ['bio', 'languagesKnown', 'languagesLearning', 'learningStyle', 'availability'];
    Object.keys(userData).forEach(k => !allowed.includes(k) && delete userData[k]);
    updatedData = { ...updatedData, ...userData };
  }

  try {
    await setDoc(doc(db, "users", uid), updatedData, { merge: true });
    res.json({ message: "User data saved", avatar: updatedData.avatar });
  } catch (error) {
    sendError(res, 500, "Error saving data: " + error.message);
  }
});

app.post("/get_information", async (req, res) => {
  const { email, password } = req.body;
  const uid = await checkLogin(email, password);
  if (!uid) return sendError(res, 401, "Invalid email or password");

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return sendError(res, 404, "User not found");
    res.json({ message: "Data received", data: userSnap.data() });
  } catch {
    sendError(res, 500, "Error retrieving data");
  }
});

app.get("/generate", (req, res) => {
  if (quizCache.length > 0) {
    const quiz = quizCache.pop();
    res.json(quiz);
    refillCache();
  } else {
    res.status(503).json({ error: "Quiz is being generated. Try again soon." });
  }
});

app.get("/users/swipe", async (req, res) => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => 
        user.email !== req.query.excludeEmail &&
        (
          user.bio ||
          (Array.isArray(user.languagesKnown) && user.languagesKnown.length > 0) ||
          (Array.isArray(user.languagesLearning) && user.languagesLearning.length > 0) ||
          user.learningStyle ||
          user.availability
        )
      )
      .map(user => ({
        id: user.id,
        fullName: user.fullName,
        avatar: user.avatar || null,
        bio: user.bio || "",
        learningStyle: user.learningStyle || "",
        languagesKnown: user.languagesKnown || [],
        languagesLearning: user.languagesLearning || [],
        availability: user.availability || ""
      }));

    res.json(users);
  } catch (err) {
    console.error("Error fetching users for swipe:", err);
    res.status(500).json({ error: "Failed to load users for swipe." });
  }
});

app.post("/get_information", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Data received", data: { id: uid, ...userSnap.data() } });
  } catch (e) {
    res.status(401).json({ error: "Invalid email or password" });
  }
});


app.get("/forum/topics", async (req, res) => {
  try {
    const topicsRef = collection(db, "topics");
    const snapshot = await getDocs(topicsRef);
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: "Failed to load topics." });
  }
});

app.post("/forum/topics", async (req, res) => {
  const { title, authorId, authorName, authorAvatar } = req.body;
  if (!title || !authorId) return res.status(400).json({ error: "Missing fields" });
  try {
    const topicRef = await addDoc(collection(db, "topics"), {
      title,
      authorId,
      authorName,
      authorAvatar: authorAvatar || null,
      createdAt: new Date().toISOString(),
    });
    res.json({ id: topicRef.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create topic" });
  }
});

app.get("/forum/topics/:id", async (req, res) => {
  try {
    const docRef = doc(db, "topics", req.params.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return res.status(404).json({ error: "Topic not found" });

    const commentsRef = collection(db, "topics", req.params.id, "comments");
    const commentSnap = await getDocs(commentsRef);
    const comments = commentSnap.docs.map(c => ({ id: c.id, ...c.data() }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    res.json({ topic: { id: docSnap.id, ...docSnap.data() }, comments });
  } catch (err) {
    res.status(500).json({ error: "Failed to load topic" });
  }
});

app.post("/forum/topics/:id/comments", async (req, res) => {
  const { authorId, authorName, authorAvatar, text } = req.body;
  if (!authorId || !text) return res.status(400).json({ error: "Missing fields" });
  try {
    await addDoc(collection(db, "topics", req.params.id, "comments"), {
      authorId,
      authorName,
      authorAvatar: authorAvatar || null,
      text,
      createdAt: new Date().toISOString(),
    });
    res.json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

app.post("/users/:id/rate", async (req, res) => {
  const { raterId, stars, comment } = req.body;
  const userId = req.params.id;
  if (!raterId || !stars || stars < 1 || stars > 5) return res.status(400).json({ error: "Invalid data" });

  const ratingsRef = collection(db, "users", userId, "ratings");
  const q = query(ratingsRef, where("raterId", "==", raterId));
  const exist = await getDocs(q);
  let ratingId = exist.empty ? Date.now().toString() : exist.docs[0].id;

  await setDoc(doc(ratingsRef, ratingId), {
    raterId,
    stars,
    comment: comment || "",
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true });
});

app.get("/users/:id/ratings", async (req, res) => {
  const ratingsRef = collection(db, "users", req.params.id, "ratings");
  const snap = await getDocs(ratingsRef);
  const ratings = snap.docs.map(doc => doc.data());
  const avg = ratings.length
    ? (ratings.reduce((a, r) => a + r.stars, 0) / ratings.length).toFixed(2)
    : null;
  res.json({ ratings, average: avg, count: ratings.length });
});

app.use(session({ secret: "codeswap_secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://codeswap-3jvp.onrender.com/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const fullName = profile.displayName;
    const userRef = doc(db, "users", email);
    await setDoc(userRef, {
      email,
      fullName,
      provider: "google",
      lastLogin: new Date().toISOString()
    }, { merge: true });
    done(null, { email, fullName });
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/callback", passport.authenticate("google", {
  session: false,
  failureRedirect: "/auth/google/failure"
}), (req, res) => {
  const user = req.user;

    const redirectUrl = `codeswap://login-success?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.fullName)}&provider=google`;
    return res.redirect(redirectUrl);
});

app.get("/auth/google/failure", (req, res) => {
  res.status(401).json({ error: "Google authentication failed" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
