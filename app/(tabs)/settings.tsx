import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Trash2, Moon, Sun, Bell, Shield, FileText, Info, ChevronRight, Database, Palette } from 'lucide-react-native';
import { clearAllData, getPersonalInfo } from '@/utils/storage';
import { router } from 'expo-router';

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [assessmentCount, setAssessmentCount] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const personalInfo = await getPersonalInfo();
    setAssessmentCount(personalInfo.assessmentHistory.length);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your health data, assessments, and profile information. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              setAssessmentCount(0);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const handleClearAssessmentHistory = () => {
    Alert.alert(
      'Clear Assessment History',
      'This will delete all your previous health assessments. Your profile information will remain intact.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear History',
          style: 'destructive',
          onPress: async () => {
            try {
              const personalInfo = await getPersonalInfo();
              personalInfo.assessmentHistory = [];
              await clearAllData();
              setAssessmentCount(0);
              Alert.alert('Success', 'Assessment history cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear assessment history');
            }
          }
        }
      ]
    );
  };

  const settingsItems: SettingsItem[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: 'Dark mode and theme settings',
      icon: isDarkMode ? Moon : Sun,
      type: 'navigation',
      onPress: () => {
        // Navigate to appearance settings
        Alert.alert('Appearance', 'Theme customization coming soon!');
      }
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
      icon: Bell,
      type: 'toggle',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      icon: Shield,
      type: 'navigation',
      onPress: () => router.push('/privacy')
    },
    {
      id: 'assessment_history',
      title: 'Assessment History',
      subtitle: `${assessmentCount} assessments completed`,
      icon: FileText,
      type: 'navigation',
      onPress: () => router.push('/assessment-history')
    },
    {
      id: 'clear_history',
      title: 'Clear Assessment History',
      subtitle: 'Delete all previous assessments',
      icon: Database,
      type: 'action',
      onPress: handleClearAssessmentHistory,
      destructive: true
    },
    {
      id: 'clear_all',
      title: 'Clear All Data',
      subtitle: 'Delete all app data permanently',
      icon: Trash2,
      type: 'action',
      onPress: handleClearAllData,
      destructive: true
    },
    {
      id: 'about',
      title: 'About BodyCheck+',
      subtitle: 'Version 1.0.0',
      icon: Info,
      type: 'navigation',
      onPress: () => {
        Alert.alert(
          'About BodyCheck+',
          'AI-powered health assessment app designed to help you understand your symptoms and make informed healthcare decisions.\n\nVersion: 1.0.0\nDeveloped with care for your health and privacy.'
        );
      }
    }
  ];

  const renderSettingsItem = (item: SettingsItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingsItem, item.destructive && styles.destructiveItem]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.itemLeft}>
          <View style={[
            styles.iconContainer,
            item.destructive && styles.destructiveIconContainer
          ]}>
            <item.icon 
              size={20} 
              color={item.destructive ? '#DC2626' : '#6B7280'} 
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={[
              styles.itemTitle,
              item.destructive && styles.destructiveText
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.itemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight size={20} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settingsItems.filter(item => ['appearance', 'notifications'].includes(item.id)).map(renderSettingsItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          {settingsItems.filter(item => ['privacy', 'assessment_history'].includes(item.id)).map(renderSettingsItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          {settingsItems.filter(item => ['clear_history', 'clear_all'].includes(item.id)).map(renderSettingsItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {settingsItems.filter(item => item.id === 'about').map(renderSettingsItem)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your health data is stored securely on your device and is never shared without your explicit consent.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  destructiveItem: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destructiveIconContainer: {
    backgroundColor: '#FEE2E2',
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
  destructiveText: {
    color: '#DC2626',
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  itemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    textAlign: 'center',
    lineHeight: 18,
  },
});