import { FoodItemEditor } from '@/components/FoodItemEditor';
import { useRaceNutrition } from '@/lib/RaceNutritionContext';
import { FoodItem } from '@/types/models';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * Dedicated tab for managing saved food items.
 * Users can search, edit, and delete their reusable food entries here.
 */
export default function FoodLibraryScreen() {
  const { ready, foodItems, searchFoodItems, editFoodItem, removeFoodItem } = useRaceNutrition();
  const [query, setQuery] = useState('');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return foodItems;
    return searchFoodItems(query);
  }, [foodItems, query, searchFoodItems]);

  const confirmDelete = (item: FoodItem) => {
    Alert.alert(
      'Delete food item',
      `Delete "${item.name}" from the food library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeFoodItem(item.id) },
      ],
    );
  };

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Food Library</Text>
        <Text style={styles.subtitle}>Search, edit, and delete reusable saved food items.</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search food items"
          value={query}
          onChangeText={setQuery}
        />

        {filteredItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No saved food items found</Text>
            <Text style={styles.emptyText}>Save a food during a check-in and it will appear here.</Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.calories} kcal • {item.carbs} g carbs • {item.sodium} mg sodium • {item.water} oz water
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Pressable style={styles.editButton} onPress={() => setEditingItem(item)}>
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>

                  <Pressable style={styles.deleteButton} onPress={() => confirmDelete(item)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <FoodItemEditor
        visible={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={editFoodItem}
      />
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
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    color: '#4b5563',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  itemMeta: {
    marginTop: 6,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
  },
  actions: {
    gap: 8,
  },
  editButton: {
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editText: {
    color: '#1d4ed8',
    fontWeight: '800',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteText: {
    color: '#991b1b',
    fontWeight: '800',
    fontSize: 12,
  },
});