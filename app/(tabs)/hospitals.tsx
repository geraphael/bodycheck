import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, Star } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import LocationService from '@/utils/locationService';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone: string;
  rating: number;
  isOpen: boolean;
  hasEmergency: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function HospitalsScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<string>('');

  useEffect(() => {
    findNearbyHospitals();
  }, []);

  const findNearbyHospitals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permission and get current location
      await LocationService.requestLocationPermission();
      const nearbyHospitals = await LocationService.findNearbyHospitals(15);
      
      const currentLocation = LocationService.getCachedLocation();
      if (currentLocation) {
        setLocationSource(currentLocation.source);
      }

      setHospitals(nearbyHospitals);
    } catch (err) {
      setError('Unable to find nearby hospitals');
      console.error('Hospital search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleDirections = (hospital: Hospital) => {
    if (Platform.OS === 'web') {
      const url = `https://maps.google.com/maps?q=${encodeURIComponent(hospital.address)}`;
      Linking.openURL(url);
    } else {
      const url = `maps://app?daddr=${hospital.coordinates.latitude},${hospital.coordinates.longitude}`;
      Linking.openURL(url);
    }
  };

  const getLocationSourceText = () => {
    switch (locationSource) {
      case 'gps':
        return 'Using GPS location';
      case 'ip':
        return 'Using approximate location';
      case 'fallback':
        return 'Using default location';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Finding nearby hospitals...</Text>
        <Text style={styles.loadingSubtext}>Getting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={findNearbyHospitals}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Hospitals</Text>
        <Text style={styles.subtitle}>
          {hospitals.length} hospitals found • {getLocationSourceText()}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {hospitals.map((hospital) => (
          <View key={hospital.id} style={styles.hospitalCard}>
            <View style={styles.hospitalHeader}>
              <Text style={styles.hospitalName}>{hospital.name}</Text>
              <View style={styles.badgeContainer}>
                {hospital.hasEmergency && (
                  <View style={styles.emergencyBadge}>
                    <Text style={styles.emergencyBadgeText}>ER</Text>
                  </View>
                )}
                <View style={[styles.statusBadge, hospital.isOpen ? styles.openBadge : styles.closedBadge]}>
                  <Clock size={12} color={hospital.isOpen ? '#059669' : '#DC2626'} />
                  <Text style={[styles.statusText, hospital.isOpen ? styles.openText : styles.closedText]}>
                    {hospital.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.hospitalInfo}>
              <View style={styles.infoRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.address}>{hospital.address}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.distance}>{hospital.distance} miles away</Text>
                <View style={styles.rating}>
                  <Star size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{hospital.rating}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(hospital.phone)}
              >
                <Phone size={18} color="#FFFFFF" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => handleDirections(hospital)}
              >
                <Navigation size={18} color="#2563EB" />
                <Text style={styles.directionsButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {hospitals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hospitals found in your area</Text>
            <TouchableOpacity style={styles.retryButton} onPress={findNearbyHospitals}>
              <Text style={styles.retryButtonText}>Search Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  emergencyBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  openBadge: {
    backgroundColor: '#D1FAE5',
  },
  closedBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  openText: {
    color: '#059669',
  },
  closedText: {
    color: '#DC2626',
  },
  hospitalInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  directionsButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
});