import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type Profile = {
  id: number;
  name: string;
  skills: string[];
  bio: string;
  availability: string;
  interests: string[];
  avatar: string;
};

const profilesData: Profile[] = [
  {
    id: 1,
    name: 'Alex Kim',
    skills: ['Python', 'JavaScript', 'C++', 'Learning React', 'Advanced JS'],
    bio: 'Full-stack enthusiast looking for a React partner.',
    availability: 'Available Wed & Fri evenings',
    interests: ['Python', 'JavaScript'],
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: 2,
    name: 'Maria Lopez',
    skills: ['Java', 'Spring', 'SQL'],
    bio: 'Backend dev ready to collab on DB projects.',
    availability: 'Weekends',
    interests: ['Java', 'SQL'],
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 3,
    name: 'John Doe',
    skills: ['React Native', 'TypeScript'],
    bio: 'Frontend lover, let\'s build!',
    availability: 'Mon & Thu afternoons',
    interests: ['React Native'],
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    id: 4,
    name: 'Emma Brown',
    skills: ['Go', 'Microservices'],
    bio: 'Cloud engineer, scalable systems.',
    availability: 'Flexible evenings',
    interests: ['Go'],
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  {
    id: 5,
    name: 'Lucas Smith',
    skills: ['Rust', 'Blockchain'],
    bio: 'Smart contracts and crypto tech.',
    availability: 'Weekends',
    interests: ['Rust'],
    avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
  },
];

export default function MatchScreen() {
  const swiperRef = useRef<Swiper<any>>(null);
  const [profiles, setProfiles] = useState(profilesData);
  const [currentIndex, setCurrentIndex] = useState(0);

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

interface RenderCardProps {
    profile: Profile;
}

const renderCard = (profile: Profile | null): React.ReactElement | null => {
    if (!profile) return null;
    return (
        <View style={styles.card}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.skills}>
                {profile.skills.map((skill: string, idx: number) => (
                    <Text key={idx} style={styles.skillTag}>{skill}</Text>
                ))}
            </View>
            <Text style={styles.bio}>{profile.bio}</Text>
            <Text style={styles.availability}>🕒 {profile.availability}</Text>
            <View style={styles.common}>
                <Text style={styles.commonTitle}>👥 Common Interests</Text>
                <View style={styles.skills}>
                    {profile.interests.map((int: string, idx: number) => (
                        <Text key={idx} style={[styles.skillTag, styles.commonTag]}>{int}</Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="code-slash" size={22} color="#5A67D8" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>Find Your Study Match</Text>
        </View>
        <TouchableOpacity onPress={() => alert('Filter coming soon')}>
          <Feather name="filter" size={20} color="#1A202C" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.profilesLeft}>
        <Ionicons name="people-outline" size={16} color="#5A67D8" />
        <Text style={styles.profilesLeftText}>
          {Math.max(profiles.length - currentIndex, 0)} profile
          {profiles.length - currentIndex !== 1 ? 's' : ''} left today
        </Text>
      </View>

      <View style={styles.swiperZone}>
        {currentIndex < profiles.length ? (
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
                style: { label: { color: '#F56565', fontSize: 24, fontWeight: 'bold' } },
              },
              right: {
                title: 'CONNECT',
                style: { label: { color: '#48BB78', fontSize: 24, fontWeight: 'bold' } },
              },
            }}
            infinite={false}
            containerStyle={{ flexGrow: 0, height: height * 0.6 }}
          />
        ) : (
          <View style={styles.noMoreContainer}>
            <Ionicons name="sad-outline" size={48} color="#A0AEC0" />
            <Text style={styles.noMoreText}>No more profiles left today!</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={handleLeftSwipe}
          style={[styles.circleButton, { borderColor: '#F56565' }]}
        >
          <AntDesign name="close" size={28} color="#F56565" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => alert('Super Like coming soon')}
          style={[styles.circleButton, { borderColor: '#ECC94B' }]}
        >
          <AntDesign name="star" size={26} color="#ECC94B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRightSwipe}
          style={[styles.circleButton, { borderColor: '#48BB78' }]}
        >
          <AntDesign name="check" size={28} color="#48BB78" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    width: width * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  filterIcon: {
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    padding: 8,
  },
  profilesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profilesLeftText: {
    marginLeft: 6,
    color: '#1A202C',
    fontSize: 13,
    fontWeight: '500',
  },
  swiperZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 5,
    alignSelf: 'center',
    minHeight: height * 0.55,
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#5A67D8',
    marginBottom: 16,
    alignSelf: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 12,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    margin: 4,
    fontSize: 14,
    color: '#1A202C',
  },
  commonTag: {
    backgroundColor: '#C3DAFE',
    color: '#3730A3',
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 10,
  },
  availability: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 12,
  },
  common: {
    marginTop: 10,
    alignItems: 'center',
  },
  commonTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 6,
    color: '#1A202C',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.7,
    alignSelf: 'center',
    marginVertical: 20,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  noMoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noMoreText: {
    marginTop: 12,
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '600',
  },
});
