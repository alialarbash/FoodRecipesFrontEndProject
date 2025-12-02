import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BentoGrid } from '../../src/components/ui/BentoGrid';
import { CategoryBox } from '../../src/components/ui/CategoryBox';
import { StickyHeader } from '../../src/components/ui/StickyHeader';
import { ALL_RECIPES, getCategoryFeeds } from '../../src/data/mock';
import { colors } from '../../src/theme/colors';
import { Recipe, Category } from '../../src/types';

const HEADER_HEIGHT = 90;

export default function HomeScreen() {
  const router = useRouter();
  const categoryFeeds = getCategoryFeeds();
  const categories: Category[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drinks'];
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/(tabs)/recipes/${encodeURIComponent(category)}`);
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

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Today's Liqmas</Text>
            <View style={styles.highlight}>
              <Text style={styles.highlightText}>Featured</Text>
            </View>
          </View>
          <BentoGrid 
            recipes={ALL_RECIPES} 
            onRecipePress={handleRecipePress}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Categories</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const recipes = categoryFeeds.get(category) || [];
              return (
                <CategoryBox
                  key={category}
                  category={category}
                  recipes={recipes}
                  onPress={() => handleCategoryPress(category)}
                />
              );
            })}
          </View>
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
    padding: 20,
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
  },
  highlight: {
    backgroundColor: colors.saffron,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
});
