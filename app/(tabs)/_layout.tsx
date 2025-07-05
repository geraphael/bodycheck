import { Tabs } from 'expo-router';
import { User, MapPin, Heart, CircleUser as UserCircle, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useRef } from 'react';

export default function TabLayout() {
  const currentTabIndex = useRef(0);

  const handleTabPress = (index: number) => {
    currentTabIndex.current = index;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
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
        listeners={{
          tabPress: () => handleTabPress(0),
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
        listeners={{
          tabPress: () => handleTabPress(1),
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
        listeners={{
          tabPress: () => handleTabPress(2),
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
        listeners={{
          tabPress: () => handleTabPress(3),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress(4),
        }}
      />
    </Tabs>
  );
}