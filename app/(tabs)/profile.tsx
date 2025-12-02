import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ALL_RECIPES, CURRENT_USER } from '../../src/data/mock';
import { colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'myLiqmas' | 'saved'>('myLiqmas');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: CURRENT_USER.avatarUrl }} 
            style={styles.avatarLarge}
          />
          <Text style={styles.username}>{CURRENT_USER.username}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{CURRENT_USER.followers}</Text>
              <Text style={styles.statLbl}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{CURRENT_USER.following}</Text>
              <Text style={styles.statLbl}>Following</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{CURRENT_USER.avgRating}</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
          </View>
          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.primaryBtnSmall}>
              <Text style={styles.primaryBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtnSmall}>
              <Text style={styles.secondaryBtnText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'myLiqmas' && styles.tabPillActive]}
            onPress={() => setActiveTab('myLiqmas')}
          >
            <Text style={[styles.tabPillText, activeTab === 'myLiqmas' && styles.tabPillTextActive]}>
              My Liqmas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'saved' && styles.tabPillActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabPillText, activeTab === 'saved' && styles.tabPillTextActive]}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid2Col}>
          {ALL_RECIPES.slice(0, 4).map(r => (
            <TouchableOpacity
              key={r.id}
              style={styles.gridTile}
              onPress={() => router.push(`/recipe/${r.id}`)}
            >
              <Image 
                source={{ uri: r.imageUrl }} 
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={10} color="#d97706" />
                <Text style={styles.ratingBadgeText}> {r.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 12,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.light.text,
  },
  statLbl: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryBtnSmall: {
    flex: 1,
    backgroundColor: colors.mint,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryBtnSmall: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  tabPillActive: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  tabPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  tabPillTextActive: {
    color: '#fff',
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridTile: {
    width: '48%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#d97706',
  },
});
