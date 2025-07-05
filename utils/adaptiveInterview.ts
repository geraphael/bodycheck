import { AssessmentData } from './storage';

export interface InterviewQuestion {
  id: string;
  text: string;
  type: 'open' | 'scale' | 'multiple' | 'binary' | 'symptoms' | 'duration';
  options?: string[];
  symptoms?: Symptom[];
  required: boolean;
  followUpLogic?: (response: any, context: InterviewContext) => string | null;
  severity?: 'low' | 'medium' | 'high';
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  relatedConditions: string[];
  bodySystem: string;
}

export interface InterviewContext {
  responses: Record<string, any>;
  selectedSymptoms: string[];
  currentSeverity: number;
  suspectedConditions: string[];
  riskFactors: string[];
  demographics: {
    age: string;
    gender: string;
  };
}

export interface DiagnosticSuggestion {
  condition: string;
  probability: number;
  severity: 'emergency' | 'urgent' | 'moderate' | 'mild';
  reasoning: string;
  recommendations: string[];
  whenToSeekCare: string;
}

class AdaptiveInterviewEngine {
  private static instance: AdaptiveInterviewEngine;
  private questionDatabase: Record<string, InterviewQuestion[]> = {};
  private symptomDatabase: Record<string, Symptom[]> = {};

  static getInstance(): AdaptiveInterviewEngine {
    if (!AdaptiveInterviewEngine.instance) {
      AdaptiveInterviewEngine.instance = new AdaptiveInterviewEngine();
    }
    return AdaptiveInterviewEngine.instance;
  }

  constructor() {
    this.initializeQuestionDatabase();
    this.initializeSymptomDatabase();
  }

  private initializeQuestionDatabase() {
    this.questionDatabase = {
      initial: [
        {
          id: 'chief_complaint',
          text: 'In your own words, what is bothering you most right now?',
          type: 'open',
          required: true,
        },
        {
          id: 'symptom_onset',
          text: 'When did you first notice these symptoms?',
          type: 'duration',
          required: true,
        },
        {
          id: 'severity_overall',
          text: 'On a scale of 1-10, how much is this affecting your daily life?',
          type: 'scale',
          required: true,
        },
        {
          id: 'sudden_gradual',
          text: 'Did your symptoms come on suddenly or gradually?',
          type: 'multiple',
          options: ['Very suddenly (within minutes)', 'Gradually over hours', 'Gradually over days', 'Gradually over weeks'],
          required: true,
          followUpLogic: (response, context) => {
            if (response === 'Very suddenly (within minutes)') {
              return 'emergency_symptoms';
            }
            return 'symptom_category';
          }
        }
      ],
      emergency_symptoms: [
        {
          id: 'emergency_check',
          text: 'Are you experiencing any of these emergency symptoms right now?',
          type: 'symptoms',
          symptoms: [
            {
              id: 'chest_pain_severe',
              name: 'Severe chest pain or pressure',
              description: 'Crushing, squeezing, or heavy pressure in your chest',
              severity: 'severe',
              relatedConditions: ['Heart Attack', 'Unstable Angina'],
              bodySystem: 'cardiovascular'
            },
            {
              id: 'breathing_difficulty',
              name: 'Severe difficulty breathing',
              description: 'Cannot catch your breath or speak in full sentences',
              severity: 'severe',
              relatedConditions: ['Pulmonary Embolism', 'Severe Asthma', 'Heart Failure'],
              bodySystem: 'respiratory'
            },
            {
              id: 'consciousness_loss',
              name: 'Loss of consciousness or fainting',
              description: 'Passed out or nearly passed out',
              severity: 'severe',
              relatedConditions: ['Cardiac Arrhythmia', 'Stroke', 'Severe Dehydration'],
              bodySystem: 'neurological'
            }
          ],
          required: true,
          severity: 'high'
        }
      ],
      cardiovascular: [
        {
          id: 'chest_pain_quality',
          text: 'How would you describe your chest discomfort?',
          type: 'multiple',
          options: [
            'Crushing or squeezing pressure',
            'Sharp, stabbing pain',
            'Burning sensation',
            'Dull, aching pain',
            'Tightness or heaviness'
          ],
          required: true,
          followUpLogic: (response, context) => {
            if (response === 'Crushing or squeezing pressure') {
              return 'heart_attack_symptoms';
            }
            return 'chest_pain_triggers';
          }
        },
        {
          id: 'heart_attack_symptoms',
          text: 'Are you also experiencing any of these symptoms?',
          type: 'symptoms',
          symptoms: [
            {
              id: 'arm_pain',
              name: 'Pain in arm, jaw, or back',
              description: 'Pain spreading to your left arm, jaw, neck, or back',
              severity: 'moderate',
              relatedConditions: ['Heart Attack'],
              bodySystem: 'cardiovascular'
            },
            {
              id: 'sweating',
              name: 'Cold sweats',
              description: 'Breaking out in a cold sweat',
              severity: 'moderate',
              relatedConditions: ['Heart Attack'],
              bodySystem: 'cardiovascular'
            },
            {
              id: 'nausea_cardiac',
              name: 'Nausea or lightheadedness',
              description: 'Feeling sick to your stomach or dizzy',
              severity: 'moderate',
              relatedConditions: ['Heart Attack'],
              bodySystem: 'cardiovascular'
            }
          ],
          required: false,
          severity: 'high'
        }
      ],
      neurological: [
        {
          id: 'headache_characteristics',
          text: 'How would you describe your headache?',
          type: 'multiple',
          options: [
            'Worst headache of my life',
            'Throbbing on one side',
            'Dull ache all over',
            'Sharp, stabbing pain',
            'Pressure or tightness'
          ],
          required: true,
          followUpLogic: (response, context) => {
            if (response === 'Worst headache of my life') {
              return 'severe_headache_symptoms';
            }
            return 'headache_triggers';
          }
        },
        {
          id: 'severe_headache_symptoms',
          text: 'Are you experiencing any of these additional symptoms?',
          type: 'symptoms',
          symptoms: [
            {
              id: 'neck_stiffness',
              name: 'Neck stiffness',
              description: 'Difficulty moving your neck or touching chin to chest',
              severity: 'severe',
              relatedConditions: ['Meningitis', 'Subarachnoid Hemorrhage'],
              bodySystem: 'neurological'
            },
            {
              id: 'vision_changes',
              name: 'Vision changes',
              description: 'Blurred vision, double vision, or vision loss',
              severity: 'severe',
              relatedConditions: ['Stroke', 'Increased Intracranial Pressure'],
              bodySystem: 'neurological'
            },
            {
              id: 'confusion',
              name: 'Confusion or altered mental state',
              description: 'Difficulty thinking clearly or remembering',
              severity: 'severe',
              relatedConditions: ['Stroke', 'Meningitis'],
              bodySystem: 'neurological'
            }
          ],
          required: false,
          severity: 'high'
        }
      ]
    };
  }

