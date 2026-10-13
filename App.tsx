import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Import our 4 core screens
import FeedScreen from './feed_screen';
import GamesScreen from './games_screen';
import MatchScreen from './match_screen';
import WalletScreen from './wallet_screen';

// Theme Colors
const COLORS = {
  background: '#121214',
  cardBackground: '#1E1E24',
  electricTeal: '#00F2C3',
  sunsetCoral: '#FF5E7E',
  textLight: '#FFFFFF',
  textMuted: '#A0A0B0',
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Tab.Navigator
        initialRouteName="Games"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.electricTeal,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: 'Feed',
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 22 : 18 }}>📰</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Games"
          component={GamesScreen}
          options={{
            tabBarLabel: 'Arcade',
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 22 : 18 }}>🎮</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Match"
          component={MatchScreen}
          options={{
            tabBarLabel: 'Match Hub',
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 22 : 18 }}>💘</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarLabel: 'Wallet',
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: focused ? 22 : 18 }}>🪙</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.cardBackground,
    borderTopColor: '#2A2A35',
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
