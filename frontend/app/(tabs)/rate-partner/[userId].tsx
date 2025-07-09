import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getCredentials } from "../../../lib/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://codeswap-3jvp.onrender.com";

export default function RatePartnerScreen() {
  const { userId, userName } = useLocalSearchParams() as { userId: string; userName: string };

  const [myRating, setMyRating] = useState<{ stars: number; comment: string } | null>(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState<{ average: number | null; count: number | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { email, password } = await getCredentials();
        const userRes = await fetch(`${API_URL}/get_information`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const userJson = await userRes.json();
        const me = userJson?.data;
        if (!me) throw new Error("Not authorized");

        const ratingsRes = await fetch(`${API_URL}/users/${userId}/ratings`);
        const ratingsJson = await ratingsRes.json();
        const { ratings = [], average, count } = ratingsJson;
        setStats({ average, count });

        const mine = ratings.find((r: { raterId: string; stars: number }) => r.raterId === me.id || r.raterId === me.email);
        if (mine) {
          setMyRating(mine);
          setStars(mine.stars);
          setComment(mine.comment);
        }
      } catch (e) {
        Alert.alert("Error", e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  async function submitRating() {
    setSubmitting(true);
    try {
      const { email, password } = await getCredentials();
      const userRes = await fetch(`${API_URL}/get_information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const userJson = await userRes.json();
      const me = userJson?.data;
      if (!me) throw new Error("Not authorized");
      if ((me.id || me.email) === userId) throw new Error("Can't rate yourself");
      if (!stars) throw new Error("Select your rating!");

      const res = await fetch(`${API_URL}/users/${userId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          raterId: me.id || me.email,
          stars,
          comment,
        }),
      });
      if (!res.ok) throw new Error("Failed to rate");
      setMyRating({ stars, comment });
      Alert.alert("Thank you!", "Your rating has been submitted.");
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1, paddingHorizontal: 0 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={styles.container}>
            <Text style={styles.header}>Rate your study partner</Text>
            <Text style={styles.userName}>{userName}</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#6366F1" style={{ marginVertical: 22 }} />
            ) : stats ? (
              <Text style={styles.stats}>
                Average: {stats.average ? stats.average.toFixed(2) : "-"} / 5  ({stats.count ?? 0} ratings)
              </Text>
            ) : null}

            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(i =>
                <TouchableOpacity
                  key={i}
                  onPress={() => !myRating && setStars(i)}
                  disabled={!!myRating}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={i <= stars ? "star" : "star-outline"}
                    size={54}
                    color="#F9C846"
                    style={{ margin: 7 }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Leave a comment (optional)"
              value={comment}
              onChangeText={setComment}
              editable={!myRating}
              multiline
              placeholderTextColor="#A0AEC0"
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: myRating || !stars ? "#CBD5E0" : "#6366F1" }
              ]}
              onPress={submitRating}
              disabled={!!myRating || !stars || submitting}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}>
                {myRating ? "Rated" : submitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>

            {myRating && (
              <Text style={{ color: "#6366F1", marginTop: 18, fontSize: 16 }}>
                You have already rated this user.
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    flex: 1,
    backgroundColor: "#F8FAFF",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 29,
    fontWeight: "900",
    color: "#23224A",
    marginBottom: 6,
    marginTop: 3,
    alignSelf: "flex-start",
  },
  userName: {
    fontSize: 21,
    color: "#6366F1",
    fontWeight: "700",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  stats: {
    fontSize: 15,
    color: "#5A67D8",
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 18,
    justifyContent: "center",
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 13,
    fontSize: 17,
    minHeight: 54,
    marginBottom: 25,
    color: "#23224A",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  button: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 4,
    marginBottom: 2,
  },
});
