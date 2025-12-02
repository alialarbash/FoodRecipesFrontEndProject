import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TextProps } from 'react-native';

interface MarqueeTextProps extends TextProps {
  text: string;
  duration?: number;
  style?: any;
  containerStyle?: any;
}

/**
 * Calculate duration based on text length
 * Short (< 50): 13s, Medium (50-80): 26s, Long (> 80): 39s+
 */
const calculateDuration = (textLength: number): number => {
  if (textLength < 50) {
    return 13000; // 13 seconds
  } else if (textLength < 80) {
    return 26000; // 26 seconds
  } else {
    // Scale up for longer text: 39s base + 0.5s per character over 80
    return 39000 + (textLength - 80) * 500;
  }
};

/**
 * MarqueeText component - Smoothly scrolls text horizontally if it overflows
 * Only scrolls if text is longer than container width
 */
export const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  duration,
  style,
  containerStyle,
  ...textProps
}) => {
  // Calculate duration based on text length if not provided
  const calculatedDuration = duration || calculateDuration(text.length);
  const translateX = useRef(new Animated.Value(0)).current;
  const textWidthRef = useRef(0);
  const containerWidthRef = useRef(0);
  const [needsScroll, setNeedsScroll] = useState(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Reset when text changes
    translateX.setValue(0);
    
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    if (needsScroll && textWidthRef.current > containerWidthRef.current) {
      // Calculate distance to scroll
      const scrollDistance = textWidthRef.current - containerWidthRef.current + 50;
      
      // Create looping animation
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(1000), // Pause at start
          Animated.timing(translateX, {
            toValue: -scrollDistance,
            duration: calculatedDuration,
            useNativeDriver: true,
          }),
          Animated.delay(2000), // Pause at end
          Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      
      animationRef.current = animation;
      animation.start();
      
      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }
  }, [text, calculatedDuration, translateX, needsScroll]);

  const handleTextLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    textWidthRef.current = width;
    
    // Check if we need to scroll
    if (containerWidthRef.current > 0) {
      const shouldScroll = width > containerWidthRef.current;
      setNeedsScroll(shouldScroll);
    }
  };

  const handleContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    containerWidthRef.current = width;
    
    // Re-check if we need to scroll
    if (textWidthRef.current > 0) {
      const shouldScroll = textWidthRef.current > width;
      setNeedsScroll(shouldScroll);
    }
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={handleContainerLayout}
    >
      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <Text
          {...textProps}
          style={[styles.text, style]}
          onLayout={handleTextLayout}
          numberOfLines={1}
        >
          {text}
        </Text>
        {needsScroll && (
          <Text
            {...textProps}
            style={[styles.text, style, styles.duplicateText]}
            numberOfLines={1}
          >
            {text}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
    minWidth: 0, // Allow container to shrink
  },
  textContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  text: {
    // Text styles will be passed via style prop
    flexShrink: 0, // Prevent text from shrinking
  },
  duplicateText: {
    marginLeft: 50, // Space between original and duplicate
    flexShrink: 0,
  },
});

