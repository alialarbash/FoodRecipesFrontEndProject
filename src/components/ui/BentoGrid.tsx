import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Recipe } from '../../types';
import { colors } from '../../theme/colors';

interface BentoGridProps {
  recipes: Recipe[];
  onRecipePress?: (recipe: Recipe) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2; // Account for padding and gap
const GRID_HEIGHT = 160;

export const BentoGrid: React.FC<BentoGridProps> = ({ recipes, onRecipePress }) => {
  // Logic: Sort by likes, but allow max 2 per category
  const featured = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    const sorted = [...recipes].sort((a, b) => b.likes - a.likes);
    const selected: Recipe[] = [];

    for (const r of sorted) {
      const catCount = categoryCounts[r.category] || 0;
      if (catCount < 2 && selected.length < 8) {
        selected.push(r);
        categoryCounts[r.category] = catCount + 1;
      }
    }
    return selected;
  }, [recipes]);

  const renderBentoItem = (recipe: Recipe, width: number, height: number) => (
    <TouchableOpacity
      key={recipe.id}
      style={[styles.bentoItem, { width, height }]}
      onPress={() => onRecipePress?.(recipe)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: recipe.imageUrl }} 
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.bentoOverlay}>
        <View style={styles.bentoCat}>
          <Text style={styles.bentoCatText}>{recipe.category}</Text>
        </View>
        <Text style={styles.bentoLikes}>♥ {recipe.likes}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bentoGrid}>
      {/* Row 1: Hero item (full width) */}
      {featured[0] && renderBentoItem(featured[0], width - 32, GRID_HEIGHT)}
      
      {/* Row 2: Two normal items */}
      <View style={styles.bentoRow}>
        {featured[1] && (
          <View style={styles.bentoItemWrapper}>
            {renderBentoItem(featured[1], CARD_WIDTH, GRID_HEIGHT)}
          </View>
        )}
        {featured[2] && (
          <View>
            {renderBentoItem(featured[2], CARD_WIDTH, GRID_HEIGHT)}
          </View>
        )}
      </View>
      
      {/* Row 3-4: Tall item on left, two items stacked on right */}
      <View style={styles.bentoRow}>
        {featured[3] && (
          <View style={styles.bentoItemWrapper}>
            {renderBentoItem(featured[3], CARD_WIDTH, GRID_HEIGHT * 2 + 12)}
          </View>
        )}
        <View style={styles.bentoColumn}>
          {featured[4] && (
            <View style={{ marginBottom: 12 }}>
              {renderBentoItem(featured[4], CARD_WIDTH, GRID_HEIGHT)}
            </View>
          )}
          {featured[5] && (
            <View>
              {renderBentoItem(featured[5], CARD_WIDTH, GRID_HEIGHT)}
            </View>
          )}
        </View>
      </View>
      
      {/* Row 5: Two normal items */}
      <View style={styles.bentoRow}>
        {featured[6] && (
          <View style={styles.bentoItemWrapper}>
            {renderBentoItem(featured[6], CARD_WIDTH, GRID_HEIGHT)}
          </View>
        )}
        {featured[7] && (
          <View>
            {renderBentoItem(featured[7], CARD_WIDTH, GRID_HEIGHT)}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bentoGrid: {
    marginTop: 16,
  },
  bentoRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  bentoItemWrapper: {
    marginRight: 12,
  },
  bentoColumn: {
    // Column for vertical stacking
  },
  bentoItem: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  bentoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bentoCat: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bentoCatText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bentoLikes: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

