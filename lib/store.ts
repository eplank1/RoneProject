import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  completeRace,
  createCheckin,
  createRace,
  getActiveRace,
  getAllRaces,
  getCheckinsForRace,
  getThresholds,
  initializeDatabase,
  saveThresholds,
} from './db';
import { Checkin, Race, Thresholds } from '@/types/models';
import { generateId } from './utils';

export function useRaceNutritionStore() {
  const [ready, setReady] = useState(false);
  const [activeRace, setActiveRace] = useState<Race | null>(null);
  const [activeCheckins, setActiveCheckins] = useState<Checkin[]>([]);
  const [history, setHistory] = useState<Race[]>([]);
  const [thresholds, setThresholds] = useState<Thresholds>(getThresholdsSafe());

  const refresh = useCallback(() => {
    const nextActiveRace = getActiveRace();
    setActiveRace(nextActiveRace);
    setActiveCheckins(nextActiveRace ? getCheckinsForRace(nextActiveRace.id) : []);
    setHistory(getAllRaces().filter((race) => race.status === 'completed'));
    setThresholds(getThresholds());
  }, []);

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

  const updateThresholds = useCallback(
    (next: Thresholds) => {
      saveThresholds(next);
      refresh();
    },
    [refresh],
  );

  const historyWithCheckins = useMemo(
    () => history.map((race) => ({ race, checkins: getCheckinsForRace(race.id) })),
    [history],
  );

  return {
    ready,
    activeRace,
    activeCheckins,
    history,
    historyWithCheckins,
    thresholds,
    refresh,
    startRace,
    stopRace,
    addCheckin,
    updateThresholds,
  };
}

function getThresholdsSafe() {
  try {
    initializeDatabase();
    return getThresholds();
  } catch {
    return {
      calories: { minPerHour: 0, maxPerHour: 400 },
      carbs: { minPerHour: 0, maxPerHour: 120 },
      sodium: { minPerHour: 0, maxPerHour: 1500 },
      water: { minPerHour: 0, maxPerHour: 60 },
    };
  }
}
