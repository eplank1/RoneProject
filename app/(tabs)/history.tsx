import { RaceSummaryCard } from '@/components/RaceSummaryCard';
import { useRaceNutrition } from '@/lib/RaceNutritionContext';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const { ready, historyWithCheckins, thresholds } = useRaceNutrition();

  if (!ready) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Past Races</Text>
      <Text style={styles.subtitle}>Review totals, duration, and hourly intake range status for previous races.</Text>

      {historyWithCheckins.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No completed races yet</Text>
          <Text style={styles.emptyText}>Start and stop a race from the Race tab to save it here.</Text>
        </View>
      ) : (
        historyWithCheckins.map(({ race, checkins }) => (
          <RaceSummaryCard key={race.id} race={race} checkins={checkins} thresholds={thresholds} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptyText: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 14,
  },
});
