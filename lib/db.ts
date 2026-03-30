import { Checkin, Race, Thresholds } from '@/types/models';
import * as SQLite from 'expo-sqlite';
import { DEFAULT_THRESHOLDS } from './constants';

export const db = SQLite.openDatabaseSync('race-nutrition.db');

export function initializeDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS races (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY NOT NULL,
      race_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      calories REAL NOT NULL,
      carbs REAL NOT NULL,
      sodium REAL NOT NULL,
      water REAL NOT NULL,
      notes TEXT,
      FOREIGN KEY (race_id) REFERENCES races(id)
    );

    CREATE TABLE IF NOT EXISTS thresholds (
      id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
      calories_min_per_hour REAL,
      calories_max_per_hour REAL,
      carbs_min_per_hour REAL,
      carbs_max_per_hour REAL,
      sodium_min_per_hour REAL,
      sodium_max_per_hour REAL,
      water_min_per_hour REAL,
      water_max_per_hour REAL
    );
  `);

  const row = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM thresholds');
  if (!row || row.count === 0) {
    db.runSync(
      `INSERT INTO thresholds (
        id,
        calories_min_per_hour,
        calories_max_per_hour,
        carbs_min_per_hour,
        carbs_max_per_hour,
        sodium_min_per_hour,
        sodium_max_per_hour,
        water_min_per_hour,
        water_max_per_hour
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        1,
        DEFAULT_THRESHOLDS.calories.minPerHour,
        DEFAULT_THRESHOLDS.calories.maxPerHour,
        DEFAULT_THRESHOLDS.carbs.minPerHour,
        DEFAULT_THRESHOLDS.carbs.maxPerHour,
        DEFAULT_THRESHOLDS.sodium.minPerHour,
        DEFAULT_THRESHOLDS.sodium.maxPerHour,
        DEFAULT_THRESHOLDS.water.minPerHour,
        DEFAULT_THRESHOLDS.water.maxPerHour,
      ],
    );
  }
}

export function getActiveRace(): Race | null {
  const race = db.getFirstSync<any>(
    `SELECT id, name, start_time, end_time, status
     FROM races
     WHERE status = 'active'
     ORDER BY start_time DESC
     LIMIT 1`,
  );

  return race ? mapRace(race) : null;
}

export function getAllRaces(): Race[] {
  const rows = db.getAllSync<any>(
    `SELECT id, name, start_time, end_time, status
     FROM races
     ORDER BY start_time DESC`,
  );

  return rows.map(mapRace);
}

export function getCheckinsForRace(raceId: string): Checkin[] {
  const rows = db.getAllSync<any>(
    `SELECT id, race_id, timestamp, calories, carbs, sodium, water, notes
     FROM checkins
     WHERE race_id = ?
     ORDER BY timestamp ASC`,
    [raceId],
  );

  return rows.map(mapCheckin);
}

export function createRace(race: Race) {
  db.runSync(
    `INSERT INTO races (id, name, start_time, end_time, status)
     VALUES (?, ?, ?, ?, ?)`,
    [race.id, race.name, race.startTime, race.endTime, race.status],
  );
}

export function completeRace(raceId: string, endTime: string) {
  db.runSync(
    `UPDATE races
     SET end_time = ?, status = 'completed'
     WHERE id = ?`,
    [endTime, raceId],
  );
}

export function createCheckin(checkin: Checkin) {
  db.runSync(
    `INSERT INTO checkins (id, race_id, timestamp, calories, carbs, sodium, water, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      checkin.id,
      checkin.raceId,
      checkin.timestamp,
      checkin.calories,
      checkin.carbs,
      checkin.sodium,
      checkin.water,
      checkin.notes,
    ],
  );
}

export function getThresholds(): Thresholds {
  const row = db.getFirstSync<any>(
    `SELECT calories_min_per_hour, calories_max_per_hour,
            carbs_min_per_hour, carbs_max_per_hour,
            sodium_min_per_hour, sodium_max_per_hour,
            water_min_per_hour, water_max_per_hour
     FROM thresholds
     WHERE id = 1`,
  );

  if (!row) return DEFAULT_THRESHOLDS;

  return {
    calories: {
      minPerHour: valueOrNull(row.calories_min_per_hour),
      maxPerHour: valueOrNull(row.calories_max_per_hour),
    },
    carbs: {
      minPerHour: valueOrNull(row.carbs_min_per_hour),
      maxPerHour: valueOrNull(row.carbs_max_per_hour),
    },
    sodium: {
      minPerHour: valueOrNull(row.sodium_min_per_hour),
      maxPerHour: valueOrNull(row.sodium_max_per_hour),
    },
    water: {
      minPerHour: valueOrNull(row.water_min_per_hour),
      maxPerHour: valueOrNull(row.water_max_per_hour),
    },
  };
}

export function saveThresholds(thresholds: Thresholds) {
  db.runSync(
    `UPDATE thresholds
     SET calories_min_per_hour = ?, calories_max_per_hour = ?,
         carbs_min_per_hour = ?, carbs_max_per_hour = ?,
         sodium_min_per_hour = ?, sodium_max_per_hour = ?,
         water_min_per_hour = ?, water_max_per_hour = ?
     WHERE id = 1`,
    [
      thresholds.calories.minPerHour,
      thresholds.calories.maxPerHour,
      thresholds.carbs.minPerHour,
      thresholds.carbs.maxPerHour,
      thresholds.sodium.minPerHour,
      thresholds.sodium.maxPerHour,
      thresholds.water.minPerHour,
      thresholds.water.maxPerHour,
    ],
  );
}

function mapRace(row: any): Race {
  return {
    id: row.id,
    name: row.name,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
  };
}

function mapCheckin(row: any): Checkin {
  return {
    id: row.id,
    raceId: row.race_id,
    timestamp: row.timestamp,
    calories: Number(row.calories),
    carbs: Number(row.carbs),
    sodium: Number(row.sodium),
    water: Number(row.water),
    notes: row.notes,
  };
}

function valueOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}
