export interface CheckIn {
  id: string;
  foodId: string;
  quantity: number;
  carbs: number;
  sodium: number;
  water: number;
  calories: number;
  timestamp: number;
  eventId?: string;
}