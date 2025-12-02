import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getCategoryFeeds } from '../../../src/data/mock';
import { colors } from '../../../src/theme/colors';
import { Category, Recipe } from '../../../src/types';

const { width } = Dimensions.get('window');
const RECIPE_CARD_SIZE = (width - 48) / 2; // Account for padding (16*2) and gap (16)

/**
 * Category Detail Screen
 * Shows all recipes for a specific category
 */
export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const categoryFeeds = getCategoryFeeds();
  const decodedCategory = decodeURIComponent(category || '') as Category;
  const recipes = categoryFeeds.get(decodedCategory) || [];

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{decodedCategory}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.recipesGrid}>
          {recipes.map((recipe, index) => (
            <TouchableOpacity
              key={recipe.id}
              style={[
                styles.recipeCard,
                index % 2 === 0 && styles.recipeCardLeft,
                index % 2 === 1 && styles.recipeCardRight,
              ]}
              onPress={() => handleRecipePress(recipe)}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri: recipe.imageUrl }} 
                style={styles.recipeImage}
                resizeMode="cover"
              />
              <View style={styles.recipeOverlay}>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  <View style={styles.recipeMeta}>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={12} color={colors.saffron} />
                      <Text style={styles.ratingText}>{recipe.rating}</Text>
                    </View>
                    <View style={styles.likesContainer}>
                      <MaterialIcons name="favorite" size={12} color="#ff4757" />
                      <Text style={styles.likesText}>{recipe.likes}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recipeCard: {
    width: RECIPE_CARD_SIZE,
    height: RECIPE_CARD_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  recipeCardLeft: {
    marginRight: 16,
  },
  recipeCardRight: {
    marginRight: 0,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  recipeInfo: {
    gap: 6,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 18,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.saffron,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff4757',
  },
});

