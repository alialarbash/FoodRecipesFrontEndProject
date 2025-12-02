import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

/**
 * Time-aware greeting header component
 * Displays "Good Morning", "Good Afternoon", or "Good Evening" based on time of day
 */
export const GreetingHeader: React.FC = () => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.subtitle}>Discover today's best Liqmas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    fontWeight: '400',
  },
});


