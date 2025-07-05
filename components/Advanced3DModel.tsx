import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { RotateCw, RotateCcw } from 'lucide-react-native';

interface Advanced3DModelProps {
  gender: 'male' | 'female';
  age: string;
  onZonePress: (zone: string) => void;
}

interface BodyZone {
  id: string;
  name: string;
  position: THREE.Vector3;
  radius: number;
}

const bodyZones: BodyZone[] = [
  { id: 'head', name: 'Head', position: new THREE.Vector3(0, 1.7, 0), radius: 0.15 },
  { id: 'neck', name: 'Neck', position: new THREE.Vector3(0, 1.5, 0), radius: 0.08 },
  { id: 'chest', name: 'Chest', position: new THREE.Vector3(0, 1.2, 0), radius: 0.2 },
  { id: 'abdomen', name: 'Abdomen', position: new THREE.Vector3(0, 0.9, 0), radius: 0.18 },
  { id: 'left_arm', name: 'Left Arm', position: new THREE.Vector3(-0.3, 1.2, 0), radius: 0.12 },
  { id: 'right_arm', name: 'Right Arm', position: new THREE.Vector3(0.3, 1.2, 0), radius: 0.12 },
  { id: 'pelvis', name: 'Pelvis', position: new THREE.Vector3(0, 0.6, 0), radius: 0.15 },
  { id: 'left_leg', name: 'Left Leg', position: new THREE.Vector3(-0.15, 0.3, 0), radius: 0.12 },
  { id: 'right_leg', name: 'Right Leg', position: new THREE.Vector3(0.15, 0.3, 0), radius: 0.12 },
];

export default function Advanced3DModel({ gender, age, onZonePress }: Advanced3DModelProps) {
  const [rotation, setRotation] = useState(0);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<Renderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const modelRef = useRef<THREE.Group>();
  const zonesRef = useRef<THREE.Group>();

  const createHumanModel = () => {
    const group = new THREE.Group();
    
    // Create basic human figure using primitive shapes
    const materials = {
      skin: new THREE.MeshPhongMaterial({ color: 0xfdbcb4 }),
      clothing: new THREE.MeshPhongMaterial({ color: 0x4a90e2 }),
    };

    // Head
    const headGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const head = new THREE.Mesh(headGeometry, materials.skin);
    head.position.set(0, 1.7, 0);
    head.userData = { zone: 'head' };
    group.add(head);

    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 8);
    const neck = new THREE.Mesh(neckGeometry, materials.skin);
    neck.position.set(0, 1.55, 0);
    neck.userData = { zone: 'neck' };
    group.add(neck);

    // Torso
    const torsoGeometry = new THREE.CylinderGeometry(0.18, 0.15, 0.6, 8);
    const torso = new THREE.Mesh(torsoGeometry, materials.clothing);
    torso.position.set(0, 1.1, 0);
    torso.userData = { zone: 'chest' };
    group.add(torso);

    // Abdomen
    const abdomenGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.3, 8);
    const abdomen = new THREE.Mesh(abdomenGeometry, materials.clothing);
    abdomen.position.set(0, 0.75, 0);
    abdomen.userData = { zone: 'abdomen' };
    group.add(abdomen);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.5, 8);
    
    const leftArm = new THREE.Mesh(armGeometry, materials.skin);
    leftArm.position.set(-0.25, 1.2, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.userData = { zone: 'left_arm' };
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, materials.skin);
    rightArm.position.set(0.25, 1.2, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.userData = { zone: 'right_arm' };
    group.add(rightArm);

    // Pelvis
    const pelvisGeometry = new THREE.CylinderGeometry(0.18, 0.15, 0.2, 8);
    const pelvis = new THREE.Mesh(pelvisGeometry, materials.clothing);
    pelvis.position.set(0, 0.55, 0);
    pelvis.userData = { zone: 'pelvis' };
    group.add(pelvis);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.8, 8);
    
    const leftLeg = new THREE.Mesh(legGeometry, materials.clothing);
    leftLeg.position.set(-0.1, 0.1, 0);
    leftLeg.userData = { zone: 'left_leg' };
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, materials.clothing);
    rightLeg.position.set(0.1, 0.1, 0);
    rightLeg.userData = { zone: 'right_leg' };
    group.add(rightLeg);

    return group;
  };

  const createInteractiveZones = () => {
    const zonesGroup = new THREE.Group();
    
    bodyZones.forEach(zone => {
      const geometry = new THREE.SphereGeometry(zone.radius, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      });
      
      const zoneMesh = new THREE.Mesh(geometry, material);
      zoneMesh.position.copy(zone.position);
      zoneMesh.userData = { zone: zone.id, name: zone.name };
      zonesGroup.add(zoneMesh);
    });

    return zonesGroup;
  };

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    if (Platform.OS === 'web') {
      // Web-specific 3D implementation would go here
      return;
    }

    const renderer = new Renderer({ gl });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create and add human model
    const humanModel = createHumanModel();
    scene.add(humanModel);

    // Create and add interactive zones
    const zones = createInteractiveZones();
    scene.add(zones);

    // Position camera
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 1, 0);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    modelRef.current = humanModel;
    zonesRef.current = zones;

    // Render loop
    const render = () => {
      requestAnimationFrame(render);
      
      // Apply rotation
      if (modelRef.current && zonesRef.current) {
        modelRef.current.rotation.y = rotation;
        zonesRef.current.rotation.y = rotation;
      }
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - Math.PI / 4);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + Math.PI / 4);
  };

  const handleZonePress = (zoneId: string) => {
    setSelectedZone(zoneId);
    setTimeout(() => {
      onZonePress(zoneId);
    }, 200);
  };

  // Fallback for web or when 3D is not available
  if (Platform.OS === 'web') {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          3D Model Preview
        </Text>
        <Text style={styles.fallbackSubtext}>
          {gender} • {age}
        </Text>
        <View style={styles.zoneButtons}>
          {bodyZones.map(zone => (
            <TouchableOpacity
              key={zone.id}
              style={styles.zoneButton}
              onPress={() => handleZonePress(zone.id)}
            >
              <Text style={styles.zoneButtonText}>{zone.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.rotateButton} onPress={handleRotateLeft}>
          <RotateCcw size={20} color="#2563EB" />
          <Text style={styles.rotateButtonText}>Rotate Left</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.rotateButton} onPress={handleRotateRight}>
          <RotateCw size={20} color="#2563EB" />
          <Text style={styles.rotateButtonText}>Rotate Right</Text>
        </TouchableOpacity>
      </View>

      <GLView style={styles.glView} onContextCreate={onContextCreate} />

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Rotate the model and tap on body zones to assess symptoms
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  glView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  instructions: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    textAlign: 'center',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  fallbackText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  fallbackSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 32,
  },
  zoneButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  zoneButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  zoneButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
});