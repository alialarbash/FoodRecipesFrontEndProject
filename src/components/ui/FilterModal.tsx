import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { GlassView } from '../glass/GlassView';

interface FilterCriteria {
  protein: number;
  dairyFree: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (criteria: FilterCriteria) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [protein, setProtein] = useState(20);
  const [dairyFree, setDairyFree] = useState(false);

  const handleApply = () => {
    onApply({ protein, dairyFree });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <GlassView variant="container" style={styles.glassModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Min Protein: {protein}g</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderMin}>0</Text>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${(protein / 100) * 100}%` }]} />
                    <View 
                      style={[styles.sliderThumb, { left: `${(protein / 100) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.sliderMax}>100</Text>
                </View>
                <View style={styles.sliderButtons}>
                  {[0, 20, 40, 60, 80, 100].map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.sliderButton}
                      onPress={() => setProtein(value)}
                    >
                      <Text style={styles.sliderButtonText}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Allergies & Preferences</Text>
                <View style={styles.tagsContainer}>
                  {['Dairy Free', 'Nut Free', 'Gluten Free'].map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagBtn,
                        tag === 'Dairy Free' && dairyFree && styles.tagBtnActive
                      ]}
                      onPress={() => tag === 'Dairy Free' && setDairyFree(!dairyFree)}
                    >
                      <Text style={[
                        styles.tagBtnText,
                        tag === 'Dairy Free' && dairyFree && styles.tagBtnTextActive
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={handleApply}
              >
                <Text style={styles.primaryBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </GlassView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  glassModal: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.light.text,
  },
  closeBtn: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sliderMin: {
    fontSize: 12,
    color: colors.light.textSecondary,
    width: 30,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.light.border,
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.mint,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.mint,
    top: -8,
    marginLeft: -10,
  },
  sliderMax: {
    fontSize: 12,
    color: colors.light.textSecondary,
    width: 40,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sliderButtonText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagBtnActive: {
    backgroundColor: colors.mint,
  },
  tagBtnText: {
    fontSize: 13,
    color: colors.light.text,
  },
  tagBtnTextActive: {
    color: '#fff',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.mint,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

