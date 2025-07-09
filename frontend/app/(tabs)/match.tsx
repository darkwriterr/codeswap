import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-deck-swiper';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCredentials } from '../../lib/auth';

const { width, height } = Dimensions.get('window');
const router = useRouter();

const LANG_COLORS = [
  '#A5B4FC', // light indigo
  '#F87171', // red
  '#FBBF24', // yellow
  '#6EE7B7', // green
  '#38BDF8', // blue
  '#F472B6', // pink
  '#FACC15', // gold
  '#A3E635', // lime
  '#FCD34D', // amber
  '#C084FC', // violet
];

type Profile = {
  id: string;
  fullName: string;
  avatar: string | null;
  bio: string;
  learningStyle: string;
  languagesKnown: string[];
  languagesLearning: string[];
  availability: string;
};

export default function MatchScreen() {
  const swiperRef = useRef<Swiper<any>>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { email } = await getCredentials();
        if (!email) {
          setProfiles([]);
          setLoading(false);
          return;
        }
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/users/swipe?excludeEmail=${encodeURIComponent(email)}`);
        const data = await res.json();
        setProfiles(data);
      } catch (e) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSwiped = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleLeftSwipe = () => {
    if (currentIndex < profiles.length) {
      swiperRef.current?.swipeLeft();
    }
  };

  const handleRightSwipe = () => {
    if (currentIndex < profiles.length) {
      swiperRef.current?.swipeRight();
    }
  };

  const getLangColor = (idx: number) =>
    LANG_COLORS[idx % LANG_COLORS.length];

  const renderCard = (profile: Profile | null): React.ReactElement | null => {
    if (!profile) return null;
    return (
      <TouchableOpacity
      activeOpacity={0.91}
      style={{ flex: 1 }}
      onPress={() => router.push(`./rate-partner/${profile.id}`)}
      >
        <Animated.View style={styles.card}>
          <LinearGradient
            colors={['#6366F1', '#818CF8', '#fff']}
            start={{ x: 0.1, y: 0.2 }}
            end={{ x: 0.7, y: 0.9 }}
            style={styles.gradient}
          />
          <View style={styles.cardInner}>
            <View style={styles.avatarWrap}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <Ionicons name="person-circle" size={100} color="#A5B4FC" />
                </View>
              )}
            </View>
            <LinearGradient
              colors={['#6366F1', '#818CF8']}
              style={styles.nameBadge}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={styles.name}>{profile.fullName}</Text>
            </LinearGradient>
            <View style={styles.rowInfo}>
              <Ionicons name="bulb-outline" size={18} color="#6366F1" />
              <Text style={styles.infoText}>{profile.learningStyle}</Text>
            </View>
            <View style={styles.skills}>
              {profile.languagesKnown.map((skill, idx) => (
                <View
                  style={[styles.tag, { backgroundColor: getLangColor(idx), borderColor: 'rgba(0,0,0,0.07)' }]}
                  key={idx}
                >
                  <Text style={[styles.tagText, { color: "#fff", fontWeight: "bold" }]}>{skill}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.bio}>{profile.bio}</Text>
            <View style={styles.rowInfo}>
              <Ionicons name="calendar-outline" size={18} color="#6366F1" />
              <Text style={styles.infoText}>{profile.availability}</Text>
            </View>
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={18} color="#6366F1" />
                <Text style={styles.sectionTitle}>Wants to learn</Text>
              </View>
              <View style={styles.skills}>
                {profile.languagesLearning.map((lang, idx) => (
                  <View
                    style={[
                      styles.tag,
                      styles.learnTag,
                      { backgroundColor: "#fff", borderColor: getLangColor(idx) }
                    ]}
                    key={idx}
                  >
                    <Text style={[
                      styles.tagText,
                      styles.learnTagText,
                      { color: getLangColor(idx), fontWeight: 'bold' }
                    ]}>{lang}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsRow}>
      {profiles.map((_, idx) => (
        <View
          key={idx}
          style={[
            styles.dot,
            idx === currentIndex ? styles.activeDot : {},
            idx > currentIndex ? styles.upcomingDot : {},
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="code-slash" size={26} color="#6366F1" style={{ marginRight: 7 }} />
          <Text style={styles.headerTitle}>Study Partner Finder</Text>
        </View>
        <TouchableOpacity onPress={() => alert('Advanced filter coming soon')}>
          <Feather name="sliders" size={22} color="#6366F1" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {renderDots()}

      <View style={styles.swiperZone}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : currentIndex < profiles.length ? (
          <Swiper
            ref={swiperRef}
            cards={profiles}
            cardIndex={currentIndex}
            renderCard={renderCard}
            onSwiped={handleSwiped}
            stackSize={3}
            backgroundColor="transparent"
            disableTopSwipe
            disableBottomSwipe
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: { label: { color: '#F56565', fontSize: 22, fontWeight: '700' } },
              },
              right: {
                title: 'CONNECT',
                style: { label: { color: '#48BB78', fontSize: 22, fontWeight: '700' } },
              },
            }}
            infinite={false}
            containerStyle={{ flexGrow: 0, height: height * 0.6 }}
          />
        ) : (
          <View style={styles.noMoreContainer}>
            <Ionicons name="rocket-outline" size={58} color="#6366F1" />
            <Text style={styles.noMoreText}>No more profiles today.<Text style={{ color: "#6366F1" }}> Come back tomorrow!</Text></Text>
          </View>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={handleLeftSwipe}
          style={[styles.circleButton, { borderColor: '#F56565', shadowColor: '#F56565' }]}
        >
          <AntDesign name="close" size={30} color="#F56565" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => alert('Super Like is premium')}
          style={[styles.circleButton, { borderColor: '#FFD600', shadowColor: '#FFD600' }]}
        >
          <AntDesign name="star" size={28} color="#FFD600" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRightSwipe}
          style={[styles.circleButton, { borderColor: '#48BB78', shadowColor: '#48BB78' }]}
        >
          <AntDesign name="check" size={30} color="#48BB78" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    width: width * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 7,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#23224A',
  },
  filterIcon: {
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    padding: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E0E7FF',
    margin: 4,
    opacity: 0.5,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#6366F1',
    opacity: 1,
  },
  upcomingDot: {
    opacity: 0.25,
  },
  swiperZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    minHeight: height * 0.53,
    backgroundColor: '#fff',
    borderRadius: 28,
    marginTop: 16,
    shadowColor: '#6366F1',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 32,
    elevation: 18,
    alignSelf: 'center',
    overflow: 'visible',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.09,
    borderRadius: 28,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  avatarWrap: {
    backgroundColor: '#EEF2FF',
    padding: 6,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#A5B4FC',
    marginBottom: 10,
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#818CF8',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  placeholderAvatar: {
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBadge: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 6,
    marginBottom: 10,
    alignSelf: 'center',
    shadowColor: '#818CF8',
    shadowOpacity: 0.23,
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#312E81',
    fontWeight: '500',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 3,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 14,
    margin: 3,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  tagText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13.5,
    letterSpacing: 0.1,
  },
  learnTag: {
    backgroundColor: '#fff',
  },
  learnTagText: {
    color: '#6366F1',
    fontWeight: '700',
  },
  sectionBlock: {
    alignSelf: 'stretch',
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 5,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 14.2,
    fontWeight: '700',
    color: '#312E81',
  },
  bio: {
    fontSize: 15.5,
    color: '#5C5E76',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 6,
    marginTop: 7,
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.78,
    alignSelf: 'center',
    marginVertical: 22,
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  noMoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 50,
  },
  noMoreText: {
    marginTop: 18,
    fontSize: 19,
    color: '#6366F1',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
});
