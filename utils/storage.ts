import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AssessmentData {
  category?: string;
  zone?: string;
  gender: string;
  age: string;
  responses: Record<string, any>;
  selectedSymptoms: string[];
  possibleDiseases?: string[];
  timestamp: string;
}

export interface PersonalInfo {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  medicalConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  assessmentHistory: AssessmentData[];
}

const STORAGE_KEYS = {
  PERSONAL_INFO: 'bodycheck_personal_info',
  ASSESSMENT_HISTORY: 'bodycheck_assessment_history',
};

export const saveAssessmentData = async (assessmentData: AssessmentData): Promise<void> => {
  try {
    // Get existing personal info
    const existingInfo = await getPersonalInfo();
    
    // Add new assessment to history
    const updatedInfo: PersonalInfo = {
      ...existingInfo,
      assessmentHistory: [assessmentData, ...existingInfo.assessmentHistory],
    };
    
    // Keep only last 50 assessments
    if (updatedInfo.assessmentHistory.length > 50) {
      updatedInfo.assessmentHistory = updatedInfo.assessmentHistory.slice(0, 50);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(updatedInfo));
  } catch (error) {
    console.error('Error saving assessment data:', error);
  }
};

export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PERSONAL_INFO);
    if (data) {
      return JSON.parse(data);
    }
    return { assessmentHistory: [] };
  } catch (error) {
    console.error('Error getting personal info:', error);
    return { assessmentHistory: [] };
  }
};

export const savePersonalInfo = async (personalInfo: Partial<PersonalInfo>): Promise<void> => {
  try {
    const existingInfo = await getPersonalInfo();
    const updatedInfo = { ...existingInfo, ...personalInfo };
    await AsyncStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(updatedInfo));
  } catch (error) {
    console.error('Error saving personal info:', error);
  }
};

export const getAssessmentHistory = async (): Promise<AssessmentData[]> => {
  try {
    const personalInfo = await getPersonalInfo();
    return personalInfo.assessmentHistory || [];
  } catch (error) {
    console.error('Error getting assessment history:', error);
    return [];
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PERSONAL_INFO);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};