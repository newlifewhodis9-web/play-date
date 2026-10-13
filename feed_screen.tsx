import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
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
  adGold: '#FFD700',
};

interface FeedPost {
  id: string;
  type: 'game_win' | 'challenge' | 'status' | 'sponsored_ad';
  userName: string;
  avatarIcon: string;
  timeAgo: string;
  content: string;
  gameTag?: string;
  likesCount: number;
  commentsCount: number;
  adRewardCoins?: number;
}

const INITIAL_FEED: FeedPost[] = [
  {
    id: 'post_1',
    type: 'game_win',
    userName: 'Marcus_CardShark',
    avatarIcon: '🎩',
    timeAgo: '10m ago',
    content: 'Just ran the table in 2v2 Spades! Partner and I took down 300 points in one hand. Who thinks they can beat us? ♠️🔥',
    gameTag: 'Spades',
    likesCount: 18,
    commentsCount: 5,
  },
  {
    id: 'post_2',
    type: 'sponsored_ad',
    userName: 'Play-Date Rewards',
    avatarIcon: '🎁',
    timeAgo: 'Sponsored',
    content: 'Watch a quick 15-second sponsor video to boost your daily coin earnings instantly!',
    likesCount: 142,
    commentsCount: 0,
    adRewardCoins: 250,
  },
  {
    id: 'post_3',
    type: 'challenge',
    userName: 'Sarah_WordPro',
    avatarIcon: '🎓',
    timeAgo: '35m ago',
    content: 'Looking for a serious opponent in Word Clash! Need a partner who actually knows 7-letter words. Hit challenge below! 🔤',
    gameTag: 'Word Clash',
    likesCount: 24,
    commentsCount: 8,
  },
  {
    id: 'post_4',
    type: 'game_win',
    userName: 'Dave8Ball',
    avatarIcon: '🎱',
    timeAgo: '1h ago',
    content: 'Bank shot on the 8-ball to seal the match! GG to my match partner, great game!',
    gameTag: '8-Ball Pool',
    likesCount: 31,
    commentsCount: 2,
  },
];

export default function FeedScreen() {
  const [feedData, setFeedData] = useState<FeedPost[]>(INITIAL_FEED);

  const handleLike = (id: string) => {
    setFeedData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likesCount: item.likesCount + 1 } : item
      )
    );
  };

  const handleChallengeUser = (userName: string, gameTag?: string) => {
    Alert.alert(
      'Challenge Sent!',
      `You challenged ${userName} to a match in ${gameTag || 'Games Arcade'}. Check your Match Hub when they accept!`
    );
  };

  const handleWatchSponsoredAd = (coins: number) => {
    Alert.alert(
      'Ad Reward Earned!',
      `You watched the sponsored video and earned +${coins} coins into your Wallet!`
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Play-Date Feed</Text>
        <TouchableOpacity 
          style={styles.postButton}
          onPress={() => Alert.alert('New Post', 'Share a game highlight or challenge to the community!')}
        >
          <Text style={styles.postButtonText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Main Social Scroll */}
      <FlatList
        data={feedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          // Sponsored Ad Post Card
          if (item.type === 'sponsored_ad') {
            return (
              <View style={[styles.card, styles.adCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.avatar}>{item.avatarIcon}</Text>
                    <View>
                      <Text style={[styles.userName, { color: COLORS.adGold }]}>
                        {item.userName}
                      </Text>
                      <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                    </View>
                  </View>
                  <View style={styles.adBadge}>
                    <Text style={styles.adBadgeText}>SPONSORED</Text>
                  </View>
                </View>

                <Text style={styles.postContent}>{item.content}</Text>

                <TouchableOpacity
                  style={styles.watchAdBtn}
                  onPress={() => handleWatchSponsoredAd(item.adRewardCoins || 250)}
                >
                  <Text style={styles.watchAdBtnText}>
                    ▶ Watch Video (+{item.adRewardCoins} 🪙)
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }

          // Regular User Social Post Card
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.avatar}>{item.avatarIcon}</Text>
                  <View>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                  </View>
                </View>
                {item.gameTag && (
                  <View style={styles.gameTagBadge}>
                    <Text style={styles.gameTagText}>{item.gameTag}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.postContent}>{item.content}</Text>

              {/* Action Buttons */}
              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleLike(item.id)}
                >
                  <Text style={styles.actionText}>🔥 {item.likesCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => Alert.alert('Comments', 'Opening post comments...')}
                >
                  <Text style={styles.actionText}>💬 {item.commentsCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.challengeBtn}
                  onPress={() => handleChallengeUser(item.userName, item.gameTag)}
                >
                  <Text style={styles.challengeBtnText}>⚔️ Challenge</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  postButton: {
    backgroundColor: COLORS.electricTeal,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: COLORS.accentDark,
    borderWidth: 1,
  },
  adCard: {
    borderColor: COLORS.adGold,
    borderWidth: 1.5,
    backgroundColor: '#23221A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 28,
    marginRight: 10,
  },
  userName: {
    color: COLORS.textLight,
    fontWeight: 'bold',
    fontSize: 15,
  },
  timeAgo: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  gameTagBadge: {
    backgroundColor: COLORS.accentDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gameTagText: {
    color: COLORS.electricTeal,
    fontSize: 11,
    fontWeight: '600',
  },
  adBadge:
