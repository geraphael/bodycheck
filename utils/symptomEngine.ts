import { AssessmentData } from './storage';

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

interface AIDiagnosis {
  primaryDiagnosis: string;
  confidence: number;
  alternativeDiagnoses: Array<{
    condition: string;
    probability: number;
  }>;
  severity: 'emergency' | 'urgent' | 'moderate' | 'mild';
  recommendations: string[];
  whenToSeekCare: string;
  reasoning: string;
}

const symptomDatabase: Record<string, Symptom[]> = {
  neurological: [
    {
      id: 'headache_tension',
      name: 'Tension Headache',
      description: 'Dull, aching head pain with tightness around your forehead',
      severity: 'mild',
      relatedDiseases: ['Tension Headache', 'Stress-related Headache', 'Muscle Tension']
    },
    {
      id: 'headache_migraine',
      name: 'Migraine-like Headache',
      description: 'Throbbing, pulsating pain often on one side of your head',
      severity: 'moderate',
      relatedDiseases: ['Migraine', 'Cluster Headache', 'Vascular Headache']
    },
    {
      id: 'headache_sudden_severe',
      name: 'Sudden Severe Headache',
      description: 'The worst headache of your life that came on suddenly',
      severity: 'severe',
      relatedDiseases: ['Subarachnoid Hemorrhage', 'Meningitis', 'Brain Aneurysm']
    },
    {
      id: 'dizziness_lightheaded',
      name: 'Lightheadedness',
      description: 'Feeling faint or like you might pass out',
      severity: 'mild',
      relatedDiseases: ['Dehydration', 'Low Blood Pressure', 'Anemia']
    },
    {
      id: 'dizziness_vertigo',
      name: 'Vertigo',
      description: 'Spinning sensation, like the room is moving around you',
      severity: 'moderate',
      relatedDiseases: ['BPPV', 'Vestibular Neuritis', 'Meniere\'s Disease']
    },
    {
      id: 'confusion',
      name: 'Confusion',
      description: 'Difficulty thinking clearly or remembering things',
      severity: 'moderate',
      relatedDiseases: ['Delirium', 'Dementia', 'Medication Side Effects']
    },
    {
      id: 'memory_loss',
      name: 'Memory Problems',
      description: 'Trouble remembering recent events or information',
      severity: 'moderate',
      relatedDiseases: ['Alzheimer\'s Disease', 'Mild Cognitive Impairment', 'Depression']
    },
    {
      id: 'seizure_like',
      name: 'Seizure-like Episodes',
      description: 'Episodes of uncontrolled movements or loss of consciousness',
      severity: 'severe',
      relatedDiseases: ['Epilepsy', 'Non-epileptic Seizures', 'Brain Tumor']
    }
  ],
  cardiovascular: [
    {
      id: 'chest_pain_crushing',
      name: 'Crushing Chest Pain',
      description: 'Heavy pressure or squeezing sensation in your chest',
      severity: 'severe',
      relatedDiseases: ['Heart Attack', 'Unstable Angina', 'Aortic Dissection']
    },
    {
      id: 'chest_pain_sharp',
      name: 'Sharp Chest Pain',
      description: 'Stabbing or knife-like pain in your chest',
      severity: 'moderate',
      relatedDiseases: ['Pericarditis', 'Pleuritis', 'Costochondritis']
    },
    {
      id: 'palpitations',
      name: 'Heart Palpitations',
      description: 'Feeling of rapid, fluttering, or pounding heartbeat',
      severity: 'moderate',
      relatedDiseases: ['Atrial Fibrillation', 'Anxiety', 'Hyperthyroidism']
    },
    {
      id: 'shortness_breath_exertion',
      name: 'Shortness of Breath with Activity',
      description: 'Difficulty breathing during physical activity',
      severity: 'moderate',
      relatedDiseases: ['Heart Failure', 'Coronary Artery Disease', 'Pulmonary Embolism']
    },
    {
      id: 'shortness_breath_rest',
      name: 'Shortness of Breath at Rest',
      description: 'Difficulty breathing even when not active',
      severity: 'severe',
      relatedDiseases: ['Acute Heart Failure', 'Pulmonary Edema', 'Severe Asthma']
    },
    {
      id: 'leg_swelling',
      name: 'Leg Swelling',
      description: 'Swelling in your ankles, feet, or legs',
      severity: 'mild',
      relatedDiseases: ['Heart Failure', 'Venous Insufficiency', 'Kidney Disease']
    },
    {
      id: 'fainting',
      name: 'Fainting Episodes',
      description: 'Loss of consciousness or near-fainting',
      severity: 'moderate',
      relatedDiseases: ['Vasovagal Syncope', 'Cardiac Arrhythmia', 'Orthostatic Hypotension']
    }
  ],
  respiratory: [
    {
      id: 'cough_dry',
      name: 'Dry Cough',
      description: 'Persistent cough without mucus production',
      severity: 'mild',
      relatedDiseases: ['Viral Upper Respiratory Infection', 'Allergies', 'ACE Inhibitor Side Effect']
    },
    {
      id: 'cough_productive',
      name: 'Productive Cough',
      description: 'Cough with mucus or phlegm',
      severity: 'moderate',
      relatedDiseases: ['Bacterial Pneumonia', 'Bronchitis', 'COPD Exacerbation']
    },
    {
      id: 'cough_blood',
      name: 'Coughing Blood',
      description: 'Blood in sputum or coughing up blood',
      severity: 'severe',
      relatedDiseases: ['Lung Cancer', 'Tuberculosis', 'Pulmonary Embolism']
    },
    {
      id: 'wheezing',
      name: 'Wheezing',
      description: 'High-pitched whistling sound when breathing',
      severity: 'moderate',
      relatedDiseases: ['Asthma', 'COPD', 'Bronchospasm']
    },
    {
      id: 'chest_tightness',
      name: 'Chest Tightness',
      description: 'Feeling of pressure or constriction in your chest',
      severity: 'moderate',
      relatedDiseases: ['Asthma', 'Anxiety', 'Costochondritis']
    }
  ],
  gastrointestinal: [
    {
      id: 'nausea_mild',
      name: 'Mild Nausea',
      description: 'Feeling queasy or unsettled stomach',
      severity: 'mild',
      relatedDiseases: ['Gastroenteritis', 'Food Poisoning', 'Motion Sickness']
    },
    {
      id: 'vomiting_persistent',
      name: 'Persistent Vomiting',
      description: 'Unable to keep food or fluids down',
      severity: 'moderate',
      relatedDiseases: ['Gastroenteritis', 'Bowel Obstruction', 'Gastroparesis']
    },
    {
      id: 'vomiting_blood',
      name: 'Vomiting Blood',
      description: 'Blood in vomit or coffee-ground appearance',
      severity: 'severe',
      relatedDiseases: ['Upper GI Bleeding', 'Peptic Ulcer', 'Esophageal Varices']
    },
    {
      id: 'abdominal_pain_cramping',
      name: 'Cramping Abdominal Pain',
      description: 'Intermittent, cramping pain in your abdomen',
      severity: 'mild',
      relatedDiseases: ['Irritable Bowel Syndrome', 'Gastroenteritis', 'Food Intolerance']
    },
    {
      id: 'abdominal_pain_severe',
      name: 'Severe Abdominal Pain',
      description: 'Intense, constant abdominal pain',
      severity: 'severe',
      relatedDiseases: ['Appendicitis', 'Bowel Obstruction', 'Pancreatitis']
    },
    {
      id: 'diarrhea_watery',
      name: 'Watery Diarrhea',
      description: 'Frequent, loose, watery stools',
      severity: 'mild',
      relatedDiseases: ['Viral Gastroenteritis', 'Food Poisoning', 'IBS']
    },
    {
      id: 'diarrhea_bloody',
      name: 'Bloody Diarrhea',
      description: 'Diarrhea with visible blood',
      severity: 'severe',
      relatedDiseases: ['Inflammatory Bowel Disease', 'C. diff Colitis', 'Ischemic Colitis']
    }
  ],
  musculoskeletal: [
    {
      id: 'joint_pain_mild',
      name: 'Mild Joint Pain',
      description: 'Aching or stiffness in your joints',
      severity: 'mild',
      relatedDiseases: ['Osteoarthritis', 'Overuse Injury', 'Viral Arthritis']
    },
    {
      id: 'joint_pain_severe',
      name: 'Severe Joint Pain',
      description: 'Intense pain with swelling and redness',
      severity: 'severe',
      relatedDiseases: ['Septic Arthritis', 'Gout', 'Rheumatoid Arthritis']
    },
    {
      id: 'muscle_aches',
      name: 'Muscle Aches',
      description: 'Generalized muscle pain and soreness',
      severity: 'mild',
      relatedDiseases: ['Viral Myalgia', 'Fibromyalgia', 'Overexertion']
    },
    {
      id: 'back_pain_lower',
      name: 'Lower Back Pain',
      description: 'Pain in your lower back region',
      severity: 'moderate',
      relatedDiseases: ['Muscle Strain', 'Herniated Disc', 'Sciatica']
    },
    {
      id: 'neck_stiffness',
      name: 'Neck Stiffness',
      description: 'Difficulty moving your neck, stiffness',
      severity: 'moderate',
      relatedDiseases: ['Muscle Strain', 'Meningitis', 'Cervical Spondylosis']
    }
  ],
  general: [
    {
      id: 'fever_low',
      name: 'Low-grade Fever',
      description: 'Temperature 100-102°F (37.8-38.9°C)',
      severity: 'mild',
      relatedDiseases: ['Viral Infection', 'Bacterial Infection', 'Inflammatory Condition']
    },
    {
      id: 'fever_high',
      name: 'High Fever',
      description: 'Temperature above 102°F (38.9°C)',
      severity: 'moderate',
      relatedDiseases: ['Bacterial Infection', 'Severe Viral Infection', 'Sepsis']
    },
    {
      id: 'fatigue_mild',
      name: 'Mild Fatigue',
      description: 'Feeling tired but able to function',
      severity: 'mild',
      relatedDiseases: ['Viral Infection', 'Sleep Deprivation', 'Stress']
    },
    {
      id: 'fatigue_severe',
      name: 'Severe Fatigue',
      description: 'Extreme tiredness affecting daily activities',
      severity: 'moderate',
      relatedDiseases: ['Chronic Fatigue Syndrome', 'Depression', 'Anemia']
    },
    {
      id: 'weight_loss_unintentional',
      name: 'Unintentional Weight Loss',
      description: 'Losing weight without trying',
      severity: 'moderate',
      relatedDiseases: ['Cancer', 'Hyperthyroidism', 'Diabetes']
    },
    {
      id: 'night_sweats',
      name: 'Night Sweats',
      description: 'Excessive sweating during sleep',
      severity: 'mild',
      relatedDiseases: ['Infection', 'Lymphoma', 'Menopause']
    }
  ]
};

