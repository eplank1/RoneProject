import { createContext, PropsWithChildren, useContext } from 'react';
import { useRaceNutritionStore } from './store';

const RaceNutritionContext = createContext<ReturnType<typeof useRaceNutritionStore> | null>(null);

export function RaceNutritionProvider({ children }: PropsWithChildren) {
  const store = useRaceNutritionStore();
  return <RaceNutritionContext.Provider value={store}>{children}</RaceNutritionContext.Provider>;
}

export function useRaceNutrition() {
  const context = useContext(RaceNutritionContext);
  if (!context) throw new Error('useRaceNutrition must be used within RaceNutritionProvider');
  return context;
}
