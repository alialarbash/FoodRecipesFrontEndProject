import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { CURRENT_USER } from '../../data/mock';
import { colors } from '../../theme/colors';
import { getTimeBasedGreeting, getRandomFoodFact } from '../../utils/greeting';

interface StickyHeaderProps {
  scrollY: Animated.Value;
}

const HEADER_HEIGHT = 90;

export const StickyHeader: React.FC<StickyHeaderProps> = ({ scrollY }) => {
  const router = useRouter();
  const lastScrollY = useRef(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const [foodFact, setFoodFact] = useState(getRandomFoodFact());
  const [isVisible, setIsVisible] = useState(true);

  // Update food fact every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodFact(getRandomFoodFact());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const diff = value - lastScrollY.current;
      lastScrollY.current = value;

      if (diff > 5 && value > 100 && isVisible) {
        // Scrolling down - hide header
        setIsVisible(false);
        Animated.timing(translateY, {
          toValue: -HEADER_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (diff < -5 && !isVisible) {
        // Scrolling up - show header
        setIsVisible(true);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, translateY, isVisible]);

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.greeting}>{getTimeBasedGreeting()},</Text>
          <Text style={styles.foodFact} numberOfLines={2} ellipsizeMode="tail">
            {foodFact}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleProfilePress}
          activeOpacity={0.7}
          style={styles.avatarContainer}
        >
          <Image
            source={{ uri: CURRENT_USER.avatarUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 12,
    right: 12,
    height: HEADER_HEIGHT - 10,
    zIndex: 1000,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
    minWidth: 0, // Allow text to shrink
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.light.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  foodFact: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.light.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
    flexShrink: 1,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#fff',
  },
});

