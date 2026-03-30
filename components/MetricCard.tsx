import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  status?: 'ok' | 'low' | 'high';
};

export function MetricCard({ title, value, subtitle, status = 'ok' }: Props) {
  return (
    <View style={[styles.card, status === 'low' && styles.low, status === 'high' && styles.high]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
    flex: 1,
  },
  low: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  high: {
    borderColor: '#ef4444',
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
});
