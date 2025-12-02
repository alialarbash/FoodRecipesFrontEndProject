import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRENT_USER } from '../../data/mock';
import { colors } from '../../theme/colors';
import { getTimeBasedGreeting, getRandomFoodFact } from '../../utils/greeting';
import { MarqueeText } from './MarqueeText';

interface StickyHeaderProps {
  scrollY: Animated.Value;
}

const HEADER_HEIGHT = 90;

export const StickyHeader: React.FC<StickyHeaderProps> = ({ scrollY }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [foodFact, setFoodFact] = useState(getRandomFoodFact());

  // Update food fact every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodFact(getRandomFoodFact());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Subtle pulsing animation for "alive" effect
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={[styles.headerContainer, { height: HEADER_HEIGHT + insets.top }]}>
      {/* Gradient-like background layers */}
      <Animated.View
        style={[
          styles.gradientLayer1,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <View style={styles.gradientLayer2} />
      <View style={styles.gradientLayer3} />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.leftSection}>
          <Text style={styles.greeting}>{getTimeBasedGreeting()},</Text>
          <View style={styles.factContainer}>
            <View style={[
              styles.factLabel,
              foodFact.label === 'Tip' ? styles.tipLabel : styles.funFactLabel
            ]}>
              <Text style={styles.factLabelText}>{foodFact.label}</Text>
            </View>
            <MarqueeText
              text={foodFact.text}
              style={styles.foodFact}
              containerStyle={styles.marqueeContainer}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleProfilePress}
          activeOpacity={0.7}
          style={styles.avatarContainer}
        >
          <View style={styles.avatarGlow} />
          <Image
            source={{ uri: CURRENT_USER.avatarUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(63, 195, 128, 0.2)',
  },
  gradientLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E0F2FE', // Light blue
    opacity: 0.6,
  },
  gradientLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0FDF4', // Light green
    opacity: 0.5,
  },
  gradientLayer3: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    zIndex: 1,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
    minWidth: 0,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.light.text,
    letterSpacing: -0.5,
    marginBottom: 6,
    textShadowColor: 'rgba(63, 195, 128, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  factContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  factLabel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tipLabel: {
    backgroundColor: colors.mint,
  },
  funFactLabel: {
    backgroundColor: colors.secondary,
  },
  factLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  marqueeContainer: {
    flex: 1,
    minWidth: 0,
  },
  foodFact: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarGlow: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.mint,
    opacity: 0.2,
    top: -3,
    left: -3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
});

