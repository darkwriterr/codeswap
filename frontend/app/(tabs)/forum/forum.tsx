import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import Header from "../../../components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getCredentials } from "../../../lib/auth";
import { formatDistanceToNow } from "date-fns";

const { width } = Dimensions.get("window");
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://codeswap-3jvp.onrender.com";

type Topic = {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
};

export default function ForumScreen() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const router = useRouter();

  // Получение топиков с сервера
  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/forum/topics`);
        const data = await res.json();
        setTopics(Array.isArray(data) ? data : []);
      } catch {
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  // Создание новой темы на сервере
  const addTopic = async () => {
    if (newTopic.trim() === "") return;
    setCreating(true);

    try {
      const { email, password } = await getCredentials();

      // Получить свой профиль напрямую
      const userRes = await fetch(`${API_URL}/get_information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const { data: me } = await userRes.json();
      if (!me) throw new Error("Your user not found");

      const res = await fetch(`${API_URL}/forum/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTopic.trim(),
          authorId: me.id || me.email, // Если нет id, можно использовать email
          authorName: me.fullName,
          authorAvatar: me.avatar || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create topic");

      setShowModal(false);
      setNewTopic("");
      const updated = await fetch(`${API_URL}/forum/topics`).then(r => r.json());
      setTopics(Array.isArray(updated) ? updated : []);
    } catch (e) {
      let errorMsg = "Unknown error";
      if (e && typeof e === "object" && "message" in e) {
        errorMsg = (e as { message: string }).message;
      } else if (typeof e === "string") {
        errorMsg = e;
      }
      alert("Error creating topic : " + errorMsg);
    } finally {
      setCreating(false);
    }
  };


  const goToTopic = (topicId: string) => {
    router.push(`/(tabs)/forum/${topicId}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <Header />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0AEC0" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search topics..."
          placeholderTextColor="#A0AEC0"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5A67D8" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredTopics}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#A0AEC0", marginTop: 50 }}>
              No topics found.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.topicItem} onPress={() => goToTopic(item.id)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.authorAvatar ? (
                  <Image source={{ uri: item.authorAvatar }} style={styles.avatar} />
                ) : (
                  <Ionicons name="person-circle" size={38} color="#CBD5E0" style={{ marginRight: 8 }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicTitle}>{item.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                    <Text style={styles.authorName}>
                      {item.authorName}
                    </Text>
                    <Text style={styles.dotSep}>·</Text>
                    <Text style={styles.timeAgo}>
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Topic</Text>
            <TextInput
              placeholder="Type your topic..."
              style={styles.modalInput}
              value={newTopic}
              onChangeText={setNewTopic}
              editable={!creating}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={{ color: "#A0AEC0", fontWeight: "600" }}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.addButton} onPress={addTopic} disabled={creating}>
                <Text style={{ color: "#FFF", fontWeight: "600" }}>
                  {creating ? "Adding..." : "Add"}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    borderRadius: 20,
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A202C",
  },
  topicItem: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 9,
    elevation: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: "#F3F4F6",
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 1,
  },
  authorName: {
    fontSize: 13.5,
    color: "#5A67D8",
    fontWeight: "700",
  },
  timeAgo: {
    fontSize: 12.5,
    color: "#94A3B8",
    marginLeft: 4,
  },
  dotSep: {
    color: "#CBD5E0",
    marginHorizontal: 4,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 40,
    backgroundColor: "#5A67D8",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1A202C",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#1A202C",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#5A67D8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
