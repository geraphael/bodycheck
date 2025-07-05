import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  source: 'gps' | 'ip' | 'fallback';
}

export interface LocationError {
  code: string;
  message: string;
}

class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private locationPermissionGranted = false;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web geolocation API
        return new Promise((resolve) => {
          if ('geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
              this.locationPermissionGranted = result.state === 'granted';
              resolve(this.locationPermissionGranted);
            }).catch(() => {
              resolve(false);
            });
          } else {
            resolve(false);
          }
        });
      } else {
        // Native platforms
        const { status } = await Location.requestForegroundPermissionsAsync();
        this.locationPermissionGranted = status === 'granted';
        return this.locationPermissionGranted;
      }
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationData> {
    try {
      // Try GPS first if permission granted
      if (this.locationPermissionGranted) {
        const gpsLocation = await this.getGPSLocation();
        if (gpsLocation) {
          this.currentLocation = gpsLocation;
          return gpsLocation;
        }
      }

      // Fallback to IP-based location
      const ipLocation = await this.getIPLocation();
      if (ipLocation) {
        this.currentLocation = ipLocation;
        return ipLocation;
      }

      // Final fallback to default location (e.g., city center)
      const fallbackLocation: LocationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        source: 'fallback'
      };
      
      this.currentLocation = fallbackLocation;
      return fallbackLocation;
    } catch (error) {
      console.error('Location service error:', error);
      throw new Error('Unable to determine location');
    }
  }

  private async getGPSLocation(): Promise<LocationData | null> {
    try {
      if (Platform.OS === 'web') {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                source: 'gps'
              });
            },
            (error) => {
              console.log('Web geolocation error:', error);
              resolve(null);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        });
      } else {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
        });
        
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined,
          source: 'gps'
        };
      }
    } catch (error) {
      console.log('GPS location error:', error);
      return null;
    }
  }

  private async getIPLocation(): Promise<LocationData | null> {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          source: 'ip'
        };
      }
      
      return null;
    } catch (error) {
      console.log('IP location error:', error);
      return null;
    }
  }

  getCachedLocation(): LocationData | null {
    return this.currentLocation;
  }

  async calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): Promise<number> {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async findNearbyHospitals(radius: number = 10): Promise<any[]> {
    try {
      const location = await this.getCurrentLocation();
      
      // In a real app, this would call a healthcare facility API
      // For now, return mock data with calculated distances
      const mockHospitals = [
        {
          id: '1',
          name: 'City General Hospital',
          address: '123 Main St, Downtown',
          phone: '(555) 123-4567',
          rating: 4.2,
          isOpen: true,
          hasEmergency: true,
          coordinates: { latitude: location.latitude + 0.01, longitude: location.longitude + 0.01 }
        },
        {
          id: '2',
          name: 'Regional Medical Center',
          address: '456 Oak Ave, Midtown',
          phone: '(555) 234-5678',
          rating: 4.5,
          isOpen: true,
          hasEmergency: true,
          coordinates: { latitude: location.latitude - 0.02, longitude: location.longitude + 0.015 }
        },
        {
          id: '3',
          name: 'Community Health Clinic',
          address: '789 Pine St, Uptown',
          phone: '(555) 345-6789',
          rating: 4.0,
          isOpen: false,
          hasEmergency: false,
          coordinates: { latitude: location.latitude + 0.025, longitude: location.longitude - 0.01 }
        }
      ];

      // Calculate distances and filter by radius
      const hospitalsWithDistance = await Promise.all(
        mockHospitals.map(async (hospital) => {
          const distance = await this.calculateDistance(
            location.latitude,
            location.longitude,
            hospital.coordinates.latitude,
            hospital.coordinates.longitude
          );
          
          return {
            ...hospital,
            distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
          };
        })
      );

      return hospitalsWithDistance
        .filter(hospital => hospital.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error finding nearby hospitals:', error);
      return [];
    }
  }

  async getEmergencyServices(): Promise<any> {
    try {
      const location = await this.getCurrentLocation();
      
      return {
        location,
        emergencyNumber: '911',
        nearestHospital: await this.findNearbyHospitals(5).then(hospitals => hospitals[0]),
        poisonControl: '1-800-222-1222',
        suicidePrevention: '1-800-273-8255'
      };
    } catch (error) {
      console.error('Error getting emergency services:', error);
      throw error;
    }
  }
}

export default LocationService.getInstance();