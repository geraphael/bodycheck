import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Brain, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { saveAssessmentData } from '@/utils/storage';
import { getSymptomHierarchy, generateAIDiagnosis } from '@/utils/symptomEngine';

interface Symptom {
  id: string;
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  relatedDiseases: string[];
}

interface Question {
  id: string;
  text: string;
  type: 'binary' | 'multiple' | 'scale' | 'symptoms';
  options?: string[];
  symptoms?: Symptom[];
  required: boolean;
  followUpLogic?: (response: any, previousResponses: Record<string, any>) => string | null;
}

export default function AssessmentScreen() {
  const { category, gender, age } = useLocalSearchParams<{ 
    category: string; 
    gender: string; 
    age: string; 
  }>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [possibleDiseases, setPossibleDiseases] = useState<string[]>([]);

  useEffect(() => {
    const hierarchyQuestions = getSymptomHierarchy(category || '', gender || '', age || '');
    setQuestions(hierarchyQuestions);
  }, [category, gender, age]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleResponse = (value: any) => {
    const newResponses = {
      ...responses,
      [currentQuestion.id]: value,
    };
    setResponses(newResponses);

    // Update possible diseases based on current responses
    if (currentQuestion.type === 'symptoms' && Array.isArray(value)) {
      const diseases = new Set<string>();
      value.forEach((symptomId: string) => {
        const symptom = currentQuestion.symptoms?.find(s => s.id === symptomId);
        if (symptom) {
          symptom.relatedDiseases.forEach(disease => diseases.add(disease));
        }
      });
      setPossibleDiseases(Array.from(diseases));
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    const newSymptoms = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter(id => id !== symptomId)
      : [...selectedSymptoms, symptomId];
    
    setSelectedSymptoms(newSymptoms);
    handleResponse(newSymptoms);
  };

  const getNextQuestion = () => {
    if (currentQuestion.followUpLogic) {
      const nextQuestionId = currentQuestion.followUpLogic(
        responses[currentQuestion.id], 
        responses
      );
      if (nextQuestionId) {
        const nextIndex = questions.findIndex(q => q.id === nextQuestionId);
        return nextIndex !== -1 ? nextIndex : currentQuestionIndex + 1;
      }
    }
    return currentQuestionIndex + 1;
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setIsProcessing(true);
      
      // Simulate AI processing time (40 seconds)
      setTimeout(async () => {
        const assessmentData = {
          category,
          gender,
          age,
          responses,
          selectedSymptoms,
          possibleDiseases,
          timestamp: new Date().toISOString(),
        };
        
        await saveAssessmentData(assessmentData);
        
        // Generate AI diagnosis
        const aiDiagnosis = await generateAIDiagnosis(assessmentData);
        
        router.push({
          pathname: '/results',
          params: {
            category,
            gender,
            age,
            responses: JSON.stringify(responses),
            symptoms: JSON.stringify(selectedSymptoms),
            diseases: JSON.stringify(possibleDiseases),
            aiDiagnosis: JSON.stringify(aiDiagnosis),
          },
        });
      }, 40000); // 40 seconds
    } else {
      const nextIndex = getNextQuestion();
      setCurrentQuestionIndex(nextIndex);
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

  if (isProcessing) {
    return (
      <View style={styles.processingContainer}>
        <View style={styles.processingCard}>
          <Brain size={48} color="#2563EB" />
          <Text style={styles.processingTitle}>Analyzing Your Health Information</Text>
          <Text style={styles.processingSubtitle}>
            Our smart system is looking at your symptoms and creating a personalized health report
          </Text>
          
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.progressText}>
              Reviewing your answers and creating your health insights...
            </Text>
          </View>
          
          <View style={styles.processingSteps}>
            <View style={styles.stepItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.stepText}>Looking at your symptoms</Text>
            </View>
            <View style={styles.stepItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.stepText}>Checking medical information</Text>
            </View>
            <View style={styles.stepItem}>
              <ActivityIndicator size={16} color="#2563EB" />
              <Text style={styles.stepText}>Creating your health report</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, { backgroundColor: '#E5E7EB' }]} />
              <Text style={[styles.stepText, { color: '#9CA3AF' }]}>Preparing recommendations</Text>
            </View>
          </View>
          
          <Text style={styles.timeEstimate}>
            This usually takes about 40 seconds
          </Text>
        </View>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>Loading your health assessment...</Text>
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
          <Text style={styles.title}>Health Assessment</Text>
          <Text style={styles.subtitle}>
            {category?.charAt(0).toUpperCase() + category?.slice(1)} <Text>•</Text> {gender} <Text>•</Text> {age}
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
          {currentQuestionIndex + 1} of {questions.length} questions
        </Text>
      </View>

      {possibleDiseases.length > 0 && (
        <View style={styles.diseasesHint}>
          <Brain size={16} color="#2563EB" />
          <Text style={styles.diseasesHintText}>
            We're considering: {possibleDiseases.slice(0, 3).join(', ')}
            {possibleDiseases.length > 3 && ` +${possibleDiseases.length - 3} more`}
          </Text>
        </View>
      )}

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
                    styles.symptomDescription,
                    selectedSymptoms.includes(symptom.id) && styles.symptomDescriptionSelected
                  ]}>
                    {symptom.description}
                  </Text>
                  {symptom.relatedDiseases.length > 0 && (
                    <Text style={styles.relatedDiseases}>
                      May be related to: {symptom.relatedDiseases.slice(0, 2).join(', ')}
                    </Text>
                  )}
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
                <Text style={styles.scaleLabel}>Very uncomfortable</Text>
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
            {isLastQuestion ? 'Get My Health Report' : 'Next'}
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
  diseasesHint: {
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
  diseasesHintText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    flex: 1,
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
  symptomDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  symptomDescriptionSelected: {
    color: '#2563EB',
  },
  relatedDiseases: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7C3AED',
    fontStyle: 'italic',
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
  processingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    maxWidth: 400,
    width: '100%',
  },
  processingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  processingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginTop: 16,
    textAlign: 'center',
  },
  processingSteps: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  timeEstimate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});