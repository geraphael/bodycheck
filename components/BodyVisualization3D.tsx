import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useState } from 'react';
import { RotateCw, RotateCcw } from 'lucide-react-native';

interface BodyVisualization3DProps {
  gender: 'male' | 'female';
  age: string;
  onZonePress: (zone: string) => void;
}

interface BodyZone {
  id: string;
  name: string;
  frontCoords: { x: number; y: number; width: number; height: number };
  backCoords: { x: number; y: number; width: number; height: number };
}

const bodyZones: BodyZone[] = [
  {
    id: 'head',
    name: 'Head & Face',
    frontCoords: { x: 140, y: 20, width: 80, height: 100 },
    backCoords: { x: 140, y: 20, width: 80, height: 100 }
  },
  {
    id: 'neck',
    name: 'Neck',
    frontCoords: { x: 155, y: 120, width: 50, height: 40 },
    backCoords: { x: 155, y: 120, width: 50, height: 40 }
  },
  {
    id: 'chest',
    name: 'Chest',
    frontCoords: { x: 120, y: 160, width: 120, height: 80 },
    backCoords: { x: 120, y: 160, width: 120, height: 80 }
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    frontCoords: { x: 130, y: 240, width: 100, height: 80 },
    backCoords: { x: 130, y: 240, width: 100, height: 80 }
  },
  {
    id: 'left_arm',
    name: 'Left Arm',
    frontCoords: { x: 60, y: 160, width: 60, height: 120 },
    backCoords: { x: 240, y: 160, width: 60, height: 120 }
  },
  {
    id: 'right_arm',
    name: 'Right Arm',
    frontCoords: { x: 240, y: 160, width: 60, height: 120 },
    backCoords: { x: 60, y: 160, width: 60, height: 120 }
  },
  {
    id: 'pelvis',
    name: 'Pelvis',
    frontCoords: { x: 130, y: 320, width: 100, height: 60 },
    backCoords: { x: 130, y: 320, width: 100, height: 60 }
  },
  {
    id: 'left_leg',
    name: 'Left Leg',
    frontCoords: { x: 110, y: 380, width: 60, height: 140 },
    backCoords: { x: 190, y: 380, width: 60, height: 140 }
  },
  {
    id: 'right_leg',
    name: 'Right Leg',
    frontCoords: { x: 190, y: 380, width: 60, height: 140 },
    backCoords: { x: 110, y: 380, width: 60, height: 140 }
  },
  {
    id: 'upper_back',
    name: 'Upper Back',
    frontCoords: { x: 0, y: 0, width: 0, height: 0 }, // Not visible from front
    backCoords: { x: 120, y: 160, width: 120, height: 80 }
  },
  {
    id: 'lower_back',
    name: 'Lower Back',
    frontCoords: { x: 0, y: 0, width: 0, height: 0 }, // Not visible from front
    backCoords: { x: 130, y: 240, width: 100, height: 80 }
  }
];

export default function BodyVisualization3D({ gender, age, onZonePress }: BodyVisualization3DProps) {
  const [isBackView, setIsBackView] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleZonePress = (zone: BodyZone) => {
    setSelectedZone(zone.id);
    setTimeout(() => {
      onZonePress(zone.id);
    }, 200);
  };

  const toggleView = () => {
    setIsBackView(!isBackView);
    setSelectedZone(null);
  };

  const getImageSource = () => {
    if (gender === 'male') {
      return isBackView 
        ? 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400'
        : 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400';
    } else {
      return isBackView
        ? 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400'
        : 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  };

  const getVisibleZones = () => {
    return bodyZones.filter(zone => {
      const coords = isBackView ? zone.backCoords : zone.frontCoords;
      return coords.width > 0 && coords.height > 0;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.rotateButton} onPress={toggleView}>
          {isBackView ? (
            <>
              <RotateCcw size={20} color="#2563EB" />
              <Text style={styles.rotateButtonText}>Front View</Text>
            </>
          ) : (
            <>
              <RotateCw size={20} color="#2563EB" />
              <Text style={styles.rotateButtonText}>Back View</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.viewIndicator}>
          <Text style={styles.viewIndicatorText}>
            {isBackView ? 'Back View' : 'Front View'}
          </Text>
        </View>
      </View>

      <View style={styles.modelContainer}>
        <View style={styles.bodyModel}>
          {/* Anatomical figure representation */}
          <View style={styles.anatomyContainer}>
            <View style={[styles.anatomyFigure, isBackView && styles.anatomyFigureBack]}>
              {/* Head */}
              <View style={[styles.bodyPart, styles.head]} />
              
              {/* Neck */}
              <View style={[styles.bodyPart, styles.neck]} />
              
              {/* Torso */}
              <View style={[styles.bodyPart, styles.torso]} />
              
              {/* Arms */}
              <View style={[styles.bodyPart, styles.leftArm]} />
              <View style={[styles.bodyPart, styles.rightArm]} />
              
              {/* Legs */}
              <View style={[styles.bodyPart, styles.leftLeg]} />
              <View style={[styles.bodyPart, styles.rightLeg]} />
            </View>
          </View>

          {/* Interactive zones overlay */}
          {getVisibleZones().map((zone) => {
            const coords = isBackView ? zone.backCoords : zone.frontCoords;
            return (
              <TouchableOpacity
                key={`${zone.id}-${isBackView ? 'back' : 'front'}`}
                style={[
                  styles.zoneOverlay,
                  {
                    left: coords.x,
                    top: coords.y,
                    width: coords.width,
                    height: coords.height,
                  },
                  selectedZone === zone.id && styles.zoneOverlaySelected
                ]}
                onPress={() => handleZonePress(zone)}
                activeOpacity={0.7}
              >
                <View style={styles.zoneLabel}>
                  <Text style={styles.zoneLabelText}>{zone.name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Tap on any body part to start symptom assessment
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  rotateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rotateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  viewIndicator: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewIndicatorText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  modelContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyModel: {
    position: 'relative',
    width: 360,
    height: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  anatomyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  anatomyFigure: {
    position: 'relative',
    width: 200,
    height: 480,
  },
  anatomyFigureBack: {
    transform: [{ scaleX: -1 }],
  },
  bodyPart: {
    position: 'absolute',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  head: {
    width: 60,
    height: 80,
    borderRadius: 30,
    left: 70,
    top: 0,
  },
  neck: {
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 85,
    top: 80,
  },
  torso: {
    width: 100,
    height: 160,
    borderRadius: 20,
    left: 50,
    top: 110,
  },
  leftArm: {
    width: 40,
    height: 120,
    borderRadius: 20,
    left: 10,
    top: 120,
  },
  rightArm: {
    width: 40,
    height: 120,
    borderRadius: 20,
    left: 150,
    top: 120,
  },
  leftLeg: {
    width: 45,
    height: 150,
    borderRadius: 22,
    left: 60,
    top: 270,
  },
  rightLeg: {
    width: 45,
    height: 150,
    borderRadius: 22,
    left: 95,
    top: 270,
  },
  zoneOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 8,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneOverlaySelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.4)',
    borderStyle: 'solid',
  },
  zoneLabel: {
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  zoneLabelText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
});