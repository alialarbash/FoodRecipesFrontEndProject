import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getRecipeById } from '../../src/data/mock';
import { colors } from '../../src/theme/colors';
import { GlassView } from '../../src/components/glass/GlassView';
import { StarRating } from '../../src/components/ui/StarRating';
import { StickyHeader } from '../../src/components/ui/StickyHeader';
import { CustomTabBar } from '../../src/components/ui/CustomTabBar';

const HEADER_HEIGHT = 90;

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 350;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = getRecipeById(id || '');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Not Found</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    );
  }

  // Parallax effect: image moves slower than scroll
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [0, HERO_HEIGHT * 0.5],
    extrapolate: 'clamp',
  });

  // Scale effect when pulling down
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  // Header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT - 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleAuthorPress = () => {
    // Navigate to user profile - using the author's ID or username
    router.push(`/(tabs)/profile`);
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
        {/* Hero Image with Parallax */}
        <View style={styles.heroImageContainer}>
          <Animated.Image 
            source={{ uri: recipe.imageUrl }} 
            style={[
              styles.heroImage,
              {
                transform: [
                  { translateY: imageTranslateY },
                  { scale: imageScale }
                ]
              }
            ]}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          
          {/* Header with back button */}
          <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerIconBtn}
                onPress={() => setSaved(!saved)}
              >
                <MaterialIcons 
                  name={saved ? "bookmark" : "bookmark-border"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn}>
                <MaterialIcons name="share" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Author */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{recipe.title}</Text>
            <TouchableOpacity 
              style={styles.authorCard}
              onPress={handleAuthorPress}
              activeOpacity={0.7}
            >
              <View style={styles.authorInfo}>
                <Image 
                  source={{ uri: recipe.author.avatarUrl }} 
                  style={styles.authorAvatar}
                />
                <View style={styles.authorDetails}>
                  <Text style={styles.authorLabel}>Created by</Text>
                  <Text style={styles.authorName}>{recipe.author.username}</Text>
                  <View style={styles.authorStats}>
                    <Text style={styles.authorStatText}>
                      {recipe.author.followers} followers
                    </Text>
                    <Text style={styles.authorStatDot}>•</Text>
                    <Text style={styles.authorStatText}>
                      {recipe.author.avgRating}★ avg
                    </Text>
                  </View>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={20} color={colors.mint} />
              <Text style={styles.statText}>
                {recipe.prepTime && recipe.cookTime 
                  ? `${recipe.prepTime + recipe.cookTime} min`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="restaurant" size={20} color={colors.mint} />
              <Text style={styles.statText}>
                {recipe.servings || 1} {recipe.servings === 1 ? 'serving' : 'servings'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="local-fire-department" size={20} color={colors.saffron} />
              <Text style={styles.statText}>{recipe.macros.calories} kcal</Text>
            </View>
          </View>

          {/* Rating and Likes */}
          <View style={styles.ratingRow}>
            <StarRating rating={recipe.rating} showLabel={true} />
            <Text style={styles.ratingText}>{recipe.rating}</Text>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.likeBtn}
              onPress={() => setLiked(!liked)}
            >
              <MaterialIcons 
                name={liked ? "favorite" : "favorite-border"} 
                size={20} 
                color={liked ? "#ff4757" : colors.light.textSecondary} 
              />
              <Text style={[styles.likeText, liked && styles.likeTextActive]}>
                {recipe.likes + (liked ? 1 : 0)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {recipe.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{recipe.category}</Text>
            </View>
          </View>

          {/* Description */}
          {recipe.description && (
            <GlassView variant="card" style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{recipe.description}</Text>
            </GlassView>
          )}

          {/* Macros */}
          <GlassView variant="card" style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <View style={styles.macrosGrid}>
              <View style={styles.macroCard}>
                <Text style={styles.macroValue}>{recipe.macros.calories}</Text>
                <Text style={styles.macroLabel}>Calories</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroValue}>{recipe.macros.protein}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroValue}>{recipe.macros.carbs}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroValue}>{recipe.macros.fats}g</Text>
                <Text style={styles.macroLabel}>Fats</Text>
              </View>
            </View>
          </GlassView>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <GlassView variant="card" style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientBullet} />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </GlassView>
          )}

          {/* Instructions */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <GlassView variant="card" style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.instructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            </GlassView>
          )}

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>
      <CustomTabBar />
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
    paddingBottom: 120,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
  },
  placeholder: {
    width: 40,
  },
  heroImageContainer: {
    width: width,
    height: HERO_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: HEADER_HEIGHT,
  },
  heroImage: {
    width: width,
    height: HERO_HEIGHT * 1.5, // Make image taller for parallax effect
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    padding: 20,
    paddingTop: 24,
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.light.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  authorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.mint,
  },
  authorDetails: {
    flex: 1,
  },
  authorLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.light.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  authorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorStatText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  authorStatDot: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.light.border,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  likeTextActive: {
    color: '#ff4757',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: 'rgba(63, 195, 128, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mint,
  },
  categoryTag: {
    backgroundColor: colors.saffron,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  section: {
    marginBottom: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.textSecondary,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroCard: {
    width: '48%',
    backgroundColor: 'rgba(63, 195, 128, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.mint,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mint,
    marginTop: 6,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.light.text,
  },
  instructionsList: {
    gap: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.light.text,
  },
});

