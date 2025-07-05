import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Users, Brain, Stethoscope, Activity, Menu } from 'lucide-react-native';
import EmergencyButton from '@/components/EmergencyButton';
import AgeSelector from '@/components/AgeSelector';
import SymptomCategorySelector from '@/components/SymptomCategorySelector';
import SlideMenu from '@/components/SlideMenu';

export default function HomeScreen() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [showSymptomCategories, setShowSymptomCategories] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  const handleMenuNavigate = (screen: string) => {
    router.push(screen as any);
  };

  if (showSymptomCategories) {
    return (
      <View style={styles.container}>
        <View style={styles.categoryHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
            <Menu size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={handleReset}>
            <Text style={styles.backButtonText}>← Back</Text>
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
            Choose the area that best describes your main concern
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
        
        <SlideMenu
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onNavigate={handleMenuNavigate}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Menu size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Stethoscope size={40} color="#2563EB" />
            <Activity size={32} color="#059669" style={styles.activityIcon} />
          </View>
          <Text style={styles.title}>BodyCheck+</Text>
          <Text style={styles.subtitle}>AI Health Assessment</Text>
          <Text style={styles.description}>
            Get personalized health insights using smart questions
          </Text>
        </View>

        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Tell us about yourself</Text>
          <Text style={styles.sectionSubtitle}>Choose your gender</Text>
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
                <User size={20} color={selectedGender === 'male' ? '#FFFFFF' : '#2563EB'} />
              </View>
              <Text style={[
                styles.genderText,
                selectedGender === 'male' && styles.genderTextActive
              ]}>Male</Text>
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
                <Users size={20} color={selectedGender === 'female' ? '#FFFFFF' : '#2563EB'} />
              </View>
              <Text style={[
                styles.genderText,
                selectedGender === 'female' && styles.genderTextActive
              ]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedGender && (
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>What's your age range?</Text>
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
              <Text style={styles.continueButtonText}>Start Assessment</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Why choose us</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Brain size={20} color="#2563EB" />
              <Text style={styles.featureText}>Smart symptom analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Activity size={20} color="#059669" />
              <Text style={styles.featureText}>Easy questions</Text>
            </View>
            <View style={styles.featureItem}>
              <Stethoscope size={20} color="#7C3AED" />
              <Text style={styles.featureText}>Professional insights</Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerTitle}>Important: </Text>
            This app provides health information but cannot replace a doctor. Always consult healthcare professionals for medical concerns.
          </Text>
        </View>
      </ScrollView>

      <EmergencyButton onPress={handleEmergencyPress} />
      
      <SlideMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onNavigate={handleMenuNavigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  topBarSpacer: {
    width: 24,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genderCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  genderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  genderIconContainerActive: {
    backgroundColor: '#2563EB',
  },
  genderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  genderTextActive: {
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
    flex: 1,
    marginHorizontal: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    textAlign: 'center',
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