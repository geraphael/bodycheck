import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface AgeSelectorProps {
  selectedAge: string;
  onAgeSelect: (ageRange: string) => void;
}

const ageRanges = [
  { id: '0-12', label: '0-12 years', description: 'Child' },
  { id: '13-17', label: '13-17 years', description: 'Adolescent' },
  { id: '18-30', label: '18-30 years', description: 'Young Adult' },
  { id: '31-50', label: '31-50 years', description: 'Adult' },
  { id: '51-65', label: '51-65 years', description: 'Middle Age' },
  { id: '65+', label: '65+ years', description: 'Senior' },
];

export default function AgeSelector({ selectedAge, onAgeSelect }: AgeSelectorProps) {
  return (
    <View style={styles.container}>
      {ageRanges.map((range) => (
        <TouchableOpacity
          key={range.id}
          style={[
            styles.ageButton,
            selectedAge === range.id && styles.ageButtonActive
          ]}
          onPress={() => onAgeSelect(range.id)}
        >
          <Text style={[
            styles.ageLabel,
            selectedAge === range.id && styles.ageLabelActive
          ]}>
            {range.label}
          </Text>
          <Text style={[
            styles.ageDescription,
            selectedAge === range.id && styles.ageDescriptionActive
          ]}>
            {range.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  ageButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ageButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  ageLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ageLabelActive: {
    color: '#2563EB',
  },
  ageDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ageDescriptionActive: {
    color: '#2563EB',
  },
});