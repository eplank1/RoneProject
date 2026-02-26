import { randomUUID } from "expo-crypto";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FOODS } from "../../src/data/foods";
import { CheckIn } from "../../src/models/CheckIn";
import { Food } from "../../src/models/Food";
import { saveCheckIn } from "../../src/storage/checkins";
import { getActiveEvent } from "../../src/storage/event";

export default function RaceCheckIn() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!selectedFood) {
      Alert.alert("Select a food first");
      return;
    }

    const qty = parseFloat(quantity);

    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Enter a valid quantity");
      return;
    }

    setSaving(true);

    const activeEvent = await getActiveEvent();

    const checkIn: CheckIn = {
      id: randomUUID(),
      foodId: selectedFood.id,
      quantity: qty,
      carbs: selectedFood.carbs * qty,
      sodium: selectedFood.sodium * qty,
      water: selectedFood.water * qty,
      calories: selectedFood.calories * qty,
      timestamp: Date.now(),
      eventId: activeEvent?.id
    };

    await saveCheckIn(checkIn);

    setSelectedFood(null);
    setQuantity("1");
    setSaving(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Check-In</Text>

      {/* FOOD SELECTION */}
      <Text style={styles.section}>Select Food</Text>
      <View style={styles.foodList}>
        {FOODS.map(food => (
          <Pressable
            key={food.id}
            style={[
              styles.foodButton,
              selectedFood?.id === food.id && styles.foodButtonSelected
            ]}
            onPress={() => setSelectedFood(food)}
          >
            <Text style={styles.foodText}>{food.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* QUANTITY INPUT */}
      {selectedFood && (
        <>
          <Text style={styles.section}>Quantity</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />

          <Pressable
            style={[styles.saveButton, saving && styles.disabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveText}>
              {saving ? "Saving..." : "Save Check-In"}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8
  },
  foodList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  foodButton: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10
  },
  foodButtonSelected: {
    backgroundColor: "#cce5ff",
    borderColor: "#3399ff"
  },
  foodText: {
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 16
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  disabled: {
    opacity: 0.6
  }
});