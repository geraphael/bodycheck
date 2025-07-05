import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { saveAssessmentData } from '@/utils/storage';

interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Question {
  id: string;
  text: string;
  type: 'binary' | 'multiple' | 'scale' | 'symptoms';
  options?: string[];
  symptoms?: Symptom[];
  required: boolean;
}

export default function AssessmentScreen() {
  const { zone, gender, age } = useLocalSearchParams<{ 
    zone: string; 
    gender: string; 
    age: string; 
  }>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  useEffect(() => {
    const assessmentQuestions = getQuestionsForZone(zone || '');
    setQuestions(assessmentQuestions);
  }, [zone]);

  const getQuestionsForZone = (bodyZone: string): Question[] => {
    const commonQuestions: Question[] = [
      {
        id: 'symptoms_selection',
        text: 'Select all symptoms you are currently experiencing:',
        type: 'symptoms',
        symptoms: getSymptomsForZone(bodyZone),
        required: true,
      },
      {
        id: 'duration',
        text: 'How long have you been experiencing these symptoms?',
        type: 'multiple',
        options: [
          'Less than 1 hour',
          '1-6 hours', 
          '6-24 hours',
          '1-3 days',
          '3-7 days',
          'More than 1 week',
          'More than 1 month'
        ],
        required: true,
      },
      {
        id: 'severity',
        text: 'On a scale of 1-10, how would you rate your overall discomfort?',
        type: 'scale',
        required: true,
      },
      {
        id: 'sudden_onset',
        text: 'Did these symptoms come on suddenly?',
        type: 'binary',
        required: true,
      },
      {
        id: 'triggers',
        text: 'What seems to trigger or worsen your symptoms?',
        type: 'multiple',
        options: [
          'Physical activity',
          'Stress or anxiety',
          'Certain foods',
          'Weather changes',
          'Lack of sleep',
          'Specific positions/movements',
          'Nothing specific',
          'Not sure'
        ],
        required: false,
      },
      {
        id: 'relief_factors',
        text: 'What helps relieve your symptoms?',
        type: 'multiple',
        options: [
          'Rest',
          'Pain medication',
          'Heat application',
          'Cold application',
          'Gentle movement',
          'Specific positions',
          'Nothing helps',
          'Not sure'
        ],
        required: false,
      },
    ];

    const zoneSpecificQuestions: Record<string, Question[]> = {
      head: [
        {
          id: 'headache_location',
          text: 'Where exactly is your headache located?',
          type: 'multiple',
          options: [
            'Forehead',
            'Temples',
            'Back of head',
            'Top of head',
            'Behind eyes',
            'One side only',
            'All over'
          ],
          required: true,
        },
        {
          id: 'associated_symptoms',
          text: 'Are you experiencing any of these additional symptoms?',
          type: 'multiple',
          options: [
            'Nausea or vomiting',
            'Sensitivity to light',
            'Sensitivity to sound',
            'Vision changes',
            'Dizziness',
            'Neck stiffness',
            'Fever'
          ],
          required: false,
        },
      ],
      chest: [
        {
          id: 'chest_pain_quality',
          text: 'How would you describe your chest discomfort?',
          type: 'multiple',
          options: [
            'Sharp/stabbing',
            'Crushing/squeezing',
            'Burning',
            'Dull ache',
            'Pressure/heaviness',
            'Tightness'
          ],
          required: true,
        },
        {
          id: 'radiation',
          text: 'Does the pain spread to other areas?',
          type: 'multiple',
          options: [
            'Left arm',
            'Right arm',
            'Both arms',
            'Jaw',
            'Neck',
            'Back',
            'Stomach',
            'No radiation'
          ],
          required: true,
        },
      ],
      abdomen: [
        {
          id: 'pain_location',
          text: 'Where exactly is your abdominal pain?',
          type: 'multiple',
          options: [
            'Upper right (under ribs)',
            'Upper left (under ribs)',
            'Upper center (stomach area)',
            'Lower right',
            'Lower left',
            'Lower center',
            'Around navel',
            'All over abdomen'
          ],
          required: true,
        },
        {
          id: 'digestive_symptoms',
          text: 'Are you experiencing any digestive symptoms?',
          type: 'multiple',
          options: [
            'Nausea',
            'Vomiting',
            'Diarrhea',
            'Constipation',
            'Loss of appetite',
            'Bloating',
            'Gas',
            'None of these'
          ],
          required: false,
        },
      ],
    };

    return [...commonQuestions, ...(zoneSpecificQuestions[bodyZone] || [])];
  };

  const getSymptomsForZone = (bodyZone: string): Symptom[] => {
    const symptomsByZone: Record<string, Symptom[]> = {
      head: [
        { id: 'headache', name: 'Headache', category: 'pain', severity: 'moderate' },
        { id: 'dizziness', name: 'Dizziness', category: 'neurological', severity: 'mild' },
        { id: 'vision_blur', name: 'Blurred vision', category: 'visual', severity: 'moderate' },
        { id: 'nausea', name: 'Nausea', category: 'digestive', severity: 'mild' },
        { id: 'light_sensitivity', name: 'Light sensitivity', category: 'neurological', severity: 'mild' },
        { id: 'neck_stiffness', name: 'Neck stiffness', category: 'musculoskeletal', severity: 'moderate' },
        { id: 'confusion', name: 'Confusion', category: 'neurological', severity: 'severe' },
        { id: 'memory_issues', name: 'Memory problems', category: 'neurological', severity: 'moderate' },
      ],
      chest: [
        { id: 'chest_pain', name: 'Chest pain', category: 'pain', severity: 'severe' },
        { id: 'shortness_breath', name: 'Shortness of breath', category: 'respiratory', severity: 'severe' },
        { id: 'heart_palpitations', name: 'Heart palpitations', category: 'cardiac', severity: 'moderate' },
        { id: 'sweating', name: 'Excessive sweating', category: 'general', severity: 'moderate' },
        { id: 'arm_pain', name: 'Arm pain', category: 'pain', severity: 'moderate' },
        { id: 'jaw_pain', name: 'Jaw pain', category: 'pain', severity: 'moderate' },
        { id: 'cough', name: 'Cough', category: 'respiratory', severity: 'mild' },
        { id: 'fatigue', name: 'Unusual fatigue', category: 'general', severity: 'mild' },
      ],
      abdomen: [
        { id: 'abdominal_pain', name: 'Abdominal pain', category: 'pain', severity: 'moderate' },
        { id: 'nausea_vomiting', name: 'Nausea/Vomiting', category: 'digestive', severity: 'moderate' },
        { id: 'diarrhea', name: 'Diarrhea', category: 'digestive', severity: 'mild' },
        { id: 'constipation', name: 'Constipation', category: 'digestive', severity: 'mild' },
        { id: 'bloating', name: 'Bloating', category: 'digestive', severity: 'mild' },
        { id: 'loss_appetite', name: 'Loss of appetite', category: 'digestive', severity: 'mild' },
        { id: 'fever', name: 'Fever', category: 'general', severity: 'moderate' },
        { id: 'blood_stool', name: 'Blood in stool', category: 'digestive', severity: 'severe' },
      ],
    };

    return symptomsByZone[bodyZone] || [];
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleSymptomToggle = (symptomId: string) => {
    const newSymptoms = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter(id => id !== symptomId)
      : [...selectedSymptoms, symptomId];
    
    setSelectedSymptoms(newSymptoms);
    handleResponse(newSymptoms);
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Save assessment data
      const assessmentData = {
        zone,
        gender,
        age,
        responses,
        selectedSymptoms,
        timestamp: new Date().toISOString(),
      };
      
      await saveAssessmentData(assessmentData);
      
      // Navigate to results
      router.push({
        pathname: '/results',
        params: {
          zone,
          gender,
          age,
          responses: JSON.stringify(responses),
          symptoms: JSON.stringify(selectedSymptoms),
        },
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const canProceed = () => {
    if (!currentQuestion?.required) return true;
    
    if (currentQuestion.type === 'symptoms') {
      return selectedSymptoms.length > 0;
    }
    
    return responses[currentQuestion.id] !== undefined;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return '#DC2626';
      case 'moderate': return '#F59E0B';
      case 'mild': return '#059669';
      default: return '#6B7280';
    }
  };

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>Loading assessment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Symptom Assessment</Text>
          <Text style={styles.subtitle}>
            {zone?.charAt(0).toUpperCase() + zone?.slice(1)} • {gender} • {age}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          {currentQuestion.type === 'symptoms' && (
            <View style={styles.symptomsContainer}>
              {currentQuestion.symptoms?.map((symptom) => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.symptomCard,
                    selectedSymptoms.includes(symptom.id) && styles.symptomCardSelected
                  ]}
                  onPress={() => handleSymptomToggle(symptom.id)}
                >
                  <View style={styles.symptomHeader}>
                    <Text style={[
                      styles.symptomName,
                      selectedSymptoms.includes(symptom.id) && styles.symptomNameSelected
                    ]}>
                      {symptom.name}
                    </Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(symptom.severity) }
                    ]}>
                      <Text style={styles.severityText}>
                        {symptom.severity}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.symptomCategory,
                    selectedSymptoms.includes(symptom.id) && styles.symptomCategorySelected
                  ]}>
                    {symptom.category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQuestion.type === 'binary' && (
            <View style={styles.optionsContainer}>
              {['Yes', 'No'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    responses[currentQuestion.id] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleResponse(option)}
                >
                  <Text style={[
                    styles.optionText,
                    responses[currentQuestion.id] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQuestion.type === 'multiple' && (
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    responses[currentQuestion.id] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleResponse(option)}
                >
                  <Text style={[
                    styles.optionText,
                    responses[currentQuestion.id] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQuestion.type === 'scale' && (
            <View style={styles.scaleContainer}>
              <View style={styles.scaleLabels}>
                <Text style={styles.scaleLabel}>No discomfort</Text>
                <Text style={styles.scaleLabel}>Severe discomfort</Text>
              </View>
              <View style={styles.scaleOptions}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={[
                      styles.scaleButton,
                      responses[currentQuestion.id] === number && styles.scaleButtonSelected
                    ]}
                    onPress={() => handleResponse(number)}
                  >
                    <Text style={[
                      styles.scaleButtonText,
                      responses[currentQuestion.id] === number && styles.scaleButtonTextSelected
                    ]}>
                      {number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft size={20} color={currentQuestionIndex === 0 ? '#9CA3AF' : '#2563EB'} />
          <Text style={[
            styles.navButtonText,
            currentQuestionIndex === 0 && styles.navButtonTextDisabled
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, !canProceed() && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[
            styles.navButtonText,
            styles.nextButtonText,
            !canProceed() && styles.navButtonTextDisabled
          ]}>
            {isLastQuestion ? 'Get Diagnosis' : 'Next'}
          </Text>
          <ChevronRight size={20} color={canProceed() ? '#FFFFFF' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 28,
  },
  symptomsContainer: {
    gap: 12,
  },
  symptomCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  symptomCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
  },
  symptomNameSelected: {
    color: '#2563EB',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  symptomCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  symptomCategorySelected: {
    color: '#2563EB',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  optionButtonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#2563EB',
  },
  scaleContainer: {
    gap: 16,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  scaleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  scaleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  scaleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  scaleButtonTextSelected: {
    color: '#FFFFFF',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  nextButton: {
    backgroundColor: '#2563EB',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButtonText: {
    color: '#FFFFFF',
  },
});