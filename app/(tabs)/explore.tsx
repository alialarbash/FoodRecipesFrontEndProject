import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RecipeCard } from '../../src/components/ui/RecipeCard';
import { FilterModal } from '../../src/components/ui/FilterModal';
import { StickyHeader } from '../../src/components/ui/StickyHeader';
import { ALL_RECIPES } from '../../src/data/mock';
import { colors } from '../../src/theme/colors';
import { Recipe } from '../../src/types';

const { width } = Dimensions.get('window');
const GRID_GAP = 8;
const PADDING = 20;
const NUM_COLUMNS = 2;
// 2 columns: screen width - padding (20*2) - gap between columns (8) = 48px total
const COLUMN_WIDTH = (width - (PADDING * 2) - GRID_GAP) / NUM_COLUMNS;

const HEADER_HEIGHT = 90;

interface FilterCriteria {
  protein: number;
  dairyFree: boolean;
}

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search bar height: padding (12+12) + search bar (10+10+20) = 64px
  const SEARCH_BAR_HEIGHT = 64;

  const filteredRecipes = useMemo(() => {
    let recipes = ALL_RECIPES;

    if (filterCriteria) {
      recipes = recipes.filter(r => r.macros.protein >= filterCriteria.protein);
      if (filterCriteria.dairyFree) {
        recipes = recipes.filter(r => r.tags.includes('Dairy-Free'));
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      recipes = recipes.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return recipes;
  }, [filterCriteria, searchQuery]);

  // Pinterest-style masonry layout: distribute items across columns
  const masonryColumns = useMemo(() => {
    if (searchQuery.trim()) return null; // Don't use masonry when searching
    
    const columns: Recipe[][] = [[], []]; // 2 columns
    const columnHeights = [0, 0];
    
    filteredRecipes.forEach((recipe, index) => {
      // Calculate item height (vary based on title length and index for visual interest)
      const baseHeight = 200;
      const heightVariation = (index % 3) * 40; // Vary height: 0, 40, 80
      const titleLengthFactor = recipe.title.length > 30 ? 20 : 0;
      const itemHeight = baseHeight + heightVariation + titleLengthFactor;
      
      // Find the column with the least height
      const shortestColumnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
      
      // Add to shortest column
      columns[shortestColumnIndex].push(recipe);
      columnHeights[shortestColumnIndex] += itemHeight + GRID_GAP;
    });
    
    return columns;
  }, [filteredRecipes, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StickyHeader scrollY={scrollY} />
      <View style={[styles.searchHeader, { top: HEADER_HEIGHT + insets.top }]}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Find a healthy bite..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterIconBtn}
            onPress={() => setShowFilter(true)}
          >
            <MaterialIcons name="tune" size={18} color={colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT + insets.top + SEARCH_BAR_HEIGHT + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {searchQuery.trim() ? (
          // Search results: Feed layout (one per row)
          <View style={styles.feedList}>
            {filteredRecipes.map(r => (
              <RecipeCard 
                key={r.id} 
                recipe={r} 
                layout="feed"
                onPress={() => router.push(`/recipe/${r.id}`)}
              />
            ))}
          </View>
        ) : (
          // No search: Pinterest-style masonry layout
          masonryColumns && (
            <View style={styles.masonryContainer}>
              {masonryColumns.map((column, columnIndex) => (
                <View 
                  key={columnIndex} 
                  style={[
                    styles.masonryColumn,
                    columnIndex === masonryColumns.length - 1 && styles.masonryColumnLast
                  ]}
                >
                  {column.map((recipe, itemIndex) => {
                    // Calculate varying heights for Pinterest effect
                    const globalIndex = columnIndex === 0 
                      ? itemIndex 
                      : masonryColumns[0].length + itemIndex;
                    const baseHeight = 200;
                    const heightVariation = (globalIndex % 3) * 40;
                    const titleLengthFactor = recipe.title.length > 30 ? 20 : 0;
                    const itemHeight = baseHeight + heightVariation + titleLengthFactor;
                    
                    return (
                      <TouchableOpacity
                        key={recipe.id}
                        style={[
                          styles.masonryItem,
                          { width: COLUMN_WIDTH, height: itemHeight }
                        ]}
                        onPress={() => router.push(`/recipe/${recipe.id}`)}
                        activeOpacity={0.9}
                      >
                        <Image 
                          source={{ uri: recipe.imageUrl }} 
                          style={styles.masonryImage}
                          resizeMode="cover"
                        />
                        <View style={styles.masonryOverlay}>
                          <View style={styles.masonryInfo}>
                            <Text style={styles.masonryTitle} numberOfLines={2}>
                              {recipe.title}
                            </Text>
                            <View style={styles.masonryMeta}>
                              <View style={styles.masonryRating}>
                                <MaterialIcons name="star" size={12} color={colors.saffron} />
                                <Text style={styles.masonryRatingText}>{recipe.rating}</Text>
                              </View>
                              <View style={styles.masonryLikes}>
                                <MaterialIcons name="favorite" size={12} color="#ff4757" />
                                <Text style={styles.masonryLikesText}>{recipe.likes}</Text>
                              </View>
                            </View>
                            <View style={styles.masonryAuthor}>
                              <Image 
                                source={{ uri: recipe.author.avatarUrl }} 
                                style={styles.masonryAvatar}
                              />
                              <Text style={styles.masonryAuthorName} numberOfLines={1}>
                                {recipe.author.username}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          )
        )}
        <View style={{ height: Platform.OS === 'ios' ? 80 : 60 }} />
      </Animated.ScrollView>

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(criteria) => {
          setFilterCriteria(criteria);
          setShowFilter(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  searchHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    zIndex: 999,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.light.text,
  },
  filterIconBtn: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: HEADER_HEIGHT + 80, // Will be adjusted dynamically
  },
  feedList: {
    gap: 20,
  },
  // Pinterest-style masonry layout
  masonryContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  masonryColumn: {
    flex: 1,
    marginRight: GRID_GAP,
  },
  masonryColumnLast: {
    marginRight: 0,
  },
  masonryItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: GRID_GAP,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  masonryImage: {
    width: '100%',
    height: '100%',
  },
  masonryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  masonryInfo: {
    gap: 8,
  },
  masonryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 18,
    marginBottom: 4,
  },
  masonryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  masonryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  masonryRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.saffron,
  },
  masonryLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  masonryLikesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff4757',
  },
  masonryAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  masonryAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  masonryAuthorName: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
});
