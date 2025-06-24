import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Header from "../../components/ui/Header";
import { Redirect, useRouter } from "expo-router";
import { getCredentials, clearCredentials } from "../../lib/auth";
import { getInformation } from "../../lib/api";

export default function HomeScreen() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { email, password } = await getCredentials();
      if (!email || !password) {
        setLoggedIn(false);
        setChecking(false);
        return;
      }

      try {
        const result = await getInformation(email, password);
        setName(result.data?.fullName ?? "User");
        setStreak(result.data?.streak ?? 0);
        setLoggedIn(true);
      } catch (e) {
        console.error("Failed to get user info:", e);
        setLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };

    fetchData();
  }, []);

  if (checking) return null;
  if (!loggedIn) return <Redirect href="/(auth)/login" />;

  const handleLogout = async () => {
    await clearCredentials();
    router.replace("/(auth)/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>

        {/* Welcome & Streak */}
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome back, {name}!</Text>
          <Text style={styles.streak}>🔥 Current streak: <Text style={{ color: '#5A67D8' }}>{streak} days</Text></Text>
        </View>

        {/* Today's Session */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today&#39;s Session</Text>
          <Text style={styles.time}>3:30 PM</Text>
          <Text style={styles.with}>With <Text style={styles.bold}>Alex Johnson</Text></Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Join</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Quiz */}
        <View style={[styles.card, styles.quizCard]}>
          <View>
            <Text style={styles.quizTitle}>⚡ Daily Quiz</Text>
            <Text style={styles.quizSubtitle}>Challenge yourself. Keep the streak going!</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/quiz')} style={styles.startButton}>
            <Text style={styles.startText}>Start Now</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Match */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎙 Quick Match</Text>

          <View style={styles.matchRow}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Samir Patel</Text>
              <Text style={styles.skill}>Python, C++</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={() => router.push('/match')}>
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.matchRow}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/42.jpg' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Diego Ruiz</Text>
              <Text style={styles.skill}>JavaScript, React</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={() => router.push('/match')}>
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.card}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.sectionTitle}>📅 Upcoming Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sessionRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>28</Text>
              <Text style={styles.dateMonth}>May</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionTitle}>Pair Programming</Text>
              <Text style={styles.sessionWith}>With Taylor - 7:00 PM</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.details}>Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sessionRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>30</Text>
              <Text style={styles.dateMonth}>May</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionTitle}>Quiz Review</Text>
              <Text style={styles.sessionWith}>With Samir - 6:00 PM</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.details}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  welcomeText: { fontSize: 18, fontWeight: 'bold' },
  streak: { marginTop: 4, color: '#4A5568' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  time: { fontSize: 32, fontWeight: 'bold' },
  with: { color: '#4A5568', marginBottom: 12 },
  bold: { fontWeight: 'bold' },
  joinButton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  joinText: { color: '#FFF', fontWeight: 'bold' },
  quizCard: {
    backgroundColor: '#5A67D8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  quizSubtitle: { color: '#E0E7FF', maxWidth: '70%' },
  startButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  startText: { color: '#5A67D8', fontWeight: 'bold' },
  matchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name: { fontWeight: 'bold' },
  skill: { color: '#718096' },
  connectButton: {
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  connectText: { color: '#5A67D8', fontWeight: 'bold' },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: { color: '#5A67D8', fontWeight: 'bold' },
  sessionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dateBox: {
    backgroundColor: '#5A67D8',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  dateDay: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dateMonth: { color: '#E0E7FF', fontSize: 12 },
  sessionTitle: { fontWeight: 'bold' },
  sessionWith: { color: '#718096' },
  details: { color: '#5A67D8', fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  logoutText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