  private initializeSymptomDatabase() {
    this.symptomDatabase = {
      cardiovascular: [
        {
          id: 'chest_pain',
          name: 'Chest Pain',
          description: 'Pain or discomfort in the chest area',
          severity: 'moderate',
          relatedConditions: ['Heart Attack', 'Angina', 'Costochondritis'],
          bodySystem: 'cardiovascular'
        },
        {
          id: 'palpitations',
          name: 'Heart Palpitations',
          description: 'Feeling of rapid, fluttering, or pounding heartbeat',
          severity: 'mild',
          relatedConditions: ['Atrial Fibrillation', 'Anxiety', 'Hyperthyroidism'],
          bodySystem: 'cardiovascular'
        }
      ],
      neurological: [
        {
          id: 'headache',
          name: 'Headache',
          description: 'Pain in the head or neck area',
          severity: 'mild',
          relatedConditions: ['Tension Headache', 'Migraine', 'Cluster Headache'],
          bodySystem: 'neurological'
        },
        {
          id: 'dizziness',
          name: 'Dizziness',
          description: 'Feeling lightheaded or unsteady',
          severity: 'mild',
          relatedConditions: ['Vertigo', 'Low Blood Pressure', 'Dehydration'],
          bodySystem: 'neurological'
        }
      ]
    };
  }

  generateInitialQuestions(): InterviewQuestion[] {
    return this.questionDatabase.initial;
  }

  getNextQuestion(context: InterviewContext): InterviewQuestion | null {
    const { responses, selectedSymptoms, suspectedConditions } = context;
    
    // Check if we have enough information for diagnosis
    if (this.hasEnoughInformation(context)) {
      return null;
    }

    // Determine next question based on current context
    const lastQuestionId = Object.keys(responses).pop();
    const lastQuestion = this.findQuestionById(lastQuestionId || '');
    
    if (lastQuestion?.followUpLogic) {
      const nextQuestionId = lastQuestion.followUpLogic(
        responses[lastQuestionId!], 
        context
      );
      
      if (nextQuestionId) {
        const nextQuestion = this.findQuestionById(nextQuestionId);
        if (nextQuestion) return nextQuestion;
      }
    }

    // Generate adaptive questions based on suspected conditions
    return this.generateAdaptiveQuestion(context);
  }

  private findQuestionById(questionId: string): InterviewQuestion | null {
    for (const category of Object.values(this.questionDatabase)) {
      const question = category.find(q => q.id === questionId);
      if (question) return question;
    }
    return null;
  }

