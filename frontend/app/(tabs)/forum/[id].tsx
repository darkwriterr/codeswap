import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getCredentials } from "../../../lib/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://codeswap-3jvp.onrender.com";

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const fetchTopic = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forum/topics/${id}`);
      const data = await res.json();
      setTopic(data.topic);
      setComments(data.comments || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchTopic(); }, [id]);

  const sendComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const { email, password } = await getCredentials();
      const userRes = await fetch(`${API_URL}/get_information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const { data: me } = await userRes.json();
      if (!me) throw new Error("User not found");

      const res = await fetch(`${API_URL}/forum/topics/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: me.id || me.email,
          authorName: me.fullName,
          authorAvatar: me.avatar || null,
          text: newComment.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send comment");

      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          authorName: me.fullName,
          authorAvatar: me.avatar || null,
          text: newComment.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewComment("");
      inputRef.current?.clear();
      Keyboard.dismiss();
    } catch (e) {
      alert("Failed to send comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} color="#6366F1" />;

  if (!topic)
    return <Text style={{ margin: 40 }}>Topic not found.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>{topic.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          {topic.authorAvatar ? (
            <Image source={{ uri: topic.authorAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle" size={28} color="#A5B4FC" />
            </View>
          )}
          <Text style={styles.author}>{topic.authorName || "Anonymous"}</Text>
          <Text style={styles.date}>• {new Date(topic.createdAt).toLocaleString()}</Text>
        </View>
      </View>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            {item.authorAvatar ? (
              <Image source={{ uri: item.authorAvatar }} style={styles.commentAvatar} />
            ) : (
              <View style={styles.commentAvatarPlaceholder}>
                <Ionicons name="person-circle" size={30} color="#A5B4FC" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 1 }}>
                <Text style={styles.commentAuthor}>{item.authorName || "Anonymous"}</Text>
                <Text style={styles.commentDate}>
                  {" "}{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                </Text>
              </View>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#A0AEC0", marginTop: 30, textAlign: "center" }}>
            No comments yet. Be first!
          </Text>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
        style={styles.inputBarWrapper}
      >
        <View style={styles.inputBar}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#A0AEC0"
            value={newComment}
            onChangeText={setNewComment}
            editable={!submitting}
            onSubmitEditing={sendComment}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: newComment.trim() && !submitting ? 1 : 0.45 },
            ]}
            onPress={sendComment}
            disabled={!newComment.trim() || submitting}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 5,
    shadowColor: "#6366F1",
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 16,
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.1,
    marginBottom: 3,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  author: {
    fontWeight: "700",
    fontSize: 14,
    marginRight: 8,
    color: "#fff",
    backgroundColor: "#818CF8",
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  date: {
    fontSize: 12,
    color: "#CBD5E0",
    fontWeight: "500",
  },
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowOpacity: 0.07,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  commentAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  commentAuthor: {
    fontWeight: "700",
    color: "#6366F1",
    marginRight: 7,
    fontSize: 15,
  },
  commentText: {
    fontSize: 15.7,
    color: "#23224A",
    marginTop: 0,
    fontWeight: "400",
    lineHeight: 22,
  },
  commentDate: {
    fontSize: 11.5,
    color: "#A0AEC0",
    marginTop: 1,
  },
  inputBarWrapper: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    backgroundColor: "transparent",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E7FF",
    padding: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    fontSize: 16,
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === "ios" ? 13 : 8,
    marginRight: 8,
    color: "#23224A",
  },
  sendButton: {
    backgroundColor: "#6366F1",
    borderRadius: 20,
    padding: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
