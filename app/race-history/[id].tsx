import { GraphCard } from '@/components/GraphCard';
import { MetricCard } from '@/components/MetricCard';
import { PreviousCheckinsList } from '@/components/PreviousCheckinsList';
import { useRaceNutrition } from '@/lib/RaceNutritionContext';
import {
    buildGraphSeries,
    getBandLabel,
    getIntakeBand,
    getMetricRatePerHour,
    getMetricTotal,
    getThresholdRatio,
    summarizeRace,
} from '@/lib/analytics';
import { METRICS } from '@/lib/constants';
import { formatDateTime, formatDurationHours } from '@/lib/utils';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Read-only dashboard for a previously completed race.
 * This mirrors the live dashboard but does not allow creating check-ins.
 */
export default function RaceHistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready, thresholds, getRaceDetails } = useRaceNutrition();
  const router = useRouter();

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const details = id ? getRaceDetails(id) : null;

  if (!details) {
    return (
      <View style={styles.center}>
        <Text>Race not found.</Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to History</Text>
        </Pressable>
      </View>
    );
  }

  const { race, checkins } = details;
  const summary = summarizeRace(race, checkins);

  return (
    <>
      <Stack.Screen options={{ title: race.name }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to History</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{race.name}</Text>
          <Text style={styles.meta}>Started: {formatDateTime(race.startTime)}</Text>
          <Text style={styles.meta}>Ended: {formatDateTime(race.endTime)}</Text>
          <Text style={styles.meta}>Duration: {formatDurationHours(summary.durationHours)}</Text>
          <Text style={styles.readOnlyPill}>Read-Only Race View</Text>
        </View>

        <View style={styles.metricsGrid}>
          {METRICS.map((metric) => {
            const rate = getMetricRatePerHour(race, checkins, metric.key);
            const total = getMetricTotal(checkins, metric.key);
            const ratio = getThresholdRatio(rate, metric.key, thresholds);
            const band = getIntakeBand(rate, metric.key, thresholds);

            return (
              <MetricCard
                key={metric.key}
                title={metric.label}
                value={`${total} ${metric.unit}`}
                subtitle={`${rate} ${metric.unit}/hr${ratio !== null ? ` • ratio ${ratio}` : ''}`}
                band={band}
              />
            );
          })}
        </View>

        {METRICS.map((metric) => (
          <GraphCard
            key={metric.key}
            title={`${metric.label} — ${getBandLabel(
              getIntakeBand(getMetricRatePerHour(race, checkins, metric.key), metric.key, thresholds)
            )}`}
            unit={metric.unit}
            data={buildGraphSeries(race, checkins, metric.key)}
          />
        ))}

        <PreviousCheckinsList checkins={checkins} readOnly />
      </ScrollView>
    </>
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
    padding: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  backButtonText: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  meta: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  readOnlyPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: '#e5e7eb',
    color: '#111827',
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});