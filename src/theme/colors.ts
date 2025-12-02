/**
 * Liqma Color Palette
 * Glass & Light Design Philosophy
 */

export const colors = {
  // Primary Brand Colors
  mint: '#3FC380', // Health & primary actions
  secondary: '#42B8B2', // Secondary brand color
  saffron: '#FFD464', // Ratings & accents
  
  // Neutral Colors (Dark/Light mode compatible)
  dark: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  light: {
    background: '#F0F4F8', // Updated to match demo --bg
    surface: '#FFFFFF',
    text: '#1F2937', // Updated to match demo --text-main
    textSecondary: '#6B7280', // Updated to match demo --text-muted
    border: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Glass Effect Colors
  glass: {
    background: 'rgba(255, 255, 255, 0.75)', // Updated to match demo --glass-bg
    border: 'rgba(255, 255, 255, 0.6)', // Updated to match demo --glass-border
    shadow: 'rgba(31, 38, 135, 0.05)', // Updated to match demo shadow
  },
  
  // Status Colors
  success: '#3FC380',
  warning: '#FFD464',
  error: '#FF6B6B',
  info: '#4A90E2',
};
