import React, { useState } from "react";
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
} from "react-native";
import Header from "../../components/ui/Header";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type Topic = {
  id: string;
  title: string;
};

export default function ForumScreen() {
  const [topics, setTopics] = useState<Topic[]>([
    { id: "1", title: "How to learn React Native fast?" },
    { id: "2", title: "Looking for a study buddy for TypeScript" },
    { id: "3", title: "Best VSCode extensions for JS devs?" },
    { id: "4", title: "Share your daily coding routine!" },
  ]);

  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const addTopic = () => {
    if (newTopic.trim() === "") return;
    const newOne = { id: Date.now().toString(), title: newTopic.trim() };
    setTopics([newOne, ...topics]);
    setNewTopic("");
    setShowModal(false);
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
          <TouchableOpacity style={styles.topicItem}>
            <Text style={styles.topicTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

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
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={{ color: "#A0AEC0", fontWeight: "600" }}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.addButton} onPress={addTopic}>
                <Text style={{ color: "#FFF", fontWeight: "600" }}>Add</Text>
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
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
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
