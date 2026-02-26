import AsyncStorage from "@react-native-async-storage/async-storage";
import { Event } from "../models/Event";

const KEY = "ACTIVE_EVENT";

export async function setActiveEvent(event: Event) {
  await AsyncStorage.setItem(KEY, JSON.stringify(event));
}

export async function getActiveEvent(): Promise<Event | null> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}