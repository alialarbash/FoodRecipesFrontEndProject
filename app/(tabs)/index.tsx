import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BentoGrid } from '../../src/components/ui/BentoGrid';
import { CategoryBox } from '../../src/components/ui/CategoryBox';
import { ALL_RECIPES, CURRENT_USER, getCategoryFeeds } from '../../src/data/mock';
import { colors } from '../../src/theme/colors';
import { Recipe, Category } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const categoryFeeds = getCategoryFeeds();
  const categories: Category[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drinks'];

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/(tabs)/recipes/${encodeURIComponent(category)}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.subtitle}>Ready for your first Liqma?</Text>
          </View>
          <Image 
            source={{ uri: CURRENT_USER.avatarUrl }} 
            style={styles.avatarSmall}
          />
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.light.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  section: {
    marginBottom: 32,
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
