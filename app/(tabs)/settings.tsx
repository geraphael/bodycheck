import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ChevronRight, Bell, Shield, MapPin, User, CircleHelp as HelpCircle, CreditCard as Edit3, Save, History, Trash2 } from 'lucide-react-native';
import { getPersonalInfo, savePersonalInfo, clearAllData, PersonalInfo, AssessmentData } from '@/utils/storage';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ assessmentHistory: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<Partial<PersonalInfo>>({});
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const loadPersonalInfo = async () => {
    const info = await getPersonalInfo();
    setPersonalInfo(info);
    setEditedInfo(info);
  };

  const handleSavePersonalInfo = async () => {
    await savePersonalInfo(editedInfo);
    setPersonalInfo({ ...personalInfo, ...editedInfo });
    setIsEditing(false);
    Alert.alert('Success', 'Personal information saved successfully');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your personal information and assessment history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            setPersonalInfo({ assessmentHistory: [] });
            setEditedInfo({});
            Alert.alert('Success', 'All data has been cleared');
          }
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Health reminders and alerts',
      icon: Bell,
      type: 'toggle',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      id: 'location',
      title: 'Location Services',
      subtitle: 'Find nearby hospitals and clinics',
      icon: MapPin,
      type: 'toggle',
      value: locationEnabled,
      onToggle: setLocationEnabled,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Data handling and security settings',
      icon: Shield,
      type: 'navigation',
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs and contact information',
      icon: HelpCircle,
      type: 'navigation',
    },
  ];

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity key={item.id} style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <item.icon size={24} color="#2563EB" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          ) : (
            <ChevronRight size={20} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAssessmentHistory = () => {
    if (!showHistory) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assessment History</Text>
          <Text style={styles.historyCount}>
            {personalInfo.assessmentHistory.length} assessments
          </Text>
        </View>
        
        {personalInfo.assessmentHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyHistoryText}>No assessments yet</Text>
          </View>
        ) : (
          <ScrollView style={styles.historyList} nestedScrollEnabled>
            {personalInfo.assessmentHistory.slice(0, 10).map((assessment, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyZone}>
                    {assessment.zone.charAt(0).toUpperCase() + assessment.zone.slice(1)}
                  </Text>
                  <Text style={styles.historyDate}>
                    {formatDate(assessment.timestamp)}
                  </Text>
                </View>
                <Text style={styles.historyDetails}>
                  {assessment.gender} • {assessment.age} • {assessment.selectedSymptoms.length} symptoms
                </Text>
                <Text style={styles.historySymptoms}>
                  Symptoms: {assessment.selectedSymptoms.slice(0, 3).join(', ')}
                  {assessment.selectedSymptoms.length > 3 && ` +${assessment.selectedSymptoms.length - 3} more`}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your BodyCheck+ preferences</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => isEditing ? handleSavePersonalInfo() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save size={16} color="#2563EB" />
                  <Text style={styles.editButtonText}>Save</Text>
                </>
              ) : (
                <>
                  <Edit3 size={16} color="#2563EB" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.personalInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedInfo.name || ''}
                  onChangeText={(text) => setEditedInfo({ ...editedInfo, name: text })}
                  placeholder="Enter your full name"
                />
              ) : (
                <Text style={styles.infoValue}>{personalInfo.name || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedInfo.dateOfBirth || ''}
                  onChangeText={(text) => setEditedInfo({ ...editedInfo, dateOfBirth: text })}
                  placeholder="MM/DD/YYYY"
                />
              ) : (
                <Text style={styles.infoValue}>{personalInfo.dateOfBirth || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Type</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedInfo.bloodType || ''}
                  onChangeText={(text) => setEditedInfo({ ...editedInfo, bloodType: text })}
                  placeholder="e.g., A+, O-, AB+"
                />
              ) : (
                <Text style={styles.infoValue}>{personalInfo.bloodType || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Known Allergies</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedInfo.allergies?.join(', ') || ''}
                  onChangeText={(text) => setEditedInfo({ 
                    ...editedInfo, 
                    allergies: text.split(',').map(item => item.trim()).filter(item => item) 
                  })}
                  placeholder="e.g., Penicillin, Peanuts"
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>
                  {personalInfo.allergies?.join(', ') || 'None reported'}
                </Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Medications</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedInfo.medications?.join(', ') || ''}
                  onChangeText={(text) => setEditedInfo({ 
                    ...editedInfo, 
                    medications: text.split(',').map(item => item.trim()).filter(item => item) 
                  })}
                  placeholder="e.g., Aspirin, Lisinopril"
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>
                  {personalInfo.medications?.join(', ') || 'None reported'}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.historyToggle}
            onPress={() => setShowHistory(!showHistory)}
          >
            <History size={20} color="#2563EB" />
            <Text style={styles.historyToggleText}>Assessment History</Text>
            <ChevronRight 
              size={20} 
              color="#2563EB" 
              style={[styles.historyChevron, showHistory && styles.historyChevronRotated]} 
            />
          </TouchableOpacity>
          {renderAssessmentHistory()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          {settingsItems.map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
            <Trash2 size={20} color="#DC2626" />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>BodyCheck+</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              A comprehensive health assessment tool designed to help you understand your symptoms 
              and find appropriate medical care when needed.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalCard}>
            <Text style={styles.legalText}>
              <Text style={styles.legalTitle}>Medical Disclaimer: </Text>
              This app is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of qualified health providers with any questions about your medical condition.
            </Text>
            <Text style={styles.legalText}>
              <Text style={styles.legalTitle}>Privacy Policy: </Text>
              We are committed to protecting your privacy. Your health information is encrypted and 
              stored securely on your device only.
            </Text>
          </View>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  personalInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  infoInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  historyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyToggleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    flex: 1,
  },
  historyChevron: {
    transform: [{ rotate: '0deg' }],
  },
  historyChevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  historyCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  historyList: {
    maxHeight: 300,
    marginTop: 16,
  },
  emptyHistory: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyHistoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyZone: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  historyDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  historySymptoms: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingAction: {
    marginLeft: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  legalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legalText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  legalTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
});