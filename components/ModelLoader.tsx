import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ModelLoaderProps {
  isLoading: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function ModelLoader({ isLoading, error, children }: ModelLoaderProps) {
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load 3D model</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading 3D model...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
  },
});