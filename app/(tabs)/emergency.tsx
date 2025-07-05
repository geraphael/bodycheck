import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Phone, MapPin, TriangleAlert as AlertTriangle, Heart, Shield, Clock } from 'lucide-react-native';
import * as Linking from 'expo-linking';

export default function EmergencyScreen() {
  const handleCall911 = () => {
    Alert.alert(
      'Emergency Call',
      'This will dial 911 for emergency services.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 911', onPress: () => Linking.openURL('tel:911') },
      ]
    );
  };

  const handlePoisonControl = () => {
    Linking.openURL('tel:18002221222');
  };

  const handleSuicidePrevention = () => {
    Linking.openURL('tel:18002738255');
  };

  const emergencySymptoms = [
    'Chest pain or pressure',
    'Difficulty breathing',
    'Severe bleeding',
    'Loss of consciousness',
    'Severe allergic reaction',
    'Stroke symptoms (FAST)',
    'Severe burns',
    'Choking',
    'Severe head injury',
    'Severe abdominal pain',
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AlertTriangle size={32} color="#DC2626" />
          <Text style={styles.title}>Emergency Services</Text>
          <Text style={styles.subtitle}>Get immediate help when you need it most</Text>
        </View>

        <View style={styles.emergencySection}>
          <TouchableOpacity style={styles.call911Button} onPress={handleCall911}>
            <Phone size={24} color="#FFFFFF" />
            <Text style={styles.call911Text}>Call 911</Text>
            <Text style={styles.call911Subtitle}>Emergency Services</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Emergency Contacts</Text>
          
          <TouchableOpacity style={styles.contactButton} onPress={handlePoisonControl}>
            <Shield size={20} color="#2563EB" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Poison Control</Text>
              <Text style={styles.contactNumber}>1-800-222-1222</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleSuicidePrevention}>
            <Heart size={20} color="#2563EB" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Suicide Prevention Lifeline</Text>
              <Text style={styles.contactNumber}>1-800-273-8255</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When to Call 911</Text>
          <Text style={styles.sectionSubtitle}>
            Call immediately if you experience any of these symptoms:
          </Text>
          
          <View style={styles.symptomsList}>
            {emergencySymptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <View style={styles.symptomBullet} />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAST Stroke Recognition</Text>
          <View style={styles.fastCard}>
            <View style={styles.fastItem}>
              <Text style={styles.fastLetter}>F</Text>
              <Text style={styles.fastText}>Face drooping</Text>
            </View>
            <View style={styles.fastItem}>
              <Text style={styles.fastLetter}>A</Text>
              <Text style={styles.fastText}>Arm weakness</Text>
            </View>
            <View style={styles.fastItem}>
              <Text style={styles.fastLetter}>S</Text>
              <Text style={styles.fastText}>Speech difficulty</Text>
            </View>
            <View style={styles.fastItem}>
              <Text style={styles.fastLetter}>T</Text>
              <Text style={styles.fastText}>Time to call 911</Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerTitle}>Important: </Text>
            If you're experiencing a medical emergency, don\'t hesitate to call 911. 
            Time is critical in emergency situations.
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  emergencySection: {
    marginBottom: 32,
  },
  call911Button: {
    backgroundColor: '#DC2626',
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  call911Text: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  call911Subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    marginLeft: 16,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  contactNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  symptomsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginRight: 12,
  },
  symptomText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  fastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fastLetter: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    width: 32,
  },
  fastText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
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