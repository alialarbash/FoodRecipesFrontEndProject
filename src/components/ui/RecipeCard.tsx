import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Recipe } from '../../types';
import { colors } from '../../theme/colors';
import { GlassView } from '../glass/GlassView';
import { StarRating } from './StarRating';

interface RecipeCardProps {
  recipe: Recipe;
  layout?: 'feed' | 'compact';
  onPress?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  layout = 'feed',
  onPress
}) => {
  const [liked, setLiked] = useState(false);

  if (layout === 'compact') {
    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.compactCard}
      >
        <GlassView variant="card" style={styles.compactGlassCard}>
          <Image 
            source={{ uri: recipe.imageUrl }} 
            style={styles.compactImg}
            resizeMode="cover"
          />
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {recipe.title}
            </Text>
            <View style={styles.compactRow}>
              <View style={styles.macroPill}>
                <Text style={styles.macroPillText}>{recipe.macros.protein}g Pro</Text>
              </View>
              <View style={styles.ratingPill}>
                <MaterialIcons name="star" size={11} color="#d97706" />
                <Text style={styles.ratingPillText}> {recipe.rating}</Text>
              </View>
            </View>
          </View>
        </GlassView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.feedCard}
    >
      <GlassView variant="card" style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userPill}>
            <Image 
              source={{ uri: recipe.author.avatarUrl }} 
              style={styles.avatar}
            />
            <Text style={styles.username}>{recipe.author.username}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="more-horiz" size={20} color={colors.light.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardImageContainer}>
          <Image 
            source={{ uri: recipe.imageUrl }} 
            style={styles.feedImg}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.macroRings}>
              <View style={styles.macroItem}>
                <Text style={styles.macroVal}>{recipe.macros.calories}</Text>
                <Text style={styles.macroLbl}>kcal</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.macroItem}>
                <Text style={styles.macroVal}>{recipe.macros.protein}g</Text>
                <Text style={styles.macroLbl}>Prot</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={[styles.actionBtn, liked && styles.likedBtn]}
              onPress={() => setLiked(!liked)}
            >
              <MaterialIcons 
                name={liked ? "favorite" : "favorite-border"} 
                size={24} 
                color={liked ? "#ff4757" : colors.light.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => console.log(`Reported duplicate in ${recipe.category}`)}
            >
              <MaterialIcons name="warning" size={22} color={colors.light.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.rightActions}>
            <StarRating 
              rating={recipe.rating} 
              interactive={true} 
              onRate={(r) => console.log(`Rated ${r}`)} 
            />
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{recipe.title}</Text>
          <Text style={styles.tags}>
            {recipe.tags.map(t => `#${t}`).join(' ')} • {recipe.category}
          </Text>
        </View>
      </GlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Compact Card Styles
  compactCard: {
    marginBottom: 12,
  },
  compactGlassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  compactImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroPill: {
    backgroundColor: 'rgba(63, 195, 128, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  macroPillText: {
    fontSize: 11,
    color: colors.mint,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingPillText: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: '600',
  },
  
  // Feed Card Styles
  feedCard: {
    marginBottom: 20,
  },
  glassCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  iconBtn: {
    padding: 4,
  },
  cardImageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    height: 280,
  },
  feedImg: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  macroRings: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  macroLbl: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  likedBtn: {
    // Additional styling if needed
  },
  rightActions: {
    // Container for star rating
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  tags: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
});
