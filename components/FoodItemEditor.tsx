import { FoodItem } from '@/types/models';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  visible: boolean;
  item: FoodItem | null;
  onClose: () => void;
  onSave: (item: FoodItem) => void;
};

/**
 * Simple edit modal for saved food items.
 * Keeps the food library screen cleaner than placing all inputs inline.
 */
export function FoodItemEditor({ visible, item, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [sodium, setSodium] = useState('');
  const [water, setWater] = useState('');

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    setCalories(String(item.calories));
    setCarbs(String(item.carbs));
    setSodium(String(item.sodium));
    setWater(String(item.water));
  }, [item]);

  const save = () => {
    if (!item) return;

    const next = {
      ...item,
      name: name.trim(),
      calories: Number(calories || 0),
      carbs: Number(carbs || 0),
      sodium: Number(sodium || 0),
      water: Number(water || 0),
    };

    if (!next.name) {
      Alert.alert('Missing name', 'Please enter a food item name.');
      return;
    }

    if ([next.calories, next.carbs, next.sodium, next.water].some((value) => Number.isNaN(value) || value < 0)) {
      Alert.alert('Invalid values', 'Nutrition values must be non-negative numbers.');
      return;
    }

    onSave(next);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Edit Food Item</Text>

          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Calories" keyboardType="numeric" value={calories} onChangeText={setCalories} />
          <TextInput style={styles.input} placeholder="Carbs" keyboardType="numeric" value={carbs} onChangeText={setCarbs} />
          <TextInput style={styles.input} placeholder="Sodium" keyboardType="numeric" value={sodium} onChangeText={setSodium} />
          <TextInput style={styles.input} placeholder="Water" keyboardType="numeric" value={water} onChangeText={setWater} />

          <View style={styles.row}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.save]} onPress={save}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#e5e7eb',
  },
  save: {
    backgroundColor: '#111827',
  },
  cancelText: {
    color: '#111827',
    fontWeight: '800',
  },
  saveText: {
    color: '#fff',
    fontWeight: '800',
  },
});