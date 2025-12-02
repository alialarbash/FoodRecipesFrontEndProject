import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showLabel?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Spoiled',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Gourmet'
};

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  interactive = false, 
  onRate,
  showLabel = false
}) => {
  const getRatingLabel = (ratingValue: number): string => {
    const rounded = Math.round(ratingValue);
    return RATING_LABELS[rounded] || RATING_LABELS[Math.floor(ratingValue)] || '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rating;
          const StarComponent = interactive && onRate ? TouchableOpacity : View;
          
          return (
            <StarComponent
              key={star}
              onPress={interactive && onRate ? () => onRate(star) : undefined}
              style={styles.star}
              disabled={!interactive}
            >
              <MaterialIcons
                name={isFilled ? 'star' : 'star-border'}
                size={14}
                color={isFilled ? colors.saffron : '#8899A6'}
              />
            </StarComponent>
          );
        })}
      </View>
      {showLabel && (
        <Text style={styles.ratingLabel}>{getRatingLabel(rating)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    // TouchableOpacity/View wrapper
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.saffron,
    marginLeft: 4,
  },
});

