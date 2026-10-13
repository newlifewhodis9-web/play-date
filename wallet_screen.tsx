import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

// -------------------------------------------------------------------
// THEME CONSTANTS
// -------------------------------------------------------------------
const COLORS = {
  background: '#121214',      // Charcoal Dark Mode
  cardBackground: '#1E1E24',  // Elevated Card surface
  electricTeal: '#00F2C3',    // Primary Brand Accent
  sunsetCoral: '#FF5E7E',     // Secondary Dating Accent
  textLight: '#FFFFFF',
  textMuted: '#A0A0B0',
  inputBackground: '#2A2A35',
  success: '#00E676',
};

const COINS_PER_DOLLAR = 10000;
const MINIMUM_CASHOUT_USD = 5.00;

export default function WalletScreen() {
  // State variables
  const [coinBalance, setCoinBalance] = useState<number>(55000); // Default 55,000 coins ($5.50)
  const [selectedMethod, setSelectedMethod] = useState<'cash_app' | 'paypal' | 'debit_card'>('cash_app');
  const [cashTag, setCashTag] = useState<string>('');
  const [paypalEmail, setPaypalEmail] = useState<string>('');
  const [cashoutAmount, setCashoutAmount] = useState<string>('5.00');
  const [loadingAd, setLoadingAd] = useState<boolean>(false);
  const [submittingPayout, setSubmittingPayout] = useState<boolean>(false);

  // Computed values
  const cashValueUSD = (coinBalance / COINS_PER_DOLLAR).toFixed(2);
  const isCashoutEligible = parseFloat(cashValueUSD) >= MINIMUM_CASHOUT_USD;

  // Simulate watching a rewarded video ad
  const handleWatchAd = () => {
    setLoadingAd(true);
    setTimeout(() => {
      setLoadingAd(false);
      const bonusCoins = 500; // Earn 500 coins per ad ($0.05)
      setCoinBalance((prev) => prev + bonusCoins);
      Alert.alert('Bonus Earned!', `You earned ${bonusCoins} coins from ad revenue!`);
    }, 2000);
  };

  // Submit payout request
  const handlePayoutRequest = () => {
    const amountNum = parseFloat(cashoutAmount);

    if (isNaN(amountNum) || amountNum < MINIMUM_CASHOUT_USD) {
      Alert.alert('Invalid Amount
