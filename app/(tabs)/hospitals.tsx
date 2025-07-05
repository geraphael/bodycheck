import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, Star } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

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
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocationAndFindHospitals();
  }, []);

  const getLocationAndFindHospitals = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web fallback with mock data
        setHospitals(mockHospitals);
        setLoading(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // In a real app, you'd query a hospital database API here
      // For now, we'll use mock data with realistic locations
      const nearbyHospitals = mockHospitals.map(hospital => ({
        ...hospital,
        distance: Math.random() * 2 + 0.5, // Random distance between 0.5-2.5 miles
      })).sort((a, b) => a.distance - b.distance);

      setHospitals(nearbyHospitals);
    } catch (err) {
      setError('Failed to get location');
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Finding nearby hospitals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getLocationAndFindHospitals}>
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
          {Platform.OS === 'web' ? 'Sample locations' : `${hospitals.length} hospitals found`}
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
                <Text style={styles.distance}>{hospital.distance.toFixed(1)} miles away</Text>
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
      </ScrollView>
    </View>
  );
}

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Main St, Downtown',
    distance: 0.8,
    phone: '(555) 123-4567',
    rating: 4.2,
    isOpen: true,
    hasEmergency: true,
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: '2',
    name: 'Regional Medical Center',
    address: '456 Oak Ave, Midtown',
    distance: 1.2,
    phone: '(555) 234-5678',
    rating: 4.5,
    isOpen: true,
    hasEmergency: true,
    coordinates: { latitude: 40.7589, longitude: -73.9851 }
  },
  {
    id: '3',
    name: 'Community Health Clinic',
    address: '789 Pine St, Uptown',
    distance: 1.8,
    phone: '(555) 345-6789',
    rating: 4.0,
    isOpen: false,
    hasEmergency: false,
    coordinates: { latitude: 40.7831, longitude: -73.9712 }
  },
  {
    id: '4',
    name: 'Metro Emergency Center',
    address: '321 Elm St, East Side',
    distance: 2.1,
    phone: '(555) 456-7890',
    rating: 4.3,
    isOpen: true,
    hasEmergency: true,
    coordinates: { latitude: 40.7505, longitude: -73.9934 }
  },
];

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
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
});