import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { CheckIn } from "../../src/models/CheckIn";
import { getCheckIns } from "../../src/storage/checkins";

export default function Summary() {
  const [totals, setTotals] = useState({
    carbs: 0,
    sodium: 0,
    water: 0,
    calories: 0
  });

  useEffect(() => {
    async function load() {
      const checkins: CheckIn[] = await getCheckIns();

      const sum = checkins.reduce(
        (acc, c) => ({
          carbs: acc.carbs + c.carbs,
          sodium: acc.sodium + c.sodium,
          water: acc.water + c.water,
          calories: acc.calories + c.calories
        }),
        { carbs: 0, sodium: 0, water: 0, calories: 0 }
      );

      setTotals(sum);
    }

    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Carbs: {totals.carbs} g</Text>
      <Text>Sodium: {totals.sodium} mg</Text>
      <Text>Water: {totals.water} ml</Text>
      <Text>Calories: {totals.calories}</Text>
    </View>
  );
}