import { Checkin, IntakeBand, MetricKey, Race, RaceSummary, Thresholds } from '@/types/models';
import { THRESHOLD_BANDS } from './constants';
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

function getTargetMidpoint(metric: MetricKey, thresholds: Thresholds): number | null {
  const threshold = thresholds[metric];
  const { minPerHour, maxPerHour } = threshold;

  if (minPerHour !== null && maxPerHour !== null) {
    return (minPerHour + maxPerHour) / 2;
  }

  if (minPerHour !== null) return minPerHour;
  if (maxPerHour !== null) return maxPerHour;

  return null;
}

export function getThresholdRatio(valuePerHour: number, metric: MetricKey, thresholds: Thresholds): number | null {
  const target = getTargetMidpoint(metric, thresholds);
  if (!target || target <= 0) return null;
  return round(valuePerHour / target, 2);
}

export function getIntakeBand(valuePerHour: number, metric: MetricKey, thresholds: Thresholds): IntakeBand {
  const ratio = getThresholdRatio(valuePerHour, metric, thresholds);
  if (ratio === null) return 'no target';

  if (ratio < THRESHOLD_BANDS.CRITICALLY_LOW) return 'critically low';
  if (ratio < THRESHOLD_BANDS.MODERATELY_LOW) return 'moderately low';
  if (ratio <= THRESHOLD_BANDS.ON_TARGET) return 'on target';
  if (ratio <= THRESHOLD_BANDS.MODERATELY_HIGH) return 'moderately high';
  return 'critically high';
}

export function getBandLabel(band: IntakeBand) {
  switch (band) {
    case 'critically low':
      return 'Critically Low';
    case 'moderately low':
      return 'Moderately Low';
    case 'on target':
      return 'On Target';
    case 'moderately high':
      return 'Moderately High';
    case 'critically high':
      return 'Critically High';
    default:
      return 'No Target';
  }
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