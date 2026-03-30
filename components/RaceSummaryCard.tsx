import { METRICS } from '@/lib/constants';
import { formatDateTime, formatDurationHours } from '@/lib/utils';
import { summarizeRace, getMetricRatePerHour, getThresholdStatus, getStatusLabel } from '@/lib/analytics';
import { Checkin, Race, Thresholds } from '@/types/models';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  race: Race;
  checkins: Checkin[];
  thresholds: Thresholds;
};

export function RaceSummaryCard({ race, checkins, thresholds }: Props) {
  const summary = summarizeRace(race, checkins);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{race.name}</Text>
      <Text style={styles.meta}>Started: {formatDateTime(race.startTime)}</Text>
      <Text style={styles.meta}>Ended: {formatDateTime(race.endTime)}</Text>
      <Text style={styles.meta}>Duration: {formatDurationHours(summary.durationHours)}</Text>
      <Text style={styles.meta}>Check-ins: {checkins.length}</Text>

      <View style={styles.divider} />

      {METRICS.map((metric) => {
        const totalValue =
          metric.key === 'calories' ? summary.totalCalories :
          metric.key === 'carbs' ? summary.totalCarbs :
          metric.key === 'sodium' ? summary.totalSodium :
          summary.totalWater;

        const rate = getMetricRatePerHour(race, checkins, metric.key);
        const status = getThresholdStatus(rate, metric.key, thresholds);

        return (
          <View key={metric.key} style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{totalValue} {metric.unit}</Text>
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.rate}>{rate} {metric.unit}/hr</Text>
              <Text style={[styles.badge, status === 'low' && styles.low, status === 'high' && styles.high]}>{getStatusLabel(status)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    marginTop: 2,
  },
  metricRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rate: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '700',
  },
  badge: {
    fontSize: 12,
    color: '#166534',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  low: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
  },
  high: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
  },
});
