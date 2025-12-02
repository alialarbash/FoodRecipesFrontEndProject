import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * SafeAreaBlur component - Adds subtle blur to areas outside safe view
 */
export const SafeAreaBlur: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Top blur (above safe area) */}
      {insets.top > 0 && (
        <View
          style={[
            styles.topBlur,
            {
              height: insets.top,
            },
          ]}
          pointerEvents="none"
        >
          <BlurView
            intensity={15}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}

      {/* Bottom blur (below safe area) */}
      {insets.bottom > 0 && (
        <View
          style={[
            styles.bottomBlur,
            {
              height: insets.bottom,
            },
          ]}
          pointerEvents="none"
        >
          <BlurView
            intensity={15}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  topBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 998,
    overflow: 'hidden',
  },
  bottomBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 998,
    overflow: 'hidden',
  },
});

