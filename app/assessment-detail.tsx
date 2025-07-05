import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Calendar, Clock, Brain, AlertCircle, User, Activity } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AssessmentData } from '@/utils/storage';

export default function AssessmentDetailScreen() {
  const { assessmentData } = useLocalSearchParams<{ assessmentData: string }>();
  
  if (!assessmentData) {
    return (
      <View style={styles.container}>
        <Text>Assessment not found</Text>
      </View>
    );
  }

  const assessment: AssessmentData = JSON.parse(assessmentData);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSeverityColor = (responses: Record<string, any>) => {
    const severity = responses.severity_overall || responses.severity_scale || 0;
    if (severity >= 8) return '#DC2626';
    if (severity >= 6) return '#F59E0B';
    if (severity >= 4) return '#2563EB';
    return '#059669';
  };

  const getSeverityLabel = (responses: Record<string, any>) => {
    const severity = responses.severity_overall || responses.severity_scale || 0;
    if (severity >= 8) return 'High Severity';
    if (severity >= 6) return 'Moderate Severity';
    if (severity >= 4) return 'Low-Moderate Severity';
    return 'Low Severity';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Assessment Details</Text>
          <Text style={styles.subtitle}>
            {assessment.category?.charAt(0).toUpperCase() + assessment.category?.slice(1) || 'Health Assessment'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Assessment Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Overview</Text>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Brain size={24} color="#2563EB" />
              <View style={styles.overviewInfo}>
                <Text style={styles.overviewTitle}>
                  {assessment.category?.charAt(0).toUpperCase() + assessment.category?.slice(1)} Assessment
                </Text>
                <Text style={styles.overviewDate}>
                  {formatDate(assessment.timestamp)} at {formatTime(assessment.timestamp)}
                </Text>
              </View>
              <View style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(assessment.responses) }
              ]}>
                <Text style={styles.severityText}>
                  {getSeverityLabel(assessment.responses).split(' ')[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Demographics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics</Text>
          <View style={styles.card}>
            <View style={styles.demographicRow}>
              <User size={16} color="#6B7280" />
              <Text style={styles.demographicLabel}>Gender:</Text>
              <Text style={styles.demographicValue}>{assessment.gender}</Text>
            </View>
            <View style={styles.demographicRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.demographicLabel}>Age Range:</Text>
              <Text style={styles.demographicValue}>{assessment.age}</Text>
            </View>
          </View>
        </View>

        {/* Symptoms Reported */}
        {assessment.selectedSymptoms && assessment.selectedSymptoms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptoms Reported</Text>
            <View style={styles.card}>
              {assessment.selectedSymptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomItem}>
                  <View style={styles.symptomBullet} />
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Assessment Responses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Responses</Text>
          <View style={styles.card}>
            {Object.entries(assessment.responses).map(([key, value]) => (
              <View key={key} style={styles.responseItem}>
                <Text style={styles.responseQuestion}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                </Text>
                <Text style={styles.responseAnswer}>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Possible Conditions */}
        {assessment.possibleDiseases && assessment.possibleDiseases.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conditions Considered</Text>
            <View style={styles.card}>
              {assessment.possibleDiseases.map((condition, index) => (
                <View key={index} style={styles.conditionItem}>
                  <AlertCircle size={16} color="#2563EB" />
                  <Text style={styles.conditionText}>{condition}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Assessment Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Information</Text>
          <View style={styles.card}>
            <View style={styles.metadataItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.metadataLabel}>Completed:</Text>
              <Text style={styles.metadataValue}>
                {formatDate(assessment.timestamp)} at {formatTime(assessment.timestamp)}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Activity size={16} color="#6B7280" />
              <Text style={styles.metadataLabel}>Assessment ID:</Text>
              <Text style={styles.metadataValue}>
                {assessment.timestamp.slice(-8)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerTitle}>Medical Disclaimer: </Text>
            This assessment is for informational purposes only and should not replace professional medical advice. 
            Always consult with qualified healthcare providers for proper medical diagnosis and treatment.
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  overviewInfo: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  overviewDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
    textTransform: 'uppercase',
  },
  demographicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  demographicLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  demographicValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  symptomBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  symptomText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  responseItem: {
    marginBottom: 16,
  },
  responseQuestion: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  responseAnswer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  conditionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metadataLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  metadataValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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