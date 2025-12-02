import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Category, Recipe } from '../../types';
import { colors } from '../../theme/colors';
import { GlassView } from '../glass/GlassView';

interface CategoryBoxProps {
  category: Category;
  recipes: Recipe[];
  onPress?: () => void;
}

/**
 * CategoryBox component - A clickable box representing a category
 * Shows category name, recipe count, and a preview image
 */
export const CategoryBox: React.FC<CategoryBoxProps> = ({
  category,
  recipes,
  onPress,
}) => {
  const previewRecipe = recipes[0]; // Use first recipe as preview
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <GlassView variant="container" style={styles.glassBox}>
        {previewRecipe && (
          <Image 
            source={{ uri: previewRecipe.imageUrl }} 
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.meta}>
              <MaterialIcons name="restaurant" size={16} color={colors.mint} />
              <Text style={styles.recipeCount}>
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
              </Text>
            </View>
            <View style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward" size={20} color={colors.mint} />
            </View>
          </View>
        </View>
      </GlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 12,
    height: 120,
  },
  glassBox: {
    flex: 1,
    overflow: 'hidden',
    padding: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  recipeCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
});


