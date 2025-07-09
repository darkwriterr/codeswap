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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://codeswap-3jvp.onrender.com";

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [topic, setTopic] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<any>>(null);

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

  useEffect(() => {
    if (comments.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 180);
    }
  }, [comments.length]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      {/* --- CUSTOM HEADER --- */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text numberOfLines={3} style={styles.topicTitle}>{topic.title}</Text>
        <View style={styles.headerRow}>
          {topic.authorAvatar ? (
            <Image source={{ uri: topic.authorAvatar }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <Ionicons name="person-circle" size={20} color="#A5B4FC" />
            </View>
          )}
          <Text style={styles.headerAuthor}>{topic.authorName || "Anonymous"}</Text>
          <Text style={styles.headerDot}>·</Text>
          <Text style={styles.headerDate}>{formatDateTime(topic.createdAt)}</Text>
        </View>
      </View>

      {/* --- COMMENTS --- */}
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            {item.authorAvatar
              ? <Image source={{ uri: item.authorAvatar }} style={styles.commentAvatar} />
              : <View style={styles.commentAvatarPlaceholder}>
                  <Ionicons name="person-circle" size={26} color="#A5B4FC" />
                </View>
            }
            <View style={styles.commentBody}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{item.authorName || "Anonymous"}</Text>
                <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
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
        keyboardShouldPersistTaps="handled"
      />

      {/* --- INPUT --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.bottom + 6}
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
    </SafeAreaView>
  );
}

// --- HELPERS ---
function formatDateTime(dt: string) {
  const date = new Date(dt);
  return (
    date
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) +
    ", " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}
function formatTime(dt: string) {
  const date = new Date(dt);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// --- STYLES ---
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingBottom: 13,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: "flex-start",
    marginBottom: 8,
    minHeight: 0, // никакой огромной высоты!
    justifyContent: "flex-end",
    elevation: 3,
    shadowColor: "#6366F1",
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
  },
  topicTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    lineHeight: 27,
    flexShrink: 1,
    maxWidth: "98%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  headerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: "#F3F4F6",
  },
  headerAvatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAuthor: {
    fontWeight: "700",
    fontSize: 13.2,
    color: "#fff",
    marginRight: 3,
  },
  headerDot: {
    color: "#CBD5E0",
    fontSize: 12,
    marginRight: 3,
  },
  headerDate: {
    fontSize: 11.5,
    color: "#CBD5E0",
    fontWeight: "500",
  },
  // ----- COMMENTS -----
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 13,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowOpacity: 0.10,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: "#F3F4F6",
  },
  commentAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  commentAuthor: {
    fontWeight: "700",
    color: "#6366F1",
    fontSize: 15,
    marginRight: 10,
  },
  commentText: {
    fontSize: 15.7,
    color: "#23224A",
    marginTop: 1,
    fontWeight: "400",
    lineHeight: 22,
  },
  commentTime: {
    fontSize: 11.5,
    color: "#A0AEC0",
    marginTop: 1,
    alignSelf: "flex-end",
  },
  // ----- ИНПУТ -----
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
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    fontSize: 16,
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
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
