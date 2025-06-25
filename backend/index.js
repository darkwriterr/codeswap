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
  res.json({
    message: "Google login successful",
    user: {
      email: user.email,
      fullName: user.fullName,
      provider: "google"
    }
  });
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
