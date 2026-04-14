import { getBandLabel, getIntakeBand, getMetricRatePerHour, summarizeRace } from '@/lib/analytics';
import { METRICS } from '@/lib/constants';
import { formatDateTime, formatDurationHours } from '@/lib/utils';
import { Checkin, Race, Thresholds } from '@/types/models';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  race: Race;
  checkins: Checkin[];
  thresholds: Thresholds;
  onDelete: (raceId: string) => void;
};

export function RaceSummaryCard({ race, checkins, thresholds, onDelete }: Props) {
  const summary = summarizeRace(race, checkins);

  const confirmDelete = () => {
    Alert.alert(
      'Delete race',
      `Are you sure you want to delete "${race.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(race.id) },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{race.name}</Text>
        <Pressable style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>

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
        const band = getIntakeBand(rate, metric.key, thresholds);

        return (
          <View key={metric.key} style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{totalValue} {metric.unit}</Text>
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.rate}>{rate} {metric.unit}/hr</Text>
              <Text style={[styles.badge, getBadgeStyle(band)]}>{getBandLabel(band)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function getBadgeStyle(
  band: 'critically low' | 'moderately low' | 'on target' | 'moderately high' | 'critically high' | 'no target'
) {
  switch (band) {
    case 'critically low':
      return styles.badgeCriticallyLow;
    case 'moderately low':
      return styles.badgeModeratelyLow;
    case 'on target':
      return styles.badgeOnTarget;
    case 'moderately high':
      return styles.badgeModeratelyHigh;
    case 'critically high':
      return styles.badgeCriticallyHigh;
    default:
      return styles.badgeNoTarget;
  }
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#991b1b',
    fontWeight: '800',
    fontSize: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontWeight: '800',
  },
  badgeNoTarget: {
    color: '#374151',
    backgroundColor: '#e5e7eb',
  },
  badgeCriticallyLow: {
    color: '#fff',
    backgroundColor: '#b91c1c',
  },
  badgeModeratelyLow: {
    color: '#92400e',
    backgroundColor: '#fde68a',
  },
  badgeOnTarget: {
    color: '#166534',
    backgroundColor: '#bbf7d0',
  },
  badgeModeratelyHigh: {
    color: '#9a3412',
    backgroundColor: '#fed7aa',
  },
  badgeCriticallyHigh: {
    color: '#fff',
    backgroundColor: '#7f1d1d',
  },
});