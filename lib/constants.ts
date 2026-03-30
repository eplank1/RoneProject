import { MetricKey, Thresholds } from '@/types/models';

export const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'water', label: 'Water', unit: 'oz' },
];

export const DEFAULT_THRESHOLDS: Thresholds = {
  calories: { minPerHour: 0, maxPerHour: 400 },
  carbs: { minPerHour: 0, maxPerHour: 120 },
  sodium: { minPerHour: 0, maxPerHour: 1500 },
  water: { minPerHour: 0, maxPerHour: 60 },
};
