import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react-native';

interface SwipeGestureIndicatorProps {
  type: 'tab-navigation' | 'menu-open' | 'menu-close';
  visible: boolean;
  onComplete?: () => void;
}

export default function SwipeGestureIndicator({ 
  type, 
  visible, 
  onComplete 
}: SwipeGestureIndicatorProps) {
  const animationValue = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      
      // Start the gesture animation
      animationValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 300 })
        ),
        3, // Repeat 3 times
        false,
        () => {
          opacity.value = withTiming(0, { duration: 300 });
          onComplete?.();
        }
      );
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      animationValue.value = 0;
    }
  }, [visible]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: interpolate(
            opacity.value,
            [0, 1],
            [0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const gestureAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [0, 1],
      type === 'menu-open' ? [0, 60] : 
      type === 'menu-close' ? [0, -60] : 
      [0, 40],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity: interpolate(
        animationValue.value,
        [0, 0.5, 1],
        [1, 1, 0.3],
        Extrapolate.CLAMP
      ),
    };
  });

  const getIndicatorContent = () => {
    switch (type) {
      case 'menu-open':
        return {
          icon: <Menu size={20} color="#2563EB" />,
          text: 'Swipe right from edge to open menu',
          direction: 'right',
        };
      case 'menu-close':
        return {
          icon: <ChevronLeft size={20} color="#2563EB" />,
          text: 'Swipe left to close menu',
          direction: 'left',
        };
      case 'tab-navigation':
        return {
          icon: <ChevronRight size={20} color="#2563EB" />,
          text: 'Swipe left or right to switch tabs',
          direction: 'both',
        };
      default:
        return {
          icon: <ChevronRight size={20} color="#2563EB" />,
          text: 'Swipe to navigate',
          direction: 'right',
        };
    }
  };

  const content = getIndicatorContent();

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.indicator}>
        <View style={styles.gestureContainer}>
          {content.direction === 'both' && (
            <Animated.View style={[styles.gestureIcon, gestureAnimatedStyle]}>
              <ChevronLeft size={20} color="#2563EB" />
            </Animated.View>
          )}
          
          <Animated.View style={[styles.gestureIcon, gestureAnimatedStyle]}>
            {content.icon}
          </Animated.View>
          
          {content.direction === 'both' && (
            <Animated.View style={[styles.gestureIcon, gestureAnimatedStyle]}>
              <ChevronRight size={20} color="#2563EB" />
            </Animated.View>
          )}
        </View>
        
        <Text style={styles.instructionText}>{content.text}</Text>
        
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: interpolate(
                  animationValue.value,
                  [0, 1],
                  ['0%', '100%'],
                  Extrapolate.CLAMP
                ),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  indicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
    minWidth: 200,
  },
  gestureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    height: 40,
  },
  gestureIcon: {
    marginHorizontal: 4,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
});