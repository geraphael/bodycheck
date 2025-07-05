import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { router, usePathname } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeNavigationContextType {
  openMenu: () => void;
  closeMenu: () => void;
  isMenuOpen: boolean;
}

const SwipeNavigationContext = createContext<SwipeNavigationContextType | null>(null);

export const useSwipeNavigation = () => {
  const context = useContext(SwipeNavigationContext);
  if (!context) {
    throw new Error('useSwipeNavigation must be used within SwipeNavigationProvider');
  }
  return context;
};

interface SwipeNavigationProviderProps {
  children: React.ReactNode;
}

export default function SwipeNavigationProvider({ children }: SwipeNavigationProviderProps) {
  const translateX = useSharedValue(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Tab routes mapping
  const tabRoutes = [
    '/',
    '/hospitals',
    '/emergency',
    '/profile'
  ];

  const getCurrentTabIndex = () => {
    const currentIndex = tabRoutes.findIndex(route => {
      if (route === '/' && pathname === '/') return true;
      if (route !== '/' && pathname.startsWith(route)) return true;
      return false;
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  const navigateToTab = (direction: 'left' | 'right') => {
    const currentIndex = getCurrentTabIndex();
    let newIndex = currentIndex;

    if (direction === 'left' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < tabRoutes.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      router.push(tabRoutes[newIndex] as any);
    }
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Main content swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow horizontal swipes
      if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) return;

      // Menu opening gesture (swipe right from left edge)
      if (event.translationX > 0 && event.absoluteX < 50 && !isMenuOpen) {
        return;
      }

      // Tab navigation (only when menu is closed)
      if (!isMenuOpen) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      // Handle menu gestures
      if (event.absoluteX < 50 && event.translationX > screenWidth * 0.3) {
        runOnJS(openMenu)();
        return;
      }

      // Handle tab navigation
      const threshold = screenWidth * 0.25;
      const velocity = event.velocityX;

      if (Math.abs(event.translationX) > threshold || Math.abs(velocity) > 500) {
        if (event.translationX > 0 || velocity > 500) {
          runOnJS(navigateToTab)('left');
        } else if (event.translationX < 0 || velocity < -500) {
          runOnJS(navigateToTab)('right');
        }
      }

      // Reset translation
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [-screenWidth, 0, screenWidth],
            [-20, 0, 20],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <SwipeNavigationContext.Provider
      value={{
        openMenu,
        closeMenu,
        isMenuOpen,
      }}
    >
      <View style={styles.container}>
        {/* Main Content */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </SwipeNavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});