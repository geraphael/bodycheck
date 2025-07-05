import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Dimensions } from 'react-native';
import { User, Phone, Settings, Shield, Info, X } from 'lucide-react-native';

interface SlideMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SlideMenu({ visible, onClose, onNavigate }: SlideMenuProps) {
  const slideAnim = React.useRef(new Animated.Value(-screenWidth * 0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

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
        onNavigate('/(tabs)/settings');
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
        onNavigate('/privacy');
        onClose();
      }
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
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
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: screenWidth * 0.8,
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
});