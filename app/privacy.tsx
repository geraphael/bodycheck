import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>How we protect your health data</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Shield size={32} color="#2563EB" />
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            At BodyCheck+, we are committed to protecting your personal health information. 
            This privacy policy explains how we collect, use, and safeguard your data.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#059669" />
            <Text style={styles.sectionTitle}>Information We Collect</Text>
          </View>
          <Text style={styles.sectionContent}>
            We collect only the information necessary to provide you with personalized health assessments:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Basic demographic information (age, gender)</Text>
            <Text style={styles.bulletItem}>• Symptoms and health concerns you report</Text>
            <Text style={styles.bulletItem}>• Assessment responses and preferences</Text>
            <Text style={styles.bulletItem}>• Device location (only when you grant permission)</Text>
            <Text style={styles.bulletItem}>• App usage patterns to improve our service</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#DC2626" />
            <Text style={styles.sectionTitle}>How We Protect Your Data</Text>
          </View>
          <Text style={styles.sectionContent}>
            Your health information is stored securely on your device using industry-standard encryption:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• All data is encrypted and stored locally on your device</Text>
            <Text style={styles.bulletItem}>• No health information is transmitted to external servers</Text>
            <Text style={styles.bulletItem}>• You have complete control over your data</Text>
            <Text style={styles.bulletItem}>• Data can be deleted at any time through app settings</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={20} color="#7C3AED" />
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          </View>
          <Text style={styles.sectionContent}>
            We use your information solely to provide and improve our health assessment service:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Generate personalized health insights and recommendations</Text>
            <Text style={styles.bulletItem}>• Improve our AI assessment algorithms</Text>
            <Text style={styles.bulletItem}>• Provide location-based emergency services</Text>
            <Text style={styles.bulletItem}>• Maintain your assessment history for reference</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Information Sharing</Text>
          </View>
          <Text style={styles.sectionContent}>
            We do not sell, trade, or share your personal health information with third parties. Your data remains private and secure:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• No sharing with insurance companies or employers</Text>
            <Text style={styles.bulletItem}>• No selling of data to pharmaceutical companies</Text>
            <Text style={styles.bulletItem}>• No marketing or advertising use of your health data</Text>
            <Text style={styles.bulletItem}>• Emergency services access only when you explicitly request it</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#0891B2" />
            <Text style={styles.sectionTitle}>Your Rights and Controls</Text>
          </View>
          <Text style={styles.sectionContent}>
            You have complete control over your health information:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access and review all your stored data</Text>
            <Text style={styles.bulletItem}>• Edit or update your information at any time</Text>
            <Text style={styles.bulletItem}>• Delete specific assessments or all data</Text>
            <Text style={styles.bulletItem}>• Export your data for personal records</Text>
            <Text style={styles.bulletItem}>• Opt out of data collection features</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#059669" />
            <Text style={styles.sectionTitle}>Data Retention</Text>
          </View>
          <Text style={styles.sectionContent}>
            Your assessment data is retained locally on your device until you choose to delete it. 
            We do not automatically delete your health information, giving you full control over your health history.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#DC2626" />
            <Text style={styles.sectionTitle}>Security Measures</Text>
          </View>
          <Text style={styles.sectionContent}>
            We implement multiple layers of security to protect your information:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• End-to-end encryption for all sensitive data</Text>
            <Text style={styles.bulletItem}>• Secure local storage with device-level protection</Text>
            <Text style={styles.bulletItem}>• Regular security audits and updates</Text>
            <Text style={styles.bulletItem}>• No cloud storage of personal health information</Text>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions About Privacy?</Text>
          <Text style={styles.contactText}>
            If you have any questions about this privacy policy or how we handle your data, 
            please contact our privacy team at privacy@bodycheck.app
          </Text>
        </View>

        <View style={styles.updateSection}>
          <Text style={styles.updateTitle}>Policy Updates</Text>
          <Text style={styles.updateText}>
            This privacy policy was last updated on January 1, 2025. We will notify you of any 
            significant changes to our privacy practices through the app.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using BodyCheck+, you agree to this privacy policy. Your trust is important to us, 
            and we are committed to maintaining the highest standards of data protection.
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    backgroundColor: '#EFF6FF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  updateSection: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  updateTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  updateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    textAlign: 'center',
  },
});