export const getSymptomHierarchy = (category: string, gender: string, age: string): Question[] => {
  const categorySymptoms = symptomDatabase[category] || [];
  
  const baseQuestions: Question[] = [
    {
      id: 'primary_symptoms',
      text: 'Which of these symptoms are you experiencing right now?',
      type: 'symptoms',
      symptoms: categorySymptoms,
      required: true,
    },
    {
      id: 'symptom_onset',
      text: 'When did these symptoms first start?',
      type: 'multiple',
      options: [
        'Less than 1 hour ago',
        '1-6 hours ago',
        '6-24 hours ago',
        '1-3 days ago',
        '3-7 days ago',
        '1-2 weeks ago',
        'More than 2 weeks ago'
      ],
      required: true,
    },
    {
      id: 'severity_scale',
      text: 'How uncomfortable are you feeling right now?',
      type: 'scale',
      required: true,
    },
    {
      id: 'sudden_onset',
      text: 'Did these symptoms come on suddenly or gradually?',
      type: 'multiple',
      options: ['Very suddenly', 'Gradually over hours', 'Gradually over days', 'Not sure'],
      required: true,
    }
  ];

  // Add category-specific follow-up questions
  const followUpQuestions = getCategorySpecificQuestions(category, gender, age);
  
  return [...baseQuestions, ...followUpQuestions];
};

