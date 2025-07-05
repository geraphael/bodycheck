import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, User, Settings, Shield, Info } from 'lucide-react-native';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export default function MenuModal({ visible, onClose, onNavigate }: MenuModalProps) {
  const menuItems = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Personal information and health history',
      icon: User,
      color: '#2563EB',
      onPress: () => {
        onNavigate('/(tabs)/settings');
        onClose();
      }
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      icon: Settings,
      color: '#6B7280',
      onPress: () => {
        onNavigate('/(tabs)/settings');
        onClose();
      }
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we protect your health data',
      icon: Shield,
      color: '#059669',
      onPress: () => {
        // In a real app, this would navigate to privacy policy
        onClose();
      }
    },
    {
      id: 'about',
      title: 'About BodyCheck+',
      subtitle: 'Version 1.0.0 • Learn more about our app',
      icon: Info,
      color: '#7C3AED',
      onPress: () => {
        // In a real app, this would show about/version info
        onClose();
      }
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                    <IconComponent size={24} color={item.color} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              BodyCheck+ • AI-Powered Health Assessment
            </Text>
            <Text style={styles.versionText}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});