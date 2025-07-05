import React, { createContext, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
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
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function SwipeNavigationProvider({ 
  children, 
  onMenuToggle 
}: SwipeNavigationProviderProps) {
  const translateX = useSharedValue(0);
  const menuTranslateX = useSharedValue(-screenWidth * 0.8);
  const isMenuOpenRef = useRef(false);
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
    isMenuOpenRef.current = true;
    menuTranslateX.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
    onMenuToggle?.(true);
  };

  const closeMenu = () => {
    isMenuOpenRef.current = false;
    menuTranslateX.value = withSpring(-screenWidth * 0.8, {
      damping: 20,
      stiffness: 90,
    });
    onMenuToggle?.(false);
  };

  // Main content swipe gesture
  const contentPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow horizontal swipes
      if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) return;

      // Menu opening gesture (swipe right from left edge)
      if (event.translationX > 0 && event.absoluteX < 50 && !isMenuOpenRef.current) {
        const progress = Math.min(event.translationX / (screenWidth * 0.8), 1);
        menuTranslateX.value = interpolate(
          progress,
          [0, 1],
          [-screenWidth * 0.8, 0],
          Extrapolate.CLAMP
        );
        return;
      }

      // Menu closing gesture (swipe left when menu is open)
      if (event.translationX < 0 && isMenuOpenRef.current) {
        const progress = Math.max(event.translationX / (-screenWidth * 0.8), -1);
        menuTranslateX.value = interpolate(
          Math.abs(progress),
          [0, 1],
          [0, -screenWidth * 0.8],
          Extrapolate.CLAMP
        );
        return;
      }

      // Tab navigation (only when menu is closed)
      if (!isMenuOpenRef.current) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      // Handle menu gestures
      if (event.absoluteX < 50 && event.translationX > screenWidth * 0.3) {
        runOnJS(openMenu)();
        return;
      }

      if (isMenuOpenRef.current) {
        if (event.translationX < -screenWidth * 0.2 || event.velocityX < -500) {
          runOnJS(closeMenu)();
        } else {
          runOnJS(openMenu)();
        }
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

  // Backdrop gesture for closing menu
  const backdropPanGesture = Gesture.Pan()
    .onEnd((event) => {
      if (isMenuOpenRef.current && (event.translationX < -50 || event.velocityX < -300)) {
        runOnJS(closeMenu)();
      }
    });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [-screenWidth, 0, screenWidth],
            [-50, 0, 50],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: menuTranslateX.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      menuTranslateX.value,
      [-screenWidth * 0.8, 0],
      [0, 0.5],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      pointerEvents: opacity > 0 ? 'auto' : 'none',
    };
  });

  return (
    <SwipeNavigationContext.Provider
      value={{
        openMenu,
        closeMenu,
        isMenuOpen: isMenuOpenRef.current,
      }}
    >
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          {/* Menu */}
          <Animated.View style={[styles.menu, menuAnimatedStyle]}>
            {/* Menu content will be rendered by SlideMenu component */}
          </Animated.View>

          {/* Backdrop */}
          <GestureDetector gesture={backdropPanGesture}>
            <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
          </GestureDetector>

          {/* Main Content */}
          <GestureDetector gesture={contentPanGesture}>
            <Animated.View style={[styles.content, contentAnimatedStyle]}>
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
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
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth * 0.8,
    height: '100%',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 999,
  },
});