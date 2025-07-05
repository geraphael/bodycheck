import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Brain, Heart, Thermometer, Zap, Atom as Stomach, Bone, Eye, Ear, Settings as Lungs, Droplets, Baby, Users } from 'lucide-react-native';

interface SymptomCategorySelectorProps {
  gender: 'male' | 'female';
  age: string;
  onCategoryPress: (category: string) => void;
}

interface SymptomCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  commonSymptoms: string[];
}

const symptomCategories: SymptomCategory[] = [
  {
    id: 'neurological',
    name: 'Head & Brain',
    description: 'Headaches, dizziness, memory issues',
    icon: Brain,
    color: '#7C3AED',
    commonSymptoms: ['Headache', 'Dizziness', 'Memory issues']
  },
  {
    id: 'cardiovascular',
    name: 'Heart & Blood',
    description: 'Chest pain, heart racing, circulation',
    icon: Heart,
    color: '#DC2626',
    commonSymptoms: ['Chest pain', 'Heart racing', 'Shortness of breath']
  },
  {
    id: 'respiratory',
    name: 'Breathing & Lungs',
    description: 'Cough, breathing problems, chest tightness',
    icon: Lungs,
    color: '#0891B2',
    commonSymptoms: ['Cough', 'Hard to breathe', 'Wheezing']
  },
  {
    id: 'gastrointestinal',
    name: 'Stomach & Digestion',
    description: 'Stomach pain, nausea, bowel issues',
    icon: Stomach,
    color: '#059669',
    commonSymptoms: ['Nausea', 'Vomiting', 'Stomach pain']
  },
  {
    id: 'musculoskeletal',
    name: 'Muscles & Joints',
    description: 'Joint pain, muscle aches, stiffness',
    icon: Bone,
    color: '#D97706',
    commonSymptoms: ['Joint pain', 'Muscle aches', 'Stiffness']
  },
  {
    id: 'general',
    name: 'General Health',
    description: 'Fever, tiredness, weight changes',
    icon: Thermometer,
    color: '#F59E0B',
    commonSymptoms: ['Fever', 'Tiredness', 'Weight loss']
  },
  {
    id: 'dermatological',
    name: 'Skin & Hair',
    description: 'Rashes, itching, skin changes',
    icon: Droplets,
    color: '#EC4899',
    commonSymptoms: ['Rash', 'Itching', 'Skin changes']
  },
  {
    id: 'sensory',
    name: 'Eyes & Ears',
    description: 'Vision problems, hearing issues',
    icon: Eye,
    color: '#8B5CF6',
    commonSymptoms: ['Vision changes', 'Hearing loss', 'Eye pain']
  },
  {
    id: 'genitourinary',
    name: 'Urinary & Private Parts',
    description: 'Bathroom problems, pelvic pain',
    icon: Users,
    color: '#06B6D4',
    commonSymptoms: ['Bathroom changes', 'Pelvic pain', 'Discharge']
  },
  {
    id: 'pediatric',
    name: 'Child Health',
    description: 'Issues specific to children',
    icon: Baby,
    color: '#10B981',
    commonSymptoms: ['Crying', 'Eating problems', 'Sleep issues']
  },
];

export default function SymptomCategorySelector({ gender, age, onCategoryPress }: SymptomCategorySelectorProps) {
  const getFilteredCategories = () => {
    let filtered = [...symptomCategories];
    
    // Show pediatric category only for children
    if (!age.includes('0-12') && !age.includes('13-17')) {
      filtered = filtered.filter(cat => cat.id !== 'pediatric');
    }
    
    return filtered;
  };

  const filteredCategories = getFilteredCategories();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What area needs attention?</Text>
      <Text style={styles.subtitle}>
        Pick the category that best matches your symptoms
      </Text>
      
      <View style={styles.categoriesGrid}>
        {filteredCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { borderColor: category.color }]}
              onPress={() => onCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <IconComponent size={28} color="#FFFFFF" />
              </View>
              
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              
              <View style={styles.symptomsPreview}>
                <Text style={styles.symptomsLabel}>Common:</Text>
                <Text style={styles.symptomsText}>
                  {category.commonSymptoms.slice(0, 2).join(', ')}
                  {category.commonSymptoms.length > 2 ? '...' : ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  symptomsPreview: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  symptomsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
});