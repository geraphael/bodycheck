import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';

interface BodyVisualizationProps {
  gender: 'male' | 'female';
  onZonePress: (zone: string) => void;
}

const bodyZones = [
  { id: 'head', name: 'Head', x: 150, y: 50, radius: 30 },
  { id: 'neck', name: 'Neck', x: 150, y: 90, radius: 20 },
  { id: 'chest', name: 'Chest', x: 150, y: 140, radius: 40 },
  { id: 'abdomen', name: 'Abdomen', x: 150, y: 200, radius: 35 },
  { id: 'left_arm', name: 'Left Arm', x: 100, y: 140, radius: 25 },
  { id: 'right_arm', name: 'Right Arm', x: 200, y: 140, radius: 25 },
  { id: 'left_leg', name: 'Left Leg', x: 125, y: 280, radius: 30 },
  { id: 'right_leg', name: 'Right Leg', x: 175, y: 280, radius: 30 },
];

export default function BodyVisualization({ gender, onZonePress }: BodyVisualizationProps) {
  const handleZonePress = (zone: any) => {
    onZonePress(zone.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Svg width="300" height="400" viewBox="0 0 300 400">
          {/* Body outline */}
          <Path
            d="M150 20 C140 20, 130 30, 130 50 C130 70, 140 80, 150 80 C160 80, 170 70, 170 50 C170 30, 160 20, 150 20 Z"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />
          
          {/* Torso */}
          <Path
            d="M130 80 C120 85, 110 100, 110 120 L110 180 C110 200, 115 220, 125 240 L175 240 C185 220, 190 200, 190 180 L190 120 C190 100, 180 85, 170 80 Z"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />
          
          {/* Arms */}
          <Path
            d="M110 120 C90 125, 70 130, 60 140 L60 180 C60 185, 65 190, 70 190 L80 190 C85 185, 90 180, 90 175 L90 135 C95 130, 105 125, 110 120 Z"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />
          
          <Path
            d="M190 120 C210 125, 230 130, 240 140 L240 180 C240 185, 235 190, 230 190 L220 190 C215 185, 210 180, 210 175 L210 135 C205 130, 195 125, 190 120 Z"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />
          
          {/* Legs */}
          <Path
            d="M125 240 C125 250, 120 260, 115 270 L115 350 C115 360, 120 370, 130 370 L140 370 C145 365, 150 360, 150 355 L150 250 Z"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />
          
          <Path
            d="M175 240 C175 250, 180 260, 185 270 L185 350 C185 360, 180 370, 170 370 L160 370 C155 365, 150 360, 150 355 L150 250 Z"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />

          {/* Interactive zones */}
          {bodyZones.map((zone) => (
            <Circle
              key={zone.id}
              cx={zone.x}
              cy={zone.y}
              r={zone.radius}
              fill="rgba(37, 99, 235, 0.1)"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity={0.7}
              onPress={() => handleZonePress(zone)}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.zonesGrid}>
        {bodyZones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={styles.zoneButton}
            onPress={() => handleZonePress(zone)}
          >
            <Text style={styles.zoneButtonText}>{zone.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bodyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 300,
  },
  zoneButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  zoneButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
});