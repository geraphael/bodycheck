import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { User, Phone, Settings, Shield, Info, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface SlideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SlideMenu({ visible, onClose, onNavigate }: SlideMenuProps) {
  const translateX = useSharedValue(-screenWidth * 0.8);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
      backdropOpacity.value = withSpring(0.5, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      translateX.value = withSpring(-screenWidth * 0.8, {
        damping: 20,
        stiffness: 90,
      });
      backdropOpacity.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [visible]);

  // Swipe gesture to close menu
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        const progress = Math.max(event.translationX / (-screenWidth * 0.8), -1);
        translateX.value = interpolate(
          Math.abs(progress),
          [0, 1],
          [0, -screenWidth * 0.8],
          Extrapolate.CLAMP
        );
        backdropOpacity.value = interpolate(
          Math.abs(progress),
          [0, 1],
          [0.5, 0],
          Extrapolate.CLAMP
        );
      }
    })
    .onEnd((event) => {
      if (event.translationX < -screenWidth * 0.2 || event.velocityX < -500) {
        onClose();
      } else {
        translateX.value = withSpring(0);
        backdropOpacity.value = withSpring(0.5);
      }
    });

  const menuItems = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Personal health info',
      icon: User,
      color: '#2563EB',
      onPress: () => {
        onNavigate('/(tabs)/profile');
        onClose();
      }
    },
    {
      id: 'emergency',
      title: 'Emergency',
      subtitle: 'Quick emergency access',
      icon: Phone,
      color: '#DC2626',
      onPress: () => {
        onNavigate('/emergency');
        onClose();
      }
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: Settings,
      color: '#6B7280',
      onPress: () => {
        onNavigate('/(tabs)/profile');
        onClose();
      }
    },
    {
      id: 'privacy',
      title: 'Privacy',
      subtitle: 'Data protection',
      icon: Shield,
      color: '#059669',
      onPress: () => {
        onClose();
      }
    }
  ];

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
      pointerEvents: backdropOpacity.value > 0 ? 'auto' : 'none',
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity 
        style={StyleSheet.absoluteFill}
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
      </TouchableOpacity>
      
      {/* Menu */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.menuContainer, menuAnimatedStyle]}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <User size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.profileName}>Health Profile</Text>
            <Text style={styles.profileSubtitle}>Manage your health data</Text>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.versionInfo}>
              <Info size={16} color="#6B7280" />
              <View style={styles.versionText}>
                <Text style={styles.appName}>BodyCheck+</Text>
                <Text style={styles.versionNumber}>v1.0.0</Text>
              </View>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Swipe Indicator */}
          <View style={styles.swipeIndicator}>
            <View style={styles.swipeHandle} />
            <Text style={styles.swipeText}>Swipe left to close</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth * 0.8,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  profileSection: {
    backgroundColor: '#2563EB',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 20,
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  versionText: {
    flex: 1,
  },
  appName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  versionNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  swipeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -20 }],
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  swipeHandle: {
    width: 4,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  swipeText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    transform: [{ rotate: '90deg' }],
    width: 80,
    textAlign: 'center',
  },
});