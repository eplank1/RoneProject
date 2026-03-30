import { RaceNutritionProvider } from '@/lib/RaceNutritionContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <RaceNutritionProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </RaceNutritionProvider>
  );
}
