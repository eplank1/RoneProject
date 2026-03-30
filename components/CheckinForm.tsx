import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  onSubmit: (values: {
    calories: number;
    carbs: number;
    sodium: number;
    water: number;
    notes: string | null;
  }) => void;
};

const INITIAL = {
  calories: '',
  carbs: '',
  sodium: '',
  water: '',
  notes: '',
};

export function CheckinForm({ onSubmit }: Props) {
  const [form, setForm] = useState(INITIAL);

  const submit = () => {
    const calories = Number(form.calories || 0);
    const carbs = Number(form.carbs || 0);
    const sodium = Number(form.sodium || 0);
    const water = Number(form.water || 0);

    if ([calories, carbs, sodium, water].some((value) => Number.isNaN(value) || value < 0)) {
      Alert.alert('Invalid input', 'Please enter valid non-negative numbers.');
      return;
    }

    onSubmit({
      calories,
      carbs,
      sodium,
      water,
      notes: form.notes.trim() ? form.notes.trim() : null,
    });
    setForm(INITIAL);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add Check-In</Text>
      <View style={styles.grid}>
        <Input label="Calories (kcal)" value={form.calories} onChangeText={(value) => setForm((prev) => ({ ...prev, calories: value }))} />
        <Input label="Carbs (g)" value={form.carbs} onChangeText={(value) => setForm((prev) => ({ ...prev, carbs: value }))} />
        <Input label="Sodium (mg)" value={form.sodium} onChangeText={(value) => setForm((prev) => ({ ...prev, sodium: value }))} />
        <Input label="Water (oz)" value={form.water} onChangeText={(value) => setForm((prev) => ({ ...prev, water: value }))} />
      </View>
      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Notes (optional)"
        value={form.notes}
        onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))}
        multiline
      />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Save Check-In</Text>
      </Pressable>
    </View>
  );
}

function Input({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
        placeholder="0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  field: {
    width: '47%',
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
    backgroundColor: '#fff',
  },
  notes: {
    marginTop: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
