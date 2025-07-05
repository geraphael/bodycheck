import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { User, Phone, Mail, Calendar, Droplets, Pill, Heart, CreditCard as Edit3, Save, X, Camera } from 'lucide-react-native';
import { savePersonalInfo, getPersonalInfo, PersonalInfo } from '@/utils/storage';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<PersonalInfo>({
    name: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    allergies: [],
    medications: [],
    medicalConditions: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    assessmentHistory: [],
  });

  const [editData, setEditData] = useState<PersonalInfo>(profileData);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const data = await getPersonalInfo();
    setProfileData(data);
    setEditData(data);
  };

  const handleSave = async () => {
    try {
      await savePersonalInfo(editData);
      setProfileData(editData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const addListItem = (field: 'allergies' | 'medications' | 'medicalConditions', value: string) => {
    if (value.trim()) {
      setEditData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const removeListItem = (field: 'allergies' | 'medications' | 'medicalConditions', index: number) => {
    setEditData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const ProfileField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    icon: Icon,
    multiline = false 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: any;
    multiline?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Icon size={16} color="#6B7280" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {isEditing ? (
        <TextInput
          style={[styles.fieldInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not specified'}</Text>
      )}
    </View>
  );

  const ListField = ({ 
    label, 
    items, 
    field, 
    icon: Icon 
  }: {
    label: string;
    items: string[];
    field: 'allergies' | 'medications' | 'medicalConditions';
    icon: any;
  }) => {
    const [newItem, setNewItem] = useState('');

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Icon size={16} color="#6B7280" />
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        
        {items.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>
            {isEditing && (
              <TouchableOpacity onPress={() => removeListItem(field, index)}>
                <X size={16} color="#DC2626" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {isEditing && (
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              value={newItem}
              onChangeText={setNewItem}
              placeholder={`Add ${label.toLowerCase()}`}
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={() => {
                addListItem(field, newItem);
                setNewItem('');
              }}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                addListItem(field, newItem);
                setNewItem('');
              }}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {items.length === 0 && !isEditing && (
          <Text style={styles.emptyText}>None specified</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <Save size={20} color="#059669" />
          ) : (
            <Edit3 size={20} color="#2563EB" />
          )}
        </TouchableOpacity>
      </View>

      {isEditing && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <X size={16} color="#DC2626" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <User size={40} color="#6B7280" />
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <ProfileField
            label="Full Name"
            value={editData.name || ''}
            onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
            placeholder="Enter your full name"
            icon={User}
          />

          <ProfileField
            label="Date of Birth"
            value={editData.dateOfBirth || ''}
            onChangeText={(text) => setEditData(prev => ({ ...prev, dateOfBirth: text }))}
            placeholder="MM/DD/YYYY"
            icon={Calendar}
          />

          <ProfileField
            label="Gender"
            value={editData.gender || ''}
            onChangeText={(text) => setEditData(prev => ({ ...prev, gender: text }))}
            placeholder="Male/Female/Other"
            icon={User}
          />

          <ProfileField
            label="Blood Type"
            value={editData.bloodType || ''}
            onChangeText={(text) => setEditData(prev => ({ ...prev, bloodType: text }))}
            placeholder="A+, B-, O+, etc."
            icon={Droplets}
          />
        </View>

        {/* Medical Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          
          <ListField
            label="Allergies"
            items={editData.allergies || []}
            field="allergies"
            icon={Heart}
          />

          <ListField
            label="Current Medications"
            items={editData.medications || []}
            field="medications"
            icon={Pill}
          />

          <ListField
            label="Medical Conditions"
            items={editData.medicalConditions || []}
            field="medicalConditions"
            icon={Heart}
          />
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <ProfileField
            label="Contact Name"
            value={editData.emergencyContact?.name || ''}
            onChangeText={(text) => setEditData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact!, name: text }
            }))}
            placeholder="Emergency contact name"
            icon={User}
          />

          <ProfileField
            label="Phone Number"
            value={editData.emergencyContact?.phone || ''}
            onChangeText={(text) => setEditData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact!, phone: text }
            }))}
            placeholder="Emergency contact phone"
            icon={Phone}
          />

          <ProfileField
            label="Relationship"
            value={editData.emergencyContact?.relationship || ''}
            onChangeText={(text) => setEditData(prev => ({
              ...prev,
              emergencyContact: { ...prev.emergencyContact!, relationship: text }
            }))}
            placeholder="Spouse, Parent, Sibling, etc."
            icon={Heart}
          />
        </View>

        {/* Assessment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment History</Text>
          {profileData.assessmentHistory.length > 0 ? (
            <Text style={styles.historyCount}>
              {profileData.assessmentHistory.length} assessments completed
            </Text>
          ) : (
            <Text style={styles.emptyText}>No assessments completed yet</Text>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  fieldInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    paddingVertical: 4,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  historyCount: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
});