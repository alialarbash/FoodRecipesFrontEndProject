import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

export const CustomTabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'home', icon: 'home', route: '/(tabs)' },
    { name: 'explore', icon: 'search', route: '/(tabs)/explore' },
    { name: 'profile', icon: 'person', route: '/(tabs)/profile' },
  ];

  const isActive = (route: string) => {
    if (route === '/(tabs)') {
      return pathname === '/(tabs)' || pathname === '/(tabs)/index';
    }
    return pathname === route;
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.route as any)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={active ? 26 : 24}
                color={active ? colors.mint : '#9CA3AF'}
                style={active ? { transform: [{ translateY: -2 }] } : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: Platform.OS === 'ios' ? 80 : 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

