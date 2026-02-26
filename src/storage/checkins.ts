import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckIn } from "../models/CheckIn";

const KEY = "CHECKINS";

export async function getCheckIns(): Promise<CheckIn[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveCheckIn(checkIn: CheckIn) {
  const existing = await getCheckIns();
  existing.push(checkIn);
  await AsyncStorage.setItem(KEY, JSON.stringify(existing));
}