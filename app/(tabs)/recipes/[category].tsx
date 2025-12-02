import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Text, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getCategoryFeeds } from '../../../src/data/mock';
import { colors } from '../../../src/theme/colors';
import { Category, Recipe } from '../../../src/types';
import { StickyHeader } from '../../../src/components/ui/StickyHeader';

const HEADER_HEIGHT = 90;

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
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StickyHeader scrollY={scrollY} />
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
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
        <View style={{ height: Platform.OS === 'ios' ? 80 : 60 }} />
      </Animated.ScrollView>
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
    padding: 16,
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 100,
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