  private hasEnoughInformation(context: InterviewContext): boolean {
    const { responses, selectedSymptoms } = context;
    
    // Minimum criteria for diagnosis
    return (
      Object.keys(responses).length >= 5 && // At least 5 questions answered
      selectedSymptoms.length > 0 && // At least one symptom selected
      responses.severity_overall !== undefined && // Severity assessed
      responses.symptom_onset !== undefined // Onset timing known
    );
  }

  private generateAdaptiveQuestion(context: InterviewContext): InterviewQuestion | null {
    const { suspectedConditions, selectedSymptoms } = context;
    
    // Generate questions to differentiate between suspected conditions
    if (suspectedConditions.length > 1) {
      return this.generateDifferentialQuestion(suspectedConditions, context);
    }
    
    // Generate questions to explore symptom details
    if (selectedSymptoms.length > 0) {
      return this.generateSymptomDetailQuestion(selectedSymptoms, context);
    }
    
    return null;
  }

  private generateDifferentialQuestion(
    conditions: string[], 
    context: InterviewContext
  ): InterviewQuestion {
    // Create a question to help differentiate between conditions
    return {
      id: `differential_${Date.now()}`,
      text: 'Which of these additional symptoms are you experiencing?',
      type: 'symptoms',
      symptoms: this.getDiscriminatingSymptoms(conditions),
      required: false
    };
  }

  private generateSymptomDetailQuestion(
    symptoms: string[], 
    context: InterviewContext
  ): InterviewQuestion {
    const symptom = symptoms[0]; // Focus on first symptom for now
    
    return {
      id: `detail_${symptom}_${Date.now()}`,
      text: `Tell me more about your ${symptom}. What makes it better or worse?`,
      type: 'multiple',
      options: [
        'Gets worse with activity',
        'Gets better with rest',
        'Worse in the morning',
        'Worse at night',
        'Triggered by stress',
        'No clear pattern'
      ],
      required: false
    };
  }

  private getDiscriminatingSymptoms(conditions: string[]): Symptom[] {
    // Return symptoms that help differentiate between the given conditions
    // This would be more sophisticated in a real implementation
    return [
      {
        id: 'fever',
        name: 'Fever',
        description: 'Body temperature above normal',
        severity: 'mild',
        relatedConditions: ['Infection', 'Inflammatory Condition'],
        bodySystem: 'general'
      },
      {
        id: 'fatigue',
        name: 'Unusual fatigue',
        description: 'Feeling more tired than usual',
        severity: 'mild',
        relatedConditions: ['Viral Infection', 'Anemia', 'Depression'],
        bodySystem: 'general'
      }
    ];
  }

