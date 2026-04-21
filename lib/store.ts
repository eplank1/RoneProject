import { Checkin, FoodItem, Race, Thresholds } from '@/types/models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  completeRace,
  createCheckin,
  createFoodItem,
  createRace,
  deleteFoodItem,
  deleteRaceById,
  getActiveRace,
  getAllRaces,
  getCheckinsForRace,
  getCheckinsForRaceAscending,
  getFoodItems,
  getRaceById,
  getThresholds,
  initializeDatabase,
  saveThresholds,
  updateFoodItem,
} from './db';
import { generateId } from './utils';

/**
 * Main app store hook.
 * Keeps the active race, saved history, thresholds, and food library in sync
 * with SQLite so screens can stay simple.
 */
export function useRaceNutritionStore() {
  const [ready, setReady] = useState(false);
  const [activeRace, setActiveRace] = useState<Race | null>(null);
  const [activeCheckins, setActiveCheckins] = useState<Checkin[]>([]);
  const [history, setHistory] = useState<Race[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds>(getThresholdsSafe());
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    const nextActiveRace = getActiveRace();
    setActiveRace(nextActiveRace);
    setActiveCheckins(nextActiveRace ? getCheckinsForRaceAscending(nextActiveRace.id) : []);
    setHistory(getAllRaces().filter((race) => race.status === 'completed'));
    setThresholds(getThresholds());
    setFoodItems(getFoodItems());
  }, []);

  const refreshAsync = useCallback(async () => {
    setRefreshing(true);
    try {
      refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  useEffect(() => {
    initializeDatabase();
    refresh();
    setReady(true);
  }, [refresh]);

  const startRace = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error('Please enter a race name.');
      if (activeRace) throw new Error('A race is already active. Stop it before starting a new one.');

      createRace({
        id: generateId('race'),
        name: trimmed,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
      });

      refresh();
    },
    [activeRace, refresh],
  );

  const stopRace = useCallback(() => {
    if (!activeRace) throw new Error('There is no active race to stop.');
    completeRace(activeRace.id, new Date().toISOString());
    refresh();
  }, [activeRace, refresh]);

  const addCheckin = useCallback(
    (payload: Omit<Checkin, 'id' | 'raceId' | 'timestamp'>) => {
      if (!activeRace) throw new Error('Start a race before adding a check-in.');

      createCheckin({
        id: generateId('checkin'),
        raceId: activeRace.id,
        timestamp: new Date().toISOString(),
        ...payload,
      });

      refresh();
    },
    [activeRace, refresh],
  );

  const addFoodItem = useCallback(
    (payload: Omit<FoodItem, 'id' | 'createdAt'>) => {
      createFoodItem({
        id: generateId('food'),
        createdAt: new Date().toISOString(),
        ...payload,
      });
      refresh();
    },
    [refresh],
  );

  const editFoodItem = useCallback(
    (payload: FoodItem) => {
      updateFoodItem(payload);
      refresh();
    },
    [refresh],
  );

  const removeFoodItem = useCallback(
    (id: string) => {
      deleteFoodItem(id);
      refresh();
    },
    [refresh],
  );

  const searchFoodItems = useCallback((query: string) => {
    return getFoodItems(query);
  }, []);

  const removeRace = useCallback(
    (raceId: string) => {
      deleteRaceById(raceId);
      refresh();
    },
    [refresh],
  );

  const updateThresholds = useCallback(
    (next: Thresholds) => {
      saveThresholds(next);
      refresh();
    },
    [refresh],
  );

  const getRaceDetails = useCallback((raceId: string) => {
    const race = getRaceById(raceId);
    if (!race) return null;

    return {
      race,
      checkins: getCheckinsForRaceAscending(raceId),
    };
  }, []);

  const historyWithCheckins = useMemo(
    () => history.map((race) => ({ race, checkins: getCheckinsForRace(race.id) })),
    [history],
  );

  return {
    ready,
    refreshing,
    activeRace,
    activeCheckins,
    history,
    historyWithCheckins,
    thresholds,
    foodItems,
    refresh,
    refreshAsync,
    startRace,
    stopRace,
    addCheckin,
    addFoodItem,
    editFoodItem,
    removeFoodItem,
    searchFoodItems,
    removeRace,
    updateThresholds,
    getRaceDetails,
  };
}

function getThresholdsSafe() {
  try {
    initializeDatabase();
    return getThresholds();
  } catch {
    return {
      calories: { minPerHour: 200, maxPerHour: 300 },
      carbs: { minPerHour: 30, maxPerHour: 60 },
      sodium: { minPerHour: 300, maxPerHour: 700 },
      water: { minPerHour: 12, maxPerHour: 28 },
    };
  }
}