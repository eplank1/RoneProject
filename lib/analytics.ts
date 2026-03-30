import { Checkin, MetricKey, Race, RaceSummary, Thresholds } from '@/types/models';
import { round } from './utils';

export function getRaceEndTime(race: Race, checkins: Checkin[]) {
  return race.endTime ?? checkins.at(-1)?.timestamp ?? race.startTime;
}

export function getDurationHours(race: Race, checkins: Checkin[]) {
  const start = new Date(race.startTime).getTime();
  const end = new Date(getRaceEndTime(race, checkins)).getTime();
  const diff = Math.max(1, end - start);
  return diff / (1000 * 60 * 60);
}

export function summarizeRace(race: Race, checkins: Checkin[]): RaceSummary {
  const totals = checkins.reduce(
    (acc, item) => {
      acc.totalCalories += item.calories;
      acc.totalCarbs += item.carbs;
      acc.totalSodium += item.sodium;
      acc.totalWater += item.water;
      return acc;
    },
    { totalCalories: 0, totalCarbs: 0, totalSodium: 0, totalWater: 0 },
  );

  return {
    ...totals,
    durationHours: round(getDurationHours(race, checkins), 2),
  };
}

export function getHourlyRate(total: number, durationHours: number) {
  if (durationHours <= 0) return 0;
  return round(total / durationHours, 2);
}

export function getMetricTotal(checkins: Checkin[], metric: MetricKey) {
  return round(checkins.reduce((sum, item) => sum + item[metric], 0), 2);
}

export function getMetricRatePerHour(race: Race, checkins: Checkin[], metric: MetricKey) {
  return getHourlyRate(getMetricTotal(checkins, metric), getDurationHours(race, checkins));
}

export function getThresholdStatus(valuePerHour: number, metric: MetricKey, thresholds: Thresholds) {
  const threshold = thresholds[metric];
  if (threshold.minPerHour !== null && valuePerHour < threshold.minPerHour) return 'low';
  if (threshold.maxPerHour !== null && valuePerHour > threshold.maxPerHour) return 'high';
  return 'ok';
}

export function getStatusLabel(status: 'low' | 'high' | 'ok') {
  if (status === 'low') return 'Below range';
  if (status === 'high') return 'Above range';
  return 'In range';
}

export function buildGraphSeries(race: Race, checkins: Checkin[], metric: MetricKey) {
  const start = new Date(race.startTime).getTime();
  let runningTotal = 0;

  const points = checkins.map((item) => {
    runningTotal += item[metric];
    const elapsedHours = (new Date(item.timestamp).getTime() - start) / (1000 * 60 * 60);
    return {
      x: round(Math.max(0, elapsedHours), 2),
      y: round(runningTotal, 2),
    };
  });

  if (points.length === 0) {
    return [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
  }

  if (points.length === 1) {
    return [{ x: 0, y: 0 }, points[0]];
  }

  return points;
}
