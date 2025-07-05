import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Users, Brain, Stethoscope, Activity } from 'lucide-react-native';
import EmergencyButton from '@/components/EmergencyButton';
import AgeSelector from '@/components/AgeSelector';
import SymptomCategorySelector from '@/components/SymptomCategorySelector';

export default function HomeScreen() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [showSymptomCategories, setShowSymptomCategories] = useState(false);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
  };

  const handleAgeSelect = (ageRange: string) => {
    setSelectedAge(ageRange);
  };

  const handleContinue = () => {
    if (selectedGender && selectedAge) {
      setShowSymptomCategories(true);
    }
  };

  const handleSymptomCategoryPress = (category: string) => {
    router.push(`/assessment/${category}?gender=${selectedGender}&age=${selectedAge}`);
  };

  const handleEmergencyPress = () => {
    Alert.alert(
      'Emergency Assistance',
      'Are you experiencing a medical emergency?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 911', onPress: () => router.push('/emergency') },
      ]
    );
  };

  const handleReset = () => {
    setSelectedGender(null);
    setSelectedAge('');
    setShowSymptomCategories(false);
  };

  if (showSymptomCategories) {
    return (
      <View style={styles.container}>
        <View style={styles.categoryHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleReset}>
            <Text style={styles.backButtonText}>← Back to Selection</Text>
          </TouchableOpacity>
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              {selectedGender === 'male' ? 'Male' : 'Female'} • {selectedAge}
            </Text>
          </View>
        </View>

        <View style={styles.instructionBanner}>
          <Brain size={20} color="#2563EB" />
          <Text style={styles.instructionText}>
            Select the category that best describes your primary concern
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SymptomCategorySelector
            gender={selectedGender}
            age={selectedAge}
            onCategoryPress={handleSymptomCategoryPress}
          />
        </ScrollView>

        <EmergencyButton onPress={handleEmergencyPress} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Stethoscope size={40} color="#2563EB" />
            <Activity size={32} color="#059669" style={styles.activityIcon} />
          </View>
          <Text style={styles.title}>BodyCheck+</Text>
          <Text style={styles.subtitle}>AI-Powered Medical Assessment</Text>
          <Text style={styles.description}>
            Advanced symptom analysis using intelligent questioning and machine learning algorithms
          </Text>
        </View>

        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Select Gender</Text>
          <View style={styles.genderSelector}>
            <TouchableOpacity
              style={[
                styles.genderCard,
                selectedGender === 'male' && styles.genderCardActive
              ]}
              onPress={() => handleGenderSelect('male')}
            >
              <View style={[
                styles.genderIconContainer,
                selectedGender === 'male' && styles.genderIconContainerActive
              ]}>
                <User size={32} color={selectedGender === 'male' ? '#FFFFFF' : '#2563EB'} />
              </View>
              <Text style={[
                styles.genderText,
                selectedGender === 'male' && styles.genderTextActive
              ]}>Male</Text>
              <Text style={[
                styles.genderSubtext,
                selectedGender === 'male' && styles.genderSubtextActive
              ]}>Male-specific health assessment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderCard,
                selectedGender === 'female' && styles.genderCardActive
              ]}
              onPress={() => handleGenderSelect('female')}
            >
              <View style={[
                styles.genderIconContainer,
                selectedGender === 'female' && styles.genderIconContainerActive
              ]}>
                <Users size={32} color={selectedGender === 'female' ? '#FFFFFF' : '#2563EB'} />
              </View>
              <Text style={[
                styles.genderText,
                selectedGender === 'female' && styles.genderTextActive
              ]}>Female</Text>
              <Text style={[
                styles.genderSubtext,
                selectedGender === 'female' && styles.genderSubtextActive
              ]}>Female-specific health assessment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedGender && (
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>Select Age Range</Text>
            <AgeSelector
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
            />
          </View>
        )}

        {selectedGender && selectedAge && (
          <View style={styles.continueSection}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Brain size={20} color="#FFFFFF" />
              <Text style={styles.continueButtonText}>Start AI Assessment</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Advanced Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Brain size={20} color="#2563EB" />
              <Text style={styles.featureText}>AI-powered symptom analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Activity size={20} color="#059669" />
              <Text style={styles.featureText}>Intelligent question hierarchy</Text>
            </View>
            <View style={styles.featureItem}>
              <Stethoscope size={20} color="#7C3AED" />
              <Text style={styles.featureText}>Professional-grade diagnosis</Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerTitle}>Medical Disclaimer: </Text>
            This app provides AI-generated health insights and should not replace professional medical advice. 
            Always consult with a healthcare provider for medical concerns.
          </Text>
        </View>
      </ScrollView>

      <EmergencyButton onPress={handleEmergencyPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  activityIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  selectionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  genderSelector: {
    gap: 16,
  },
  genderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  genderCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  genderIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  genderIconContainerActive: {
    backgroundColor: '#2563EB',
  },
  genderText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  genderTextActive: {
    color: '#2563EB',
  },
  genderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  genderSubtextActive: {
    color: '#2563EB',
  },
  continueSection: {
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  selectionInfo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    flex: 1,
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  disclaimerTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
});