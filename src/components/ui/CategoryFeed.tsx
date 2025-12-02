import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Category, Recipe } from '../../types';
import { colors } from '../../theme/colors';
import { RecipeCard } from './RecipeCard';

interface CategoryFeedProps {
  category: Category;
  recipes: Recipe[];
  onRecipePress?: (recipe: Recipe) => void;
  onViewAllPress?: () => void;
}

/**
 * CategoryFeed component displaying a vertical list of recipes for a specific category
 */
export const CategoryFeed: React.FC<CategoryFeedProps> = ({
  category,
  recipes,
  onRecipePress,
  onViewAllPress,
}) => {
  const displayedRecipes = recipes.slice(0, 5); // Show first 5 recipes
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {recipes.length > 5 && (
          <TouchableOpacity onPress={onViewAllPress}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayedRecipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            size="medium"
            horizontal={true}
            onPress={() => onRecipePress?.(recipe)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark.text,
  },
  viewAll: {
    fontSize: 14,
    color: colors.mint,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