  updateContext(
    context: InterviewContext, 
    questionId: string, 
    response: any
  ): InterviewContext {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        [questionId]: response
      }
    };

    // Update suspected conditions based on new response
    updatedContext.suspectedConditions = this.updateSuspectedConditions(
      updatedContext
    );

    // Update severity assessment
    if (questionId === 'severity_overall') {
      updatedContext.currentSeverity = response;
    }

    return updatedContext;
  }

  private updateSuspectedConditions(context: InterviewContext): string[] {
    const { responses, selectedSymptoms } = context;
    const conditions = new Set<string>();

    // Add conditions based on selected symptoms
    selectedSymptoms.forEach(symptomId => {
      const symptom = this.findSymptomById(symptomId);
      if (symptom) {
        symptom.relatedConditions.forEach(condition => 
          conditions.add(condition)
        );
      }
    });

    // Add conditions based on specific response patterns
    if (responses.sudden_gradual === 'Very suddenly (within minutes)') {
      conditions.add('Acute Emergency');
    }

    if (responses.chest_pain_quality === 'Crushing or squeezing pressure') {
      conditions.add('Heart Attack');
      conditions.add('Unstable Angina');
    }

    return Array.from(conditions);
  }

  private findSymptomById(symptomId: string): Symptom | null {
    for (const category of Object.values(this.symptomDatabase)) {
      const symptom = category.find(s => s.id === symptomId);
      if (symptom) return symptom;
    }
    return null;
  }

  generateDiagnosis(context: InterviewContext): DiagnosticSuggestion[] {
    const { responses, selectedSymptoms, suspectedConditions, currentSeverity } = context;
    
    // Emergency conditions
    if (this.hasEmergencyIndicators(context)) {
      return this.generateEmergencyDiagnosis(context);
    }

    // Generate primary diagnosis based on symptom patterns
    const primaryDiagnosis = this.determinePrimaryDiagnosis(context);
    const alternatives = this.generateAlternativeDiagnoses(context, primaryDiagnosis);

    return [primaryDiagnosis, ...alternatives];
  }

  private hasEmergencyIndicators(context: InterviewContext): boolean {
    const { responses, selectedSymptoms } = context;
    
    const emergencySymptoms = [
      'chest_pain_severe',
      'breathing_difficulty',
      'consciousness_loss',
      'severe_headache'
    ];

    return (
      selectedSymptoms.some(symptom => emergencySymptoms.includes(symptom)) ||
      responses.severity_overall >= 8 ||
      responses.sudden_gradual === 'Very suddenly (within minutes)'
    );
  }

  private generateEmergencyDiagnosis(context: InterviewContext): DiagnosticSuggestion[] {
    return [{
      condition: 'Medical Emergency - Immediate Care Required',
      probability: 90,
      severity: 'emergency',
      reasoning: 'Your symptoms indicate a potentially serious medical condition that requires immediate evaluation.',
      recommendations: [
        'Call 911 immediately',
        'Do not drive yourself to the hospital',
        'Stay calm and follow emergency operator instructions',
        'Have someone stay with you if possible'
      ],
      whenToSeekCare: 'RIGHT NOW - This is a medical emergency'
    }];
  }

  private determinePrimaryDiagnosis(context: InterviewContext): DiagnosticSuggestion {
    const { suspectedConditions, currentSeverity } = context;
    
    if (suspectedConditions.length === 0) {
      return {
        condition: 'General Symptoms - Further Evaluation Needed',
        probability: 60,
        severity: 'moderate',
        reasoning: 'Your symptoms require further medical evaluation for proper diagnosis.',
        recommendations: [
          'Schedule appointment with primary care physician',
          'Monitor symptoms for changes',
          'Keep a symptom diary',
          'Stay hydrated and get adequate rest'
        ],
        whenToSeekCare: 'Within 1-2 days if symptoms persist'
      };
    }

    const primaryCondition = suspectedConditions[0];
    const severity = this.determineSeverity(context);
    
    return {
      condition: primaryCondition,
      probability: this.calculateProbability(primaryCondition, context),
      severity,
      reasoning: this.generateReasoning(primaryCondition, context),
      recommendations: this.generateRecommendations(primaryCondition, severity),
      whenToSeekCare: this.generateCareTimeline(severity)
    };
  }

  private generateAlternativeDiagnoses(
    context: InterviewContext, 
    primary: DiagnosticSuggestion
  ): DiagnosticSuggestion[] {
    const { suspectedConditions } = context;
    
    return suspectedConditions
      .filter(condition => condition !== primary.condition)
      .slice(0, 3)
      .map((condition, index) => ({
        condition,
        probability: Math.max(20, primary.probability - (index + 1) * 15),
        severity: this.determineSeverity(context),
        reasoning: `Alternative consideration based on symptom pattern`,
        recommendations: this.generateRecommendations(condition, 'moderate'),
        whenToSeekCare: this.generateCareTimeline('moderate')
      }));
  }

  private determineSeverity(context: InterviewContext): 'emergency' | 'urgent' | 'moderate' | 'mild' {
    const { currentSeverity, responses } = context;
    
    if (currentSeverity >= 8 || this.hasEmergencyIndicators(context)) {
      return 'emergency';
    } else if (currentSeverity >= 6) {
      return 'urgent';
    } else if (currentSeverity >= 4) {
      return 'moderate';
    } else {
      return 'mild';
    }
  }

  private calculateProbability(condition: string, context: InterviewContext): number {
    // Simplified probability calculation
    // In a real system, this would use machine learning models
    const baseProb = 70;
    const { selectedSymptoms, currentSeverity } = context;
    
    let adjustment = 0;
    if (selectedSymptoms.length > 3) adjustment += 10;
    if (currentSeverity > 6) adjustment += 10;
    
    return Math.min(95, baseProb + adjustment);
  }

  private generateReasoning(condition: string, context: InterviewContext): string {
    const { selectedSymptoms, responses } = context;
    
    return `Based on your reported symptoms and their characteristics, ${condition.toLowerCase()} is the most likely explanation for your current health concerns.`;
  }

  private generateRecommendations(condition: string, severity: string): string[] {
    const baseRecommendations = [
      'Monitor symptoms for any changes',
      'Stay well hydrated',
      'Get adequate rest',
      'Avoid known triggers if applicable'
    ];

    if (severity === 'urgent') {
      return [
        'Seek medical attention within 24 hours',
        'Contact your healthcare provider',
        ...baseRecommendations
      ];
    }

    return baseRecommendations;
  }

  private generateCareTimeline(severity: string): string {
    switch (severity) {
      case 'emergency':
        return 'RIGHT NOW - This is a medical emergency';
      case 'urgent':
        return 'Within 24 hours';
      case 'moderate':
        return 'Within 2-3 days if symptoms persist';
      case 'mild':
        return 'If symptoms worsen or don\'t improve in a week';
      default:
        return 'Monitor and seek care if concerned';
    }
  }
}

export default AdaptiveInterviewEngine.getInstance();