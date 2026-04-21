import { formatDateTime } from '@/lib/utils';
import { Checkin } from '@/types/models';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  checkins: Checkin[];
  readOnly?: boolean;
};

/**
 * Shows the previously logged check-ins under the dashboard.
 * We reverse them in the UI so the newest entries appear first.
 */
export function PreviousCheckinsList({ checkins, readOnly = false }: Props) {
  const reversed = [...checkins].reverse();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{readOnly ? 'Race Check-Ins' : 'Previous Check-Ins'}</Text>

      {reversed.length === 0 ? (
        <Text style={styles.emptyText}>No check-ins yet.</Text>
      ) : (
        reversed.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.headerRow}>
              <Text style={styles.time}>{formatDateTime(item.timestamp)}</Text>
              {item.foodItemName ? <Text style={styles.foodPill}>{item.foodItemName}</Text> : null}
            </View>

            <Text style={styles.metrics}>
              {item.calories} kcal • {item.carbs} g carbs • {item.sodium} mg sodium • {item.water} oz water
            </Text>

            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  item: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
  },
  foodPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  metrics: {
    fontSize: 13,
    color: '#111827',
    marginTop: 6,
    lineHeight: 19,
  },
  notes: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});