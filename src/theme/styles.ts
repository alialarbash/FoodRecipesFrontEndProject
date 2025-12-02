import { StyleSheet } from 'react-native';
import { colors } from './colors';

/**
 * Reusable styles for Glass & Light design
 */

export const glassStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass.background, 
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: 20, // Updated to match demo (20px)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 3,
  },
  
  card: {
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: 20, // Updated to match demo (20px)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 2,
  },
  
  surface: {
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: 8,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * Typography styles matching demo.tsx
 */
export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.light.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.light.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.light.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.light.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.light.textSecondary,
  },
});


