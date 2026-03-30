import { Thresholds } from '@/types/models';
import { METRICS } from '@/lib/constants';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  value: Thresholds;
  onSave: (next: Thresholds) => void;
};

export function ThresholdEditor({ value, onSave }: Props) {
  const [draft, setDraft] = useState(() => cloneThresholds(value));

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(value), [draft, value]);

  const updateMetric = (metric: keyof Thresholds, field: 'minPerHour' | 'maxPerHour', input: string) => {
    setDraft((prev) => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [field]: input.trim() === '' ? null : Number(input),
      },
    }));
  };

  const save = () => {
    const invalid = METRICS.some(({ key }) => {
      const { minPerHour, maxPerHour } = draft[key];
      return [minPerHour, maxPerHour].some((num) => num !== null && (Number.isNaN(num) || num < 0));
    });

    if (invalid) {
      Alert.alert('Invalid thresholds', 'Please use empty values or non-negative numbers.');
      return;
    }

    onSave(draft);
    Alert.alert('Saved', 'Hourly thresholds updated successfully.');
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Hourly Intake Thresholds</Text>
        <Text style={styles.subtitle}>Set min and max targets per hour for each nutrition metric.</Text>

        {METRICS.map((metric) => (
          <View key={metric.key} style={styles.metricBlock}>
            <Text style={styles.metricTitle}>{metric.label} ({metric.unit}/hr)</Text>
            <View style={styles.row}>
              <Field
                label="Min per hour"
                value={draft[metric.key].minPerHour?.toString() ?? ''}
                onChangeText={(text) => updateMetric(metric.key, 'minPerHour', text)}
              />
              <Field
                label="Max per hour"
                value={draft[metric.key].maxPerHour?.toString() ?? ''}
                onChangeText={(text) => updateMetric(metric.key, 'maxPerHour', text)}
              />
            </View>
          </View>
        ))}

        <Pressable style={[styles.button, !dirty && styles.buttonDisabled]} onPress={save}>
          <Text style={styles.buttonText}>Save Thresholds</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={value} onChangeText={onChangeText} placeholder="Optional" />
    </View>
  );
}

function cloneThresholds(value: Thresholds): Thresholds {
  return JSON.parse(JSON.stringify(value));
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 13,
  },
  metricBlock: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 22,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
