import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

const COLORS = {
  background: '#121214',
  cardBackground: '#1E1E24',
  electricTeal: '#00F2C3',
  sunsetCoral: '#FF5E7E',
  textLight: '#FFFFFF',
  textMuted: '#A0A0B0',
  accentDark: '#2A2A35',
  ghostPurple: '#9D4EDD',
};

interface ProfileCard {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  avatarIcon: string;
  isGhostMode: boolean;
  favoriteGames: string[];
}

const PROFILES_DATA: ProfileCard[] = [
  {
    id: 'user_1',
    name: 'Alexis',
    age: 26,
    location: '3 miles away',
    bio: 'Looking for a Spades partner who actually knows how to count cards! 🃏',
    avatarIcon: '💃',
    isGhostMode: false,
    favoriteGames: ['Spades', 'Word Clash', 'Trivia'],
  },
  {
    id: 'user_2',
    name: 'Card Shark #402',
    age: 28,
    location: 'Ghost Mode (Nearby)',
    bio: 'Incognito until we play a round of Dominoes or Pool! GG win to reveal.',
    avatarIcon: '👻',
    isGhostMode: true,
    favoriteGames: ['Dominoes', '8-Ball Pool'],
  },
  {
    id: 'user_3',
    name: 'Jordan',
    age: 24,
    location: '5 miles away',
    bio: 'Competitive in Word Clash and casual in Hearts. Let’s play a match!',
    avatarIcon: '🕺',
    isGhostMode: false,
    favoriteGames: ['Word Clash', 'Hearts', 'Dice Roll'],
  },
];

export default function MatchScreen() {
  const [profiles, setProfiles] = useState<ProfileCard[]>(PROFILES_DATA);

  const handleChallenge = (profile: ProfileCard) => {
    Alert.alert(
      `Challenge ${profile.name}`,
      `Choose a game to initiate your match icebreaker:`,
      [
        {
          text: '♠️ Spades (2v2)',
          onPress: () => sendGameInvite(profile, 'Spades'),
        },
        {
          text: '🔤 Word Clash',
          onPress: () => sendGameInvite(profile, 'Word Clash'),
        },
        {
          text: '🀩 Dominoes',
          onPress: () => sendGameInvite(profile, 'Dominoes'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendGameInvite = (profile: ProfileCard, gameName: string) => {
    Alert.alert(
      'Invite Sent!',
      `You challenged ${profile.name} to ${gameName}. Chat unlocks as soon as the first move is played!`
    );
  };

  const handleRevealRequest = (profile: ProfileCard) => {
    Alert.alert(
      'Mutual Profile Reveal',
      `Send a reveal request to ${profile.name}? If they accept, both of your photos and full profiles will be unlocked!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Reveal Request',
          onPress: () =>
            Alert.alert('Request Sent!', 'Notification sent. Waiting for mutual agreement.'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Hub</Text>
        <Text style={styles.headerSub}>Find matches through shared casual games</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {profiles.map((profile) => (
          <View
            key={profile.id}
            style={[
              styles.profileCard,
              profile.isGhostMode && styles.ghostProfileCard,
            ]}
          >
            {/* Header / Avatar */}
            <View style={styles.cardHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarIcon}>{profile.avatarIcon}</Text>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>
                    {profile.name}, {profile.age}
                  </Text>
                  {profile.isGhostMode && (
                    <View style={styles.ghostBadge}>
                      <Text style={styles.ghostBadgeText}>👻 GHOST</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.locationText}>{profile.location}</Text>
              </View>
            </View>

            {/* Bio */}
            <Text style={styles.bioText}>{profile.bio}</Text>

            {/* Favorite Games Badges */}
            <Text style={styles.badgeSectionTitle}>Favorite Games:</Text>
            <View style={styles.badgesContainer}>
              {profile.favoriteGames.map((game, index) => (
                <View key={index} style={styles.gameBadge}>
                  <Text style={styles.gameBadgeText}>{game}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.challengeButton}
                onPress={() => handleChallenge(profile)}
              >
                <Text style={styles.challengeButtonText}>🎮 Challenge to Game</Text>
              </TouchableOpacity>

              {profile.isGhostMode ? (
                <TouchableOpacity
                  style={styles.revealButton}
                  onPress={() => handleRevealRequest(profile)}
                >
                  <Text style={styles.revealButtonText}>🔓 Request Reveal</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() =>
                    Alert.alert('Spark Sent!', `You sent a spark to ${profile.name}!`)
                  }
                >
                  <Text style={styles.likeButtonText}>💖 Spark</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderColor: COLORS.accentDark,
    borderWidth: 1,
  },
  ghostProfileCard: {
    borderColor: COLORS.ghostPurple,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accentDark,
    alignItems: 'center',
    justifyContent: 'center
