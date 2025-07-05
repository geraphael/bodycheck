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
    name: 'Neurological',
    description: 'Head, brain, and nervous system',
    icon: Brain,
    color: '#7C3AED',
    commonSymptoms: ['Headache', 'Dizziness', 'Memory issues', 'Confusion']
  },
  {
    id: 'cardiovascular',
    name: 'Heart & Circulation',
    description: 'Heart, blood vessels, and circulation',
    icon: Heart,
    color: '#DC2626',
    commonSymptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Swelling']
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    description: 'Lungs, breathing, and airways',
    icon: Lungs,
    color: '#0891B2',
    commonSymptoms: ['Cough', 'Shortness of breath', 'Wheezing', 'Chest tightness']
  },
  {
    id: 'gastrointestinal',
    name: 'Digestive System',
    description: 'Stomach, intestines, and digestion',
    icon: Stomach,
    color: '#059669',
    commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain']
  },
  {
    id: 'musculoskeletal',
    name: 'Muscles & Bones',
    description: 'Muscles, bones, and joints',
    icon: Bone,
    color: '#D97706',
    commonSymptoms: ['Joint pain', 'Muscle aches', 'Stiffness', 'Swelling']
  },
  {
    id: 'general',
    name: 'General Symptoms',
    description: 'Fever, fatigue, and overall wellness',
    icon: Thermometer,
    color: '#F59E0B',
    commonSymptoms: ['Fever', 'Fatigue', 'Weight loss', 'Night sweats']
  },
  {
    id: 'dermatological',
    name: 'Skin & Hair',
    description: 'Skin conditions and changes',
    icon: Droplets,
    color: '#EC4899',
    commonSymptoms: ['Rash', 'Itching', 'Skin changes', 'Hair loss']
  },
  {
    id: 'sensory',
    name: 'Eyes & Ears',
    description: 'Vision, hearing, and sensory issues',
    icon: Eye,
    color: '#8B5CF6',
    commonSymptoms: ['Vision changes', 'Hearing loss', 'Eye pain', 'Ear pain']
  },
  {
    id: 'genitourinary',
    name: 'Urinary & Reproductive',
    description: 'Urinary and reproductive health',
    icon: Users,
    color: '#06B6D4',
    commonSymptoms: ['Urination changes', 'Pelvic pain', 'Discharge', 'Sexual health']
  },
  {
    id: 'pediatric',
    name: 'Child-Specific',
    description: 'Symptoms specific to children',
    icon: Baby,
    color: '#10B981',
    commonSymptoms: ['Crying', 'Feeding issues', 'Sleep problems', 'Development concerns']
  },
];

export default function SymptomCategorySelector({ gender, age, onCategoryPress }: SymptomCategorySelectorProps) {
  const getFilteredCategories = () => {
    let filtered = [...symptomCategories];
    
    // Show pediatric category only for children
    if (!age.includes('0-12') && !age.includes('13-17')) {
      filtered = filtered.filter(cat => cat.id !== 'pediatric');
    }
    
    // Add gender-specific filtering if needed
    // This could be expanded based on medical requirements
    
    return filtered;
  };

  const filteredCategories = getFilteredCategories();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Symptom Category</Text>
      <Text style={styles.subtitle}>
        Choose the category that best matches your primary concern
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
                <Text style={styles.symptomsLabel}>Common symptoms:</Text>
                <Text style={styles.symptomsText}>
                  {category.commonSymptoms.slice(0, 2).join(', ')}
                  {category.commonSymptoms.length > 2 && '...'}
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