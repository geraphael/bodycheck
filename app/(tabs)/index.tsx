import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { User, Users, Brain, Stethoscope, Activity, Menu, ArrowRight, Plus, Clock, TrendingUp } from 'lucide-react-native';
import EmergencyButton from '@/components/EmergencyButton';
import AgeSelector from '@/components/AgeSelector';
import SymptomCategorySelector from '@/components/SymptomCategorySelector';
import SlideMenu from '@/components/SlideMenu';
import SwipeableTabIndicator from '@/components/SwipeableTabIndicator';
import SwipeGestureIndicator from '@/components/SwipeGestureIndicator';

export default function HomeScreen() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [showSymptomCategories, setShowSymptomCategories] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(false);

  useEffect(() => {
    // Show swipe indicator on first load
    const timer = setTimeout(() => {
      setShowSwipeIndicator(true);
    }, 1000);

    // Show gesture hint after a delay
    const gestureTimer = setTimeout(() => {
      setShowGestureHint(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(gestureTimer);
    };
  }, []);

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
            <Menu size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Symptom Selector</Text>
          
          <TouchableOpacity style={styles.backButton} onPress={handleReset}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionBanner}>
          <Text style={styles.instructionText}>
            Tap the area on the body where you're experiencing symptoms.
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.bodyVisualizationContainer}>
            <View style={styles.bodyModel}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.bodyImage}
                resizeMode="contain"
              />
              <View style={styles.bodyOverlay}>
                <TouchableOpacity 
                  style={[styles.bodyZone, styles.headZone]}
                  onPress={() => handleSymptomCategoryPress('neurological')}
                >
                  <Text style={styles.zoneLabel}>Head</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.bodyZone, styles.chestZone]}
                  onPress={() => handleSymptomCategoryPress('cardiovascular')}
                >
                  <Text style={styles.zoneLabel}>Chest</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.bodyZone, styles.abdomenZone]}
                  onPress={() => handleSymptomCategoryPress('gastrointestinal')}
                >
                  <Text style={styles.zoneLabel}>Abdomen</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlButtonText}>Zoom</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlButtonText}>Rotate</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={() => handleSymptomCategoryPress('general')}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>

        <SlideMenu
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onNavigate={handleMenuNavigate}
        />

        <SwipeableTabIndicator visible={showSwipeIndicator} />
        
        <SwipeGestureIndicator
          type="tab-navigation"
          visible={showGestureHint}
          onComplete={() => setShowGestureHint(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Menu size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>HealthCheck</Text>
        
        <TouchableOpacity style={styles.settingsButton}>
          <View style={styles.settingsIcon}>
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, Dr. Anya Sharma</Text>
          <Text style={styles.welcomeSubtitle}>
            How are you feeling today? Start a new diagnosis or review your past health history.
          </Text>
          
          <TouchableOpacity style={styles.startDiagnosisButton} onPress={handleContinue}>
            <Text style={styles.startDiagnosisText}>Start Diagnosis</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.healthTipsSection}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.tipImage}
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Stay Active</Text>
                <Text style={styles.tipDescription}>
                  Regular exercise boosts your mood and energy levels.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.tipImage}
              />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Eat Well</Text>
                <Text style={styles.tipDescription}>
                  A balanced diet is key to good health and well-being.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <TouchableOpacity style={styles.quickAccessItem}>
            <Clock size={20} color="#6B7280" />
            <Text style={styles.quickAccessText}>Past Health History</Text>
            <ArrowRight size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {!selectedGender && (
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
        )}

        {selectedGender && !selectedAge && (
          <View style={styles.selectionSection}>
            <Text style={styles.sectionTitle}>What's your age range?</Text>
            <AgeSelector
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
            />
          </View>
        )}
      </ScrollView>

      <SlideMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onNavigate={handleMenuNavigate}
      />

      <SwipeableTabIndicator visible={showSwipeIndicator} />
      
      <SwipeGestureIndicator
        type="menu-open"
        visible={showGestureHint}
        onComplete={() => setShowGestureHint(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  menuButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  settingsDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 40,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  startDiagnosisButton: {
    backgroundColor: '#10B981',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startDiagnosisText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  healthTipsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  tipsContainer: {
    gap: 16,
  },
  tipCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipImage: {
    width: '100%',
    height: 160,
  },
  tipContent: {
    padding: 20,
  },
  tipTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  quickAccessSection: {
    marginBottom: 40,
  },
  quickAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  quickAccessText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  instructionBanner: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 24,
  },
  bodyVisualizationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bodyModel: {
    position: 'relative',
    width: 300,
    height: 500,
    backgroundColor: '#374151',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  bodyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bodyZone: {
    position: 'absolute',
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headZone: {
    top: 40,
    left: 120,
    width: 60,
    height: 80,
  },
  chestZone: {
    top: 140,
    left: 100,
    width: 100,
    height: 80,
  },
  abdomenZone: {
    top: 240,
    left: 110,
    width: 80,
    height: 60,
  },
  zoneLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  controlButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  nextButton: {
    backgroundColor: '#10B981',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  selectionSection: {
    marginBottom: 32,
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
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
});