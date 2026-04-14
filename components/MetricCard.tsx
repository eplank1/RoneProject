import { IntakeBand } from '@/types/models';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  band?: IntakeBand;
};

export function MetricCard({ title, value, subtitle, band = 'no target' }: Props) {
  return (
    <View style={[styles.card, getBandStyle(band)]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={[styles.badge, getBadgeStyle(band)]}>{getBandText(band)}</Text>
    </View>
  );
}

function getBandText(band: IntakeBand) {
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

function getBandStyle(band: IntakeBand) {
  switch (band) {
    case 'critically low':
      return styles.criticallyLow;
    case 'moderately low':
      return styles.moderatelyLow;
    case 'on target':
      return styles.onTarget;
    case 'moderately high':
      return styles.moderatelyHigh;
    case 'critically high':
      return styles.criticallyHigh;
    default:
      return styles.noTarget;
  }
}

function getBadgeStyle(band: IntakeBand) {
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
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 6,
    flex: 1,
  },
  noTarget: {
    borderColor: '#d1d5db',
  },
  criticallyLow: {
    borderColor: '#991b1b',
    backgroundColor: '#fef2f2',
  },
  moderatelyLow: {
    borderColor: '#d97706',
    backgroundColor: '#fffbeb',
  },
  onTarget: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  moderatelyHigh: {
    borderColor: '#c2410c',
    backgroundColor: '#fff7ed',
  },
  criticallyHigh: {
    borderColor: '#7f1d1d',
    backgroundColor: '#fef2f2',
  },
  title: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '600',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 4,
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