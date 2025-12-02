import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { glassStyles } from '../../theme/styles';

interface GlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'container' | 'card' | 'surface';
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

/**
 * GlassView component implementing the "Glass & Light" design
 * Provides frosted glass effect with transparency, borders, and shadows
 */
export const GlassView: React.FC<GlassViewProps> = ({ 
  children, 
  style, 
  variant = 'container',
  intensity = 50,
  tint = 'light'
}) => {
  const variantStyle = glassStyles[variant];
  
  // Extract border/shadow styles for the container
  const { 
    borderWidth, 
    borderColor, 
    borderRadius, 
    shadowColor, 
    shadowOffset, 
    shadowOpacity, 
    shadowRadius, 
    elevation,
    backgroundColor,
    ...restStyle 
  } = StyleSheet.flatten([variantStyle, style]);

  const containerStyle = {
    borderWidth,
    borderColor,
    borderRadius,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
    backgroundColor: 'transparent', // Let BlurView handle background
    overflow: 'hidden', // Ensure blur respects border radius
  };

  return (
    <View style={[containerStyle, restStyle as ViewStyle]}>
      <BlurView 
        intensity={intensity} 
        tint={tint} 
        style={StyleSheet.absoluteFill} 
      />
      <View style={{ flex: 1, backgroundColor }}>
        {children}
      </View>
    </View>
  );
};
