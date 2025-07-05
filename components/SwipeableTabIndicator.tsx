import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { usePathname } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeableTabIndicatorProps {
  visible?: boolean;
}

export default function SwipeableTabIndicator({ visible = true }: SwipeableTabIndicatorProps) {
  const pathname = usePathname();
  const opacity = useSharedValue(0);

  const tabRoutes = [
    { path: '/', name: 'Body Check', icon: '🩺' },
    { path: '/hospitals', name: 'Hospitals', icon: '🏥' },
    { path: '/emergency', name: 'Emergency', icon: '🚨' },
    { path: '/profile', name: 'Profile', icon: '👤' },
  ];

  const getCurrentTabIndex = () => {
    const currentIndex = tabRoutes.findIndex(route => {
      if (route.path === '/' && pathname === '/') return true;
      if (route.path !== '/' && pathname.startsWith(route.path)) return true;
      return false;
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  const currentIndex = getCurrentTabIndex();
  const canSwipeLeft = currentIndex > 0;
  const canSwipeRight = currentIndex < tabRoutes.length - 1;

  React.useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1, { damping: 20, stiffness: 90 });
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        opacity.value = withSpring(0, { damping: 20, stiffness: 90 });
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      opacity.value = withSpring(0, { damping: 20, stiffness: 90 });
    }
  }, [visible, pathname]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateY: interpolate(
            opacity.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.indicator}>
        {/* Left swipe hint */}
        <View style={[styles.swipeHint, !canSwipeLeft && styles.swipeHintDisabled]}>
          <ChevronLeft size={16} color={canSwipeLeft ? '#2563EB' : '#9CA3AF'} />
          {canSwipeLeft && (
            <Text style={styles.swipeText}>
              {tabRoutes[currentIndex - 1]?.name}
            </Text>
          )}
        </View>

        {/* Current tab */}
        <View style={styles.currentTab}>
          <Text style={styles.currentTabIcon}>{tabRoutes[currentIndex]?.icon}</Text>
          <Text style={styles.currentTabName}>{tabRoutes[currentIndex]?.name}</Text>
          <View style={styles.dots}>
            {tabRoutes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Right swipe hint */}
        <View style={[styles.swipeHint, !canSwipeRight && styles.swipeHintDisabled]}>
          {canSwipeRight && (
            <Text style={styles.swipeText}>
              {tabRoutes[currentIndex + 1]?.name}
            </Text>
          )}
          <ChevronRight size={16} color={canSwipeRight ? '#2563EB' : '#9CA3AF'} />
        </View>
      </View>

      <Text style={styles.instructionText}>
        Swipe left/right to navigate • Swipe from edge to open menu
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  swipeHintDisabled: {
    opacity: 0.3,
  },
  swipeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  currentTab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    minWidth: 120,
  },
  currentTabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  currentTabName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#2563EB',
  },
  instructionText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});