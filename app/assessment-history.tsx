import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ChevronLeft, Calendar, Clock, Brain, TrendingUp, FileText, CircleAlert as AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { getAssessmentHistory, AssessmentData } from '@/utils/storage';

export default function AssessmentHistoryScreen() {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAssessmentHistory();
  }, []);

  const loadAssessmentHistory = async () => {
    try {
      const history = await getAssessmentHistory();
      setAssessments(history);
    } catch (error) {
      console.error('Error loading assessment history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAssessmentHistory();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    if (severity >= 8) return 'High';
    if (severity >= 6) return 'Moderate';
    if (severity >= 4) return 'Low-Moderate';
    return 'Low';
  };

  const getSymptomCount = (assessment: AssessmentData) => {
    return assessment.selectedSymptoms?.length || 0;
  };

  const handleAssessmentPress = (assessment: AssessmentData) => {
    // Navigate to detailed view of the assessment
    router.push({
      pathname: '/assessment-detail',
      params: {
        assessmentId: assessment.timestamp,
        assessmentData: JSON.stringify(assessment)
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading assessment history...</Text>
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
          <Text style={styles.title}>Assessment History</Text>
          <Text style={styles.subtitle}>{assessments.length} assessments completed</Text>
        </View>
      </View>

      {assessments.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Assessments Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete your first health assessment to see your history here
          </Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.startButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={20} color="#2563EB" />
              <Text style={styles.statNumber}>{assessments.length}</Text>
              <Text style={styles.statLabel}>Total Assessments</Text>
            </View>
            
            <View style={styles.statCard}>
              <Calendar size={20} color="#059669" />
              <Text style={styles.statNumber}>
                {assessments.length > 0 ? Math.ceil((Date.now() - new Date(assessments[assessments.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </Text>
              <Text style={styles.statLabel}>Days Since First</Text>
            </View>
          </View>

          <View style={styles.assessmentsList}>
            {assessments.map((assessment, index) => (
              <TouchableOpacity
                key={assessment.timestamp}
                style={styles.assessmentCard}
                onPress={() => handleAssessmentPress(assessment)}
              >
                <View style={styles.assessmentHeader}>
                  <View style={styles.assessmentTitleContainer}>
                    <Brain size={20} color="#2563EB" />
                    <Text style={styles.assessmentTitle}>
                      {assessment.category?.charAt(0).toUpperCase() + assessment.category?.slice(1) || 'Health Assessment'}
                    </Text>
                  </View>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(assessment.responses) }
                  ]}>
                    <Text style={styles.severityText}>
                      {getSeverityLabel(assessment.responses)}
                    </Text>
                  </View>
                </View>

                <View style={styles.assessmentDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {formatDate(assessment.timestamp)} at {formatTime(assessment.timestamp)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <AlertCircle size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {getSymptomCount(assessment)} symptoms reported
                    </Text>
                  </View>

                  {assessment.possibleDiseases && assessment.possibleDiseases.length > 0 && (
                    <View style={styles.detailRow}>
                      <FileText size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        Considered: {assessment.possibleDiseases.slice(0, 2).join(', ')}
                        {assessment.possibleDiseases.length > 2 && ` +${assessment.possibleDiseases.length - 2} more`}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.assessmentFooter}>
                  <Text style={styles.demographicInfo}>
                    {assessment.gender} • {assessment.age}
                  </Text>
                  <Text style={styles.viewDetails}>View Details →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  assessmentsList: {
    gap: 16,
    paddingBottom: 20,
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assessmentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  assessmentTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  assessmentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  assessmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  demographicInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  viewDetails: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
});