import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Recipe } from '../../types';
import { colors } from '../../theme/colors';
import { GlassView } from '../glass/GlassView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 16;
const GAP = 8;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (PADDING * 2);
const BASE_SIZE = (AVAILABLE_WIDTH - GAP) / 3; // 3 columns base

interface BentoBoxProps {
  recipe: Recipe;
  onPress?: () => void;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}

/**
 * BentoBox component for Today's Liqmas with varied sizes
 * Supports: small (1x1), medium (1x1), large (2x2), wide (2x1), tall (1x2)
 */
export const BentoBox: React.FC<BentoBoxProps> = ({ 
  recipe, 
  onPress,
  size = 'medium'
}) => {
  const sizeStyle = styles[size];
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, sizeStyle]}
    >
      <GlassView variant="card" style={styles.glassCard}>
        <Image 
          source={{ uri: recipe.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={size === 'small' ? 1 : 2}>
              {recipe.title}
            </Text>
            <View style={styles.meta}>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={12} color={colors.saffron} />
                <Text style={styles.rating}>{recipe.rating}</Text>
              </View>
              <View style={styles.likesContainer}>
                <MaterialIcons name="favorite" size={12} color={colors.mint} />
                <Text style={styles.likes}>{recipe.likes}</Text>
              </View>
            </View>
            {size !== 'small' && (
              <View style={styles.authorContainer}>
                <Image 
                  source={{ uri: recipe.author.profilePicture }} 
                  style={styles.avatar}
                />
                <Text style={styles.authorName} numberOfLines={1}>
                  {recipe.author.displayName}
                </Text>
              </View>
            )}
          </View>
        </View>
      </GlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: GAP / 2,
  },
  small: {
    width: BASE_SIZE,
    height: BASE_SIZE,
  },
  medium: {
    width: BASE_SIZE,
    height: BASE_SIZE,
  },
  large: {
    width: BASE_SIZE * 2 + GAP,
    height: BASE_SIZE * 2 + GAP,
  },
  wide: {
    width: BASE_SIZE * 2 + GAP,
    height: BASE_SIZE,
  },
  tall: {
    width: BASE_SIZE,
    height: BASE_SIZE * 2 + GAP,
  },
  glassCard: {
    flex: 1,
    overflow: 'hidden',
    padding: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  content: {
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.text,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 11,
    color: colors.dark.text,
    fontWeight: '600',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likes: {
    fontSize: 11,
    color: colors.dark.text,
    fontWeight: '600',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  authorName: {
    fontSize: 10,
    color: colors.dark.textSecondary,
    flex: 1,
  },
});

