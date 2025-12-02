import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RecipeCard } from '../../src/components/ui/RecipeCard';
import { FilterModal } from '../../src/components/ui/FilterModal';
import { ALL_RECIPES } from '../../src/data/mock';
import { colors } from '../../src/theme/colors';
import { Recipe } from '../../src/types';

interface FilterCriteria {
  protein: number;
  dairyFree: boolean;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.stickyHeader}>
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
        <View style={{ height: 80 }} />
      </ScrollView>

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
  stickyHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
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
  },
  feedList: {
    gap: 20,
  },
});
