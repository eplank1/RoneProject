export type MetricKey = 'calories' | 'carbs' | 'sodium' | 'water';

export type MetricThreshold = {
  minPerHour: number | null;
  maxPerHour: number | null;
};

export type Thresholds = Record<MetricKey, MetricThreshold>;

export type RaceStatus = 'active' | 'completed';

export type Race = {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  status: RaceStatus;
};

export type Checkin = {
  id: string;
  raceId: string;
  timestamp: string;
  calories: number;
  carbs: number;
  sodium: number;
  water: number;
  notes: string | null;
  foodItemName: string | null;
};

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  sodium: number;
  water: number;
  createdAt: string;
};

export type RaceWithCheckins = {
  race: Race;
  checkins: Checkin[];
};

export type RaceSummary = {
  totalCalories: number;
  totalCarbs: number;
  totalSodium: number;
  totalWater: number;
  durationHours: number;
};

export type IntakeBand = 
| 'critically low'
| 'moderately low'
| 'on target'
| 'moderately high'
| 'critically high'
| 'no target';