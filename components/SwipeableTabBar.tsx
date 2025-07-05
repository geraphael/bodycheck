import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions, PanGestureHandler, State } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeableTabBarProps extends BottomTabBarProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeableTabBar({ onSwipe, ...props }: SwipeableTabBarProps) {
  const translateX = useSharedValue(0);
  const panRef = useRef(null);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const threshold = screenWidth * 0.2;
      
      if (event.translationX > threshold) {
        // Swipe right - go to previous tab
        runOnJS(onSwipe)('right');
      } else if (event.translationX < -threshold) {
        // Swipe left - go to next tab
        runOnJS(onSwipe)('left');
      }
      
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <PanGestureHandler ref={panRef} onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.tabBar}>
          {/* Render your custom tab bar content here */}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 90,
    paddingBottom: 20,
    paddingTop: 10,
  },
});