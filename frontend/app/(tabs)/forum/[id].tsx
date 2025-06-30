import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://codeswap-3jvp.onrender.com";

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams(); // получаем id из URL
  const [topic, setTopic] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/forum/topics/${id}`);
        const data = await res.json();
        setTopic(data.topic);
        setComments(data.comments || []);
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!topic) return <Text style={{ margin: 40 }}>Topic not found.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFF", padding: 18 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.title}>{topic.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
          {topic.authorAvatar ? (
            <Image source={{ uri: topic.authorAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.author}>{topic.authorName}</Text>
          <Text style={styles.date}>{new Date(topic.createdAt).toLocaleString()}</Text>
        </View>
      </View>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            {item.authorAvatar ? (
              <Image source={{ uri: item.authorAvatar }} style={styles.commentAvatar} />
            ) : (
              <View style={styles.commentAvatarPlaceholder} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.commentAuthor}>{item.authorName || "Anonymous"}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: "#A0AEC0", marginTop: 30 }}>No comments yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 21, fontWeight: "700", color: "#23224A" },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: "#F3F4F6" },
  avatarPlaceholder: { width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: "#CBD5E0" },
  author: { fontWeight: "600", fontSize: 14, marginRight: 8, color: "#5A67D8" },
  date: { fontSize: 12, color: "#94A3B8" },
  comment: { flexDirection: "row", alignItems: "flex-start", marginBottom: 18, backgroundColor: "#fff", borderRadius: 11, padding: 12, marginTop: 7, shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: "#F3F4F6" },
  commentAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: "#E0E7FF" },
  commentAuthor: { fontWeight: "600", color: "#6366F1" },
  commentText: { fontSize: 15, color: "#1A202C", marginTop: 2 },
  commentDate: { fontSize: 11, color: "#A0AEC0", marginTop: 4 }
});