const getCategorySpecificQuestions = (category: string, gender: string, age: string): Question[] => {
  const questions: Record<string, Question[]> = {
    neurological: [
      {
        id: 'headache_location',
        text: 'If you have a headache, where do you feel it?',
        type: 'multiple',
        options: [
          'Front of head/forehead',
          'Sides of head (temples)',
          'Back of head/neck',
          'Top of head',
          'Behind eyes',
          'One side only',
          'All over',
          'No headache'
        ],
        required: false,
      },
      {
        id: 'neurological_associated',
        text: 'Are you experiencing any of these other symptoms?',
        type: 'multiple',
        options: [
          'Nausea or vomiting',
          'Sensitivity to light',
          'Sensitivity to sound',
          'Vision changes',
          'Weakness in arms/legs',
          'Difficulty speaking',
          'Neck stiffness'
        ],
        required: false,
      }
    ],
    cardiovascular: [
      {
        id: 'chest_pain_quality',
        text: 'If you have chest pain, how would you describe it?',
        type: 'multiple',
        options: [
          'Crushing/squeezing',
          'Sharp/stabbing',
          'Burning',
          'Dull ache',
          'Pressure/heaviness',
          'Tightness',
          'No chest pain'
        ],
        required: false,
      },
      {
        id: 'pain_radiation',
        text: 'Does any pain spread to other areas?',
        type: 'multiple',
        options: [
          'Left arm',
          'Right arm',
          'Both arms',
          'Jaw',
          'Neck',
          'Back',
          'Stomach',
          'No spreading pain'
        ],
        required: false,
      }
    ],
    gastrointestinal: [
      {
        id: 'abdominal_location',
        text: 'If you have stomach pain, where do you feel it?',
        type: 'multiple',
        options: [
          'Upper right (under ribs)',
          'Upper left (under ribs)',
          'Upper center (stomach area)',
          'Lower right',
          'Lower left',
          'Lower center',
          'Around belly button',
          'All over stomach',
          'No stomach pain'
        ],
        required: false,
      },
      {
        id: 'bowel_changes',
        text: 'Have you noticed any changes in your bowel movements?',
        type: 'multiple',
        options: [
          'Diarrhea',
          'Constipation',
          'Blood in stool',
          'Black/tarry stools',
          'Mucus in stool',
          'Change in frequency',
          'No changes'
        ],
        required: false,
      }
    ]
  };

  return questions[category] || [];
};

