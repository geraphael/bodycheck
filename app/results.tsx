import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, Brain, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, Phone, MapPin, FileText, Lightbulb } from 'lucide-react-native';

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

export default function ResultsScreen() {
  const { category, gender, age, responses, symptoms, diseases, aiDiagnosis } = useLocalSearchParams<{
    category: string;
    gender: string;
    age: string;
    responses: string;
    symptoms: string;
    diseases: string;
    aiDiagnosis: string;
  }>();
  
  const [diagnosis, setDiagnosis] = useState<AIDiagnosis | null>(null);
  const [parsedResponses, setParsedResponses] = useState<Record<string, any>>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [possibleDiseases, setPossibleDiseases] = useState<string[]>([]);

  useEffect(() => {
    if (responses && symptoms && aiDiagnosis) {
      const responseData = JSON.parse(responses);
      const symptomData = JSON.parse(symptoms);
      const diseaseData = diseases ? JSON.parse(diseases) : [];
      const diagnosisData = JSON.parse(aiDiagnosis);
      
      setParsedResponses(responseData);
      setSelectedSymptoms(symptomData);
      setPossibleDiseases(diseaseData);
      setDiagnosis(diagnosisData);
    }
  }, [responses, symptoms, diseases, aiDiagnosis]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return '#DC2626';
      case 'urgent': return '#F59E0B';
      case 'moderate': return '#2563EB';
      case 'mild': return '#059669';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency': return AlertTriangle;
      case 'urgent': return AlertTriangle;
      case 'moderate': return Info;
      case 'mild': return CheckCircle;
      default: return Info;
    }
  };

  const handleEmergencyCall = () => {
    router.push('/emergency');
  };

  const handleFindHospitals = () => {
    router.push('/(tabs)/hospitals');
  };

  const handleSaveToProfile = () => {
    router.push('/(tabs)/settings');
  };

  if (!diagnosis) {
    return (
      <View style={styles.container}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  const SeverityIcon = getSeverityIcon(diagnosis.severity);
  const severityColor = getSeverityColor(diagnosis.severity);
  const isEmergency = diagnosis.severity === 'emergency';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>AI Diagnosis Results</Text>
          <Text style={styles.subtitle}>
            {category?.charAt(0).toUpperCase() + category?.slice(1)} Assessment
          </Text>
        </View>
      </View>

      {isEmergency && (
        <View style={styles.emergencyBanner}>
          <AlertTriangle size={24} color="#DC2626" />
          <Text style={styles.emergencyText}>
            URGENT: Your symptoms may require immediate medical attention
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.aiHeader}>
          <Brain size={32} color="#2563EB" />
          <Text style={styles.aiTitle}>AI-Powered Analysis Complete</Text>
          <Text style={styles.aiSubtitle}>
            Advanced machine learning algorithms have analyzed your symptoms
          </Text>
        </View>

        <View style={styles.primaryDiagnosisCard}>
          <View style={styles.diagnosisHeader}>
            <View style={styles.diagnosisTitleContainer}>
              <SeverityIcon size={24} color={severityColor} />
              <Text style={styles.diagnosisTitle}>{diagnosis.primaryDiagnosis}</Text>
            </View>
            <View style={styles.confidenceContainer}>
              <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                <Text style={styles.severityText}>
                  {diagnosis.severity.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.confidenceText}>{diagnosis.confidence}% confidence</Text>
            </View>
          </View>
          
          <View style={styles.careTimingContainer}>
            <Text style={styles.careTimingLabel}>When to seek care:</Text>
            <Text style={[styles.careTimingText, { color: severityColor }]}>
              {diagnosis.whenToSeekCare}
            </Text>
          </View>
          
          <View style={styles.reasoningContainer}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.reasoningTitle}>AI Reasoning:</Text>
          </View>
          <Text style={styles.reasoningText}>{diagnosis.reasoning}</Text>
          
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommended Actions:</Text>
            {diagnosis.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={[styles.recommendationBullet, { backgroundColor: severityColor }]} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        {diagnosis.alternativeDiagnoses.length > 0 && (
          <View style={styles.alternativesSection}>
            <Text style={styles.alternativesTitle}>Alternative Possibilities</Text>
            <Text style={styles.alternativesSubtitle}>
              Other conditions the AI considered based on your symptoms
            </Text>
            
            {diagnosis.alternativeDiagnoses.map((alt, index) => (
              <View key={index} style={styles.alternativeCard}>
                <View style={styles.alternativeHeader}>
                  <Text style={styles.alternativeName}>{alt.condition}</Text>
                  <Text style={styles.alternativeProbability}>{alt.probability}% match</Text>
                </View>
                <View style={styles.probabilityBar}>
                  <View 
                    style={[
                      styles.probabilityFill,
                      { width: `${alt.probability}%`, backgroundColor: severityColor }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Assessment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Category:</Text>
              <Text style={styles.summaryValue}>
                {category?.charAt(0).toUpperCase() + category?.slice(1)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Symptoms Reported:</Text>
              <Text style={styles.summaryValue}>{selectedSymptoms.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Severity Scale:</Text>
              <Text style={styles.summaryValue}>
                {parsedResponses.severity_scale || 'Not specified'}/10
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Onset:</Text>
              <Text style={styles.summaryValue}>
                {parsedResponses.symptom_onset || 'Not specified'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Phone size={20} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Emergency Services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.hospitalsButton} onPress={handleFindHospitals}>
            <MapPin size={20} color="#2563EB" />
            <Text style={styles.hospitalsButtonText}>Find Hospitals</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveToProfile}>
          <FileText size={20} color="#6B7280" />
          <Text style={styles.saveButtonText}>Save to Personal Health Record</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerTitle}>AI Medical Disclaimer: </Text>
            This AI-generated diagnosis is based on symptom analysis and should not replace professional medical evaluation. 
            Always consult with qualified healthcare providers for proper medical diagnosis and treatment decisions.
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
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  aiHeader: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  aiTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  aiSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  primaryDiagnosisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  diagnosisHeader: {
    marginBottom: 20,
  },
  diagnosisTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  diagnosisTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    flex: 1,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  confidenceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  careTimingContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  careTimingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  careTimingText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  reasoningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reasoningTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  reasoningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  recommendationsContainer: {
    gap: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  alternativesSection: {
    marginBottom: 24,
  },
  alternativesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  alternativesSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  alternativeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  alternativeProbability: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  probabilityBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 3,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  hospitalsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  hospitalsButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
  disclaimerTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
});