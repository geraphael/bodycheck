import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Brain, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, MessageSquare } from 'lucide-react-native';
import { saveAssessmentData } from '@/utils/storage';
import AdaptiveInterviewEngine, { InterviewQuestion, InterviewContext, DiagnosticSuggestion } from '@/utils/adaptiveInterview';

export default function AdaptiveAssessmentScreen() {
  const { category, gender, age } = useLocalSearchParams<{ 
    category: string; 
    gender: string; 
    age: string; 
  }>();
  
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [context, setContext] = useState<InterviewContext>({
    responses: {},
    selectedSymptoms: [],
    currentSeverity: 0,
    suspectedConditions: [],
    riskFactors: [],
    demographics: {
      age: age || '',
      gender: gender || ''
    }
  });
  const [questionHistory, setQuestionHistory] = useState<InterviewQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openResponse, setOpenResponse] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  useEffect(() => {
    // Start with initial questions
    const initialQuestions = AdaptiveInterviewEngine.generateInitialQuestions();
    if (initialQuestions.length > 0) {
      setCurrentQuestion(initialQuestions[0]);
      setQuestionHistory([initialQuestions[0]]);
    }
  }, []);

  const handleResponse = (value: any) => {
    if (!currentQuestion) return;

    const updatedContext = AdaptiveInterviewEngine.updateContext(
      context,
      currentQuestion.id,
      value
    );
    setContext(updatedContext);

    // Get next question
    const nextQuestion = AdaptiveInterviewEngine.getNextQuestion(updatedContext);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuestionHistory(prev => [...prev, nextQuestion]);
    } else {
      // Interview complete, generate diagnosis
      completeAssessment(updatedContext);
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    const newSymptoms = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter(id => id !== symptomId)
      : [...selectedSymptoms, symptomId];
    
    setSelectedSymptoms(newSymptoms);
    
    const updatedContext = {
      ...context,
      selectedSymptoms: newSymptoms
    };
    setContext(updatedContext);
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    let responseValue;
    
    switch (currentQuestion.type) {
      case 'open':
        responseValue = openResponse;
        break;
      case 'symptoms':
        responseValue = selectedSymptoms;
        break;
      default:
        responseValue = context.responses[currentQuestion.id];
        break;
    }

    if (currentQuestion.required && !responseValue) {
      return; // Don't proceed if required field is empty
    }

    handleResponse(responseValue);
    setOpenResponse(''); // Reset for next question
  };

  const handlePrevious = () => {
    if (questionHistory.length > 1) {
      const newHistory = questionHistory.slice(0, -1);
      const previousQuestion = newHistory[newHistory.length - 1];
      
      setQuestionHistory(newHistory);
      setCurrentQuestion(previousQuestion);
      
      // Remove the last response from context
      const newResponses = { ...context.responses };
      delete newResponses[currentQuestion?.id || ''];
      
      setContext(prev => ({
        ...prev,
        responses: newResponses
      }));
    }
  };

  const completeAssessment = async (finalContext: InterviewContext) => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(async () => {
      const diagnoses = AdaptiveInterviewEngine.generateDiagnosis(finalContext);
      
      const assessmentData = {
        category,
        gender,
        age,
        responses: finalContext.responses,
        selectedSymptoms: finalContext.selectedSymptoms,
        suspectedConditions: finalContext.suspectedConditions,
        timestamp: new Date().toISOString(),
      };
      
      await saveAssessmentData(assessmentData);
      
      router.push({
        pathname: '/results',
        params: {
          category,
          gender,
          age,
          responses: JSON.stringify(finalContext.responses),
          symptoms: JSON.stringify(finalContext.selectedSymptoms),
          diseases: JSON.stringify(finalContext.suspectedConditions),
          aiDiagnosis: JSON.stringify(diagnoses[0]),
        },
      });
    }, 3000);
  };

  const canProceed = () => {
    if (!currentQuestion?.required) return true;
    
    switch (currentQuestion.type) {
      case 'open':
        return openResponse.trim().length > 0;
      case 'symptoms':
        return selectedSymptoms.length > 0;
      default:
        return context.responses[currentQuestion.id] !== undefined;
    }
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
          <Text style={styles.processingTitle}>Analyzing Your Responses</Text>
          <Text style={styles.processingSubtitle}>
            Our AI is processing your symptoms and generating personalized health insights
          </Text>
          
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.progressText}>
              Analyzing symptom patterns and generating recommendations...
            </Text>
          </View>
          
          <View style={styles.processingSteps}>
            <View style={styles.stepItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.stepText}>Reviewing your responses</Text>
            </View>
            <View style={styles.stepItem}>
              <CheckCircle size={16} color="#059669" />
              <Text style={styles.stepText}>Analyzing symptom patterns</Text>
            </View>
            <View style={styles.stepItem}>
              <ActivityIndicator size={16} color="#2563EB" />
              <Text style={styles.stepText}>Generating health insights</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, { backgroundColor: '#E5E7EB' }]} />
              <Text style={[styles.stepText, { color: '#9CA3AF' }]}>Preparing recommendations</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

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
          <Text style={styles.title}>Health Assessment</Text>
          <Text style={styles.subtitle}>
            {category?.charAt(0).toUpperCase() + category?.slice(1)} • {gender} • {age}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${Math.min(100, (questionHistory.length / 10) * 100)}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {questionHistory.length} • Adaptive Interview
        </Text>
      </View>

      {context.suspectedConditions.length > 0 && (
        <View style={styles.conditionsHint}>
          <Brain size={16} color="#2563EB" />
          <Text style={styles.conditionsHintText}>
            Considering: {context.suspectedConditions.slice(0, 2).join(', ')}
            {context.suspectedConditions.length > 2 && ` +${context.suspectedConditions.length - 2} more`}
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            {currentQuestion.type === 'open' && (
              <MessageSquare size={20} color="#2563EB" />
            )}
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          {currentQuestion.type === 'open' && (
            <View style={styles.openResponseContainer}>
              <TextInput
                style={styles.openResponseInput}
                value={openResponse}
                onChangeText={setOpenResponse}
                placeholder="Please describe your symptoms in your own words..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.inputHint}>
                Take your time to describe what you're experiencing
              </Text>
            </View>
          )}

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
                    context.responses[currentQuestion.id] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleResponse(option)}
                >
                  <Text style={[
                    styles.optionText,
                    context.responses[currentQuestion.id] === option && styles.optionTextSelected
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
                    context.responses[currentQuestion.id] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleResponse(option)}
                >
                  <Text style={[
                    styles.optionText,
                    context.responses[currentQuestion.id] === option && styles.optionTextSelected
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
                <Text style={styles.scaleLabel}>Not affecting me</Text>
                <Text style={styles.scaleLabel}>Severely affecting me</Text>
              </View>
              <View style={styles.scaleOptions}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                  <TouchableOpacity
                    key={number}
                    style={[
                      styles.scaleButton,
                      context.responses[currentQuestion.id] === number && styles.scaleButtonSelected
                    ]}
                    onPress={() => handleResponse(number)}
                  >
                    <Text style={[
                      styles.scaleButtonText,
                      context.responses[currentQuestion.id] === number && styles.scaleButtonTextSelected
                    ]}>
                      {number}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {currentQuestion.type === 'duration' && (
            <View style={styles.optionsContainer}>
              {[
                'Less than 1 hour ago',
                '1-6 hours ago',
                '6-24 hours ago',
                '1-3 days ago',
                '3-7 days ago',
                '1-2 weeks ago',
                'More than 2 weeks ago'
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    context.responses[currentQuestion.id] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleResponse(option)}
                >
                  <Text style={[
                    styles.optionText,
                    context.responses[currentQuestion.id] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, questionHistory.length <= 1 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={questionHistory.length <= 1}
        >
          <ChevronLeft size={20} color={questionHistory.length <= 1 ? '#9CA3AF' : '#2563EB'} />
          <Text style={[
            styles.navButtonText,
            questionHistory.length <= 1 && styles.navButtonTextDisabled
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
            Continue
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
    fontSize: 20,
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
  conditionsHint: {
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
  conditionsHintText: {
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
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    lineHeight: 26,
    flex: 1,
  },
  openResponseContainer: {
    gap: 12,
  },
  openResponseInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 120,
  },
  inputHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
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
  },
  symptomDescriptionSelected: {
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
});