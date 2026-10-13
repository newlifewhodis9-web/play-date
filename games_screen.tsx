import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';

const COLORS = {
  background: '#121214',
  cardBackground: '#1E1E24',
  electricTeal: '#00F2C3',
  sunsetCoral: '#FF5E7E',
  textLight: '#FFFFFF',
  textMuted: '#A0A0B0',
  accentDark: '#2A2A35',
};

interface GameItem {
  id: string;
  title: string;
  category: string;
  players: string;
  icon: string;
  adRewardCoins: number;
}

const GAME_ROSTER: GameItem[] = [
  { id: '1', title: 'Spades', category: 'Classic Cards', players: '2v2 Partners', icon: '♠️', adRewardCoins: 120 },
  { id: '2', title: 'Word Clash', category: 'Scrabble Style', players: 'Turn-Based 1v1', icon: '🔤', adRewardCoins: 100 },
  { id: '3', title: '8-Ball Pool', category: 'Sports', players: 'Real-Time 1v1', icon: '🎱', adRewardCoins: 150 },
  { id: '4', title: 'Dominoes', category: 'Board', players: '1v1 or 4-Player', icon: '🀩', adRewardCoins: 110 },
  { id: '5', title: 'Dice Roll', category: 'Yahtzee Style', players: 'Turn-Based 1v1', icon: '🎲', adRewardCoins: 90 },
  { id: '6', title: 'Hearts', category: 'Classic Cards', players: '4-Player Free-For-All', icon: '♥️', adRewardCoins: 100 },
  { id: '7', title: 'Trivia Battles', category: 'Quiz', players: '60s Speed Duel', icon: '⚡', adRewardCoins: 80 },
];

export default function GamesScreen() {
  const [ghostModeEnabled, setGhostModeEnabled] = useState<boolean>(false);

  const handleLaunchGame = (game: GameItem) => {
    const privacyNotice = ghostModeEnabled 
      ? "\n👻 Ghost Mode is Active: Your photo and bio are hidden!" 
      : "";
    
    Alert.alert(
      `Launching ${game.title}`,
      `Finding an opponent for ${game.players}... ${privacyNotice}`,
      [{ text: 'Play & Earn Coins', onPress: () => {} }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Games Arcade</Text>
        <Text style={styles.headerSubtitle}>Play casual duels, meet matches & earn coin rewards</Text>
      </View>

      {/* Ghost Mode Toggle Header Card */}
      <View style={styles.ghostCard}>
        <View style={styles.ghostTextContainer}>
          <Text style={styles.ghostTitle}>👻 Ghost Mode Privacy</Text>
          <Text style={styles.ghostSub}>
            {ghostModeEnabled 
              ? 'Active: Hidden from public matching feeds. Game to reveal profile!' 
              : 'Off: Your profile picture is visible in game lobbies.'}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#3e3e3e', true: COLORS.sunsetCoral }}
          thumbColor={ghostModeEnabled ? COLORS.electricTeal : '#f4f3f4'}
          onValueChange={setGhostModeEnabled}
          value={ghostModeEnabled}
        />
      </View>

      {/* Game Grid */}
      <FlatList
        data={GAME_ROSTER}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gameCard}
            onPress={() => handleLaunchGame(item)}
          >
            <Text style={styles.gameIcon}>{item.icon}</Text>
            <Text style={styles.gameTitle}>{item.title}</Text>
            <Text style={styles.gameCategory}>{item.category}</Text>
            
            <View style={styles.cardFooter}>
              <Text style={styles.playerTag}>{item.players}</Text>
              <Text style={styles.coinReward}>+{item.adRewardCoins} 🪙</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  ghostCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLORS.sunsetCoral,
    borderWidth: 1,
    marginBottom: 20,
  },
  ghostTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  ghostTitle: {
    color: COLORS.textLight,
    fontWeight: 'bold',
    fontSize: 15,
  },
  ghostSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gameCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderColor: COLORS.accentDark,
    borderWidth: 1,
  },
  gameIcon: {
    fontSize: 38,
    marginBottom: 8,
  },
  gameTitle: {
    color: COLORS.textLight,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  gameCategory: {
    color: COLORS.electricTeal,
    fontSize: 12,
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  playerTag: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  coinReward: {
    color: COLORS.sunsetCoral,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
});
