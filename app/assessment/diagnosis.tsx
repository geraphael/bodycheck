import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Heart, Home, Building2, User } from 'lucide-react-native';

export default function DiagnosisScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnosis</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.diagnosisCard}>
          <Text style={styles.diagnosisTitle}>Common Cold</Text>
          <Text style={styles.probabilityText}>Probability: 85%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Causes</Text>
          <Text style={styles.sectionText}>
            Common cold is caused by viruses, most commonly rhinovirus. These viruses spread 
            through the air or close contact with an infected person.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          <Text style={styles.sectionText}>
            Symptoms include runny nose, sore throat, cough, congestion, and mild fever. 
            Symptoms usually appear one to three days after exposure to a cold virus.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Treatment</Text>
          <Text style={styles.sectionText}>
            Treatment focuses on relieving symptoms. Rest, fluids, and over-the-counter 
            medications like pain relievers and decongestants can help. Antibiotics are 
            not effective against colds.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Warning</Text>
          <Text style={styles.sectionText}>
            Seek medical attention if you experience high fever, severe symptoms, or 
            symptoms that worsen or persist for more than 10 days. Difficulty breathing 
            or chest pain requires immediate care.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/')}>
          <Home size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton}>
          <View style={styles.tabIcon}>
            <View style={styles.symptomIcon} />
            <View style={styles.symptomIcon} />
            <View style={styles.symptomIcon} />
          </View>
          <Text style={styles.tabText}>Symptoms</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Heart size={24} color="#1F2937" />
          <Text style={[styles.tabText, styles.activeTabText]}>Diagnosis</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/(tabs)/profile')}>
          <User size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  diagnosisCard: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
  },
  diagnosisTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  probabilityText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  tabIcon: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  symptomIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 4,
  },
  activeTabText: {
    color: '#1F2937',
  },
});