export const generateAIDiagnosis = async (assessmentData: any): Promise<AIDiagnosis> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { responses, selectedSymptoms, possibleDiseases, category } = assessmentData;
  const severity = responses.severity_scale || 5;
  const onset = responses.symptom_onset || '';
  const suddenOnset = responses.sudden_onset?.includes('suddenly') || false;

  // Advanced AI logic for diagnosis
  let primaryDiagnosis = '';
  let confidence = 0;
  let diagnosisSeverity: 'emergency' | 'urgent' | 'moderate' | 'mild' = 'mild';
  let recommendations: string[] = [];
  let whenToSeekCare = '';
  let reasoning = '';

  // Emergency conditions detection
  if (category === 'cardiovascular' && selectedSymptoms.includes('chest_pain_crushing') && severity >= 7) {
    primaryDiagnosis = 'Possible Heart Attack';
    confidence = 85;
    diagnosisSeverity = 'emergency';
    recommendations = [
      'Call 911 immediately',
      'Chew aspirin (325mg) if not allergic',
      'Sit upright and try to stay calm',
      'Do not drive yourself to hospital'
    ];
    whenToSeekCare = 'RIGHT NOW - This is a medical emergency';
    reasoning = 'Crushing chest pain with high discomfort level suggests possible heart attack';
  }
  else if (category === 'neurological' && selectedSymptoms.includes('headache_sudden_severe') && suddenOnset) {
    primaryDiagnosis = 'Possible Brain Emergency';
    confidence = 80;
    diagnosisSeverity = 'emergency';
    recommendations = [
      'Call 911 immediately',
      'Avoid bright lights',
      'Do not take pain medication',
      'Stay as still as possible'
    ];
    whenToSeekCare = 'RIGHT NOW - This is a medical emergency';
    reasoning = 'Sudden severe headache may indicate brain bleeding or other serious brain problem';
  }
  else if (category === 'gastrointestinal' && selectedSymptoms.includes('vomiting_blood')) {
    primaryDiagnosis = 'Serious Stomach Bleeding';
    confidence = 90;
    diagnosisSeverity = 'emergency';
    recommendations = [
      'Go to emergency room immediately',
      'Do not eat or drink anything',
      'Monitor for signs of shock',
      'Bring list of medications'
    ];
    whenToSeekCare = 'RIGHT NOW';
    reasoning = 'Vomiting blood indicates serious bleeding requiring immediate medical attention';
  }
  // Urgent conditions
  else if (category === 'gastrointestinal' && responses.abdominal_location === 'Lower right' && severity >= 6) {
    primaryDiagnosis = 'Possible Appendicitis';
    confidence = 75;
    diagnosisSeverity = 'urgent';
    recommendations = [
      'Seek emergency medical care within 2 hours',
      'Do not eat or drink anything',
      'Do not take pain medication',
      'Monitor for worsening symptoms'
    ];
    whenToSeekCare = 'Within 2 hours';
    reasoning = 'Right lower stomach pain with moderate to severe intensity suggests appendicitis';
  }
  else if (category === 'respiratory' && selectedSymptoms.includes('shortness_breath_rest')) {
    primaryDiagnosis = 'Serious Breathing Problem';
    confidence = 70;
    diagnosisSeverity = 'urgent';
    recommendations = [
      'Seek immediate medical attention',
      'Sit upright to ease breathing',
      'Use prescribed inhaler if available',
      'Monitor oxygen levels if possible'
    ];
    whenToSeekCare = 'Within 1-2 hours';
    reasoning = 'Shortness of breath at rest indicates significant breathing problem';
  }
  // Moderate conditions
  else if (category === 'neurological' && selectedSymptoms.includes('headache_migraine')) {
    primaryDiagnosis = 'Migraine Headache';
    confidence = 80;
    diagnosisSeverity = 'moderate';
    recommendations = [
      'Rest in dark, quiet room',
      'Apply cold compress to head',
      'Take prescribed migraine medication',
      'Stay hydrated'
    ];
    whenToSeekCare = 'If symptoms get worse or last more than 3 days';
    reasoning = 'Throbbing, one-sided headache pattern is consistent with migraine';
  }
  else if (category === 'gastrointestinal' && selectedSymptoms.includes('nausea_mild') && selectedSymptoms.includes('diarrhea_watery')) {
    primaryDiagnosis = 'Stomach Bug (Viral Gastroenteritis)';
    confidence = 75;
    diagnosisSeverity = 'mild';
    recommendations = [
      'Stay hydrated with clear fluids',
      'Eat bland foods (bananas, rice, toast)',
      'Rest and avoid dairy',
      'Use electrolyte replacement drinks'
    ];
    whenToSeekCare = 'If symptoms last more than 3 days or you become dehydrated';
    reasoning = 'Combination of nausea and watery diarrhea suggests stomach bug';
  }
  // Default mild condition
  else {
    primaryDiagnosis = 'Mild Symptoms - Self-Care Recommended';
    confidence = 60;
    diagnosisSeverity = 'mild';
    recommendations = [
      'Rest and get adequate sleep',
      'Stay well hydrated',
      'Over-the-counter symptom relief as needed',
      'Monitor symptoms for changes'
    ];
    whenToSeekCare = 'If symptoms get worse or don\'t improve as expected';
    reasoning = 'Symptoms appear mild and may improve with appropriate self-care';
  }

  // Generate alternative diagnoses
  const alternativeDiagnoses = possibleDiseases
    .filter((disease: string) => disease !== primaryDiagnosis)
    .slice(0, 3)
    .map((disease: string, index: number) => ({
      condition: disease,
      probability: Math.max(20, confidence - (index + 1) * 15)
    }));

  return {
    primaryDiagnosis,
    confidence,
    alternativeDiagnoses,
    severity: diagnosisSeverity,
    recommendations,
    whenToSeekCare,
    reasoning
  };
};