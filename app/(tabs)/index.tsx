import { CheckinForm } from '@/components/CheckinForm';
import { GraphCard } from '@/components/GraphCard';
import { MetricCard } from '@/components/MetricCard';
import { PreviousCheckinsList } from '@/components/PreviousCheckinsList';
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
import { useRaceNutrition } from '@/lib/RaceNutritionContext';
import { formatDateTime, formatDurationHours } from '@/lib/utils';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * Main live race dashboard.
 * This is where the athlete starts/stops races, adds check-ins,
 * reviews graphs, and sees prior check-ins from the current race.
 */
export default function RaceScreen() {
  const {
    ready,
    refreshing,
    activeRace,
    activeCheckins,
    thresholds,
    foodItems,
    startRace,
    stopRace,
    addCheckin,
    addFoodItem,
    refreshAsync,
  } = useRaceNutrition();

  const [raceName, setRaceName] = useState('');

  const summary = useMemo(() => {
    return activeRace ? summarizeRace(activeRace, activeCheckins) : null;
  }, [activeRace, activeCheckins]);

  const onStart = () => {
    try {
      startRace(raceName || `Race ${new Date().toLocaleDateString()}`);
      setRaceName('');
    } catch (error) {
      Alert.alert('Unable to start race', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const onStop = () => {
    try {
      stopRace();
      Alert.alert('Race saved', 'This race is now available in History.');
    } catch (error) {
      Alert.alert('Unable to stop race', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const onRefreshPress = async () => {
    // Light haptic feedback gives the button a more responsive feel.
    try {
      await Haptics.selectionAsync();
    } catch {}

    await refreshAsync();
  };

  const onAddCheckin = (values: {
    calories: number;
    carbs: number;
    sodium: number;
    water: number;
    notes: string | null;
    foodItemName: string | null;
  }) => {
    try {
      addCheckin(values);
      Alert.alert('Check-in added', 'Your nutrition check-in has been saved.');
    } catch (error) {
      Alert.alert('Unable to save check-in', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const onSaveFoodItem = (values: {
    name: string;
    calories: number;
    carbs: number;
    sodium: number;
    water: number;
  }) => {
    try {
      addFoodItem(values);
    } catch (error) {
      Alert.alert('Unable to save food item', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAsync} />}
    >
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Race Nutrition</Text>
            <Text style={styles.subtitle}>Track race fueling, saved foods, threshold performance, and previous check-ins.</Text>
          </View>

          <Pressable style={styles.refreshButton} onPress={onRefreshPress}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>
        </View>
      </View>

      {!activeRace ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Start a New Race</Text>
          <TextInput
            style={styles.input}
            placeholder="Race name"
            value={raceName}
            onChangeText={setRaceName}
          />
          <Pressable style={styles.primaryButton} onPress={onStart}>
            <Text style={styles.primaryButtonText}>Start Race</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{activeRace.name}</Text>
            <Text style={styles.meta}>Started: {formatDateTime(activeRace.startTime)}</Text>
            <Text style={styles.meta}>Duration: {summary ? formatDurationHours(summary.durationHours) : '0h 0m'}</Text>
            <Pressable style={styles.stopButton} onPress={onStop}>
              <Text style={styles.stopButtonText}>Stop Race</Text>
            </Pressable>
          </View>

          <View style={styles.metricsGrid}>
            {METRICS.map((metric) => {
              const rate = getMetricRatePerHour(activeRace, activeCheckins, metric.key);
              const total = getMetricTotal(activeCheckins, metric.key);
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

          <CheckinForm
            foodItems={foodItems}
            onSubmit={onAddCheckin}
            onSaveFoodItem={onSaveFoodItem}
          />

          {METRICS.map((metric) => (
            <GraphCard
              key={metric.key}
              title={`${metric.label} — ${getBandLabel(getIntakeBand(getMetricRatePerHour(activeRace, activeCheckins, metric.key), metric.key, thresholds))}`}
              unit={metric.unit}
              data={buildGraphSeries(activeRace, activeCheckins, metric.key)}
            />
          ))}

          <PreviousCheckinsList checkins={activeCheckins} />
        </>
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
  hero: {
    marginBottom: 14,
  },
  heroHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
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
  },
  refreshButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: '#111827',
    fontWeight: '800',
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#fff',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  stopButton: {
    marginTop: 14,
    backgroundColor: '#b91c1c',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  meta: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});