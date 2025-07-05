import { Tabs } from 'expo-router';
import { User, MapPin, Heart, CircleUser as UserCircle } from 'lucide-react-native';
import SwipeNavigationProvider from '@/components/SwipeNavigationProvider';

export default function TabLayout() {
  return (
    <SwipeNavigationProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter-Medium',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Body Check',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="hospitals"
          options={{
            title: 'Hospitals',
            tabBarIcon: ({ size, color }) => (
              <MapPin size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="emergency"
          options={{
            title: 'Emergency',
            tabBarIcon: ({ size, color }) => (
              <Heart size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <UserCircle size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SwipeNavigationProvider>
  );
}