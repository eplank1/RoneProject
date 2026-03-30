import { ThresholdEditor } from '@/components/ThresholdEditor';
import { useRaceNutrition } from '@/lib/RaceNutritionContext';
import { StyleSheet, Text, View } from 'react-native';

export default function ThresholdsScreen() {
  const { ready, thresholds, updateThresholds } = useRaceNutrition();

  if (!ready) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return <ThresholdEditor value={thresholds} onSave={updateThresholds} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
