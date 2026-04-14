import { FoodItem } from '@/types/models';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  foodItems: FoodItem[];
  onSubmit: (values: {
    calories: number;
    carbs: number;
    sodium: number;
    water: number;
    notes: string | null;
    foodItemName: string | null;
  }) => void;
  onSaveFoodItem: (values: {
    name: string;
    calories: number;
    carbs: number;
    sodium: number;
    water: number;
  }) => void;
};

const INITIAL = {
  foodItemName: '',
  calories: '',
  carbs: '',
  sodium: '',
  water: '',
  notes: '',
  saveForLater: false,
};

export function CheckinForm({ foodItems, onSubmit, onSaveFoodItem }: Props) {
  const [form, setForm] = useState(INITIAL);

  const applyFoodItem = (item: FoodItem) => {
    setForm((prev) => ({
      ...prev,
      foodItemName: item.name,
      calories: item.calories.toString(),
      carbs: item.carbs.toString(),
      sodium: item.sodium.toString(),
      water: item.water.toString(),
    }));
  };

  const submit = () => {
    const calories = Number(form.calories || 0);
    const carbs = Number(form.carbs || 0);
    const sodium = Number(form.sodium || 0);
    const water = Number(form.water || 0);

    if ([calories, carbs, sodium, water].some((value) => Number.isNaN(value) || value < 0)) {
      Alert.alert('Invalid input', 'Please enter valid non-negative numbers.');
      return;
    }

    const trimmedFoodName = form.foodItemName.trim();

    if (form.saveForLater && !trimmedFoodName) {
      Alert.alert('Food item name required', 'Enter a food item name before saving it for future use.');
      return;
    }

    if (form.saveForLater) {
      onSaveFoodItem({
        name: trimmedFoodName,
        calories,
        carbs,
        sodium,
        water,
      });
    }

    onSubmit({
      calories,
      carbs,
      sodium,
      water,
      notes: form.notes.trim() ? form.notes.trim() : null,
      foodItemName: trimmedFoodName ? trimmedFoodName : null,
    });

    setForm(INITIAL);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add Check-In</Text>

      {foodItems.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Saved Food Items</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {foodItems.map((item) => (
              <Pressable key={item.id} style={styles.chip} onPress={() => applyFoodItem(item)}>
                <Text style={styles.chipText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={styles.field}>
        <Text style={styles.label}>Food Item Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Maurten Gel 100"
          value={form.foodItemName}
          onChangeText={(value) => setForm((prev) => ({ ...prev, foodItemName: value }))}
        />
      </View>

      <View style={styles.grid}>
        <Input label="Calories (kcal)" value={form.calories} onChangeText={(value) => setForm((prev) => ({ ...prev, calories: value }))} />
        <Input label="Carbs (g)" value={form.carbs} onChangeText={(value) => setForm((prev) => ({ ...prev, carbs: value }))} />
        <Input label="Sodium (mg)" value={form.sodium} onChangeText={(value) => setForm((prev) => ({ ...prev, sodium: value }))} />
        <Input label="Water (oz)" value={form.water} onChangeText={(value) => setForm((prev) => ({ ...prev, water: value }))} />
      </View>

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchTitle}>Save as reusable food item</Text>
          <Text style={styles.switchSubtitle}>Adds this food item to your future quick-select list.</Text>
        </View>
        <Switch
          value={form.saveForLater}
          onValueChange={(value) => setForm((prev) => ({ ...prev, saveForLater: value }))}
        />
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
    <View style={styles.fieldHalf}>
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
  sectionLabel: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 8,
    fontWeight: '700',
  },
  chipsRow: {
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipText: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  field: {
    width: '100%',
    marginBottom: 10,
  },
  fieldHalf: {
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
  switchRow: {
    marginTop: 12,
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
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