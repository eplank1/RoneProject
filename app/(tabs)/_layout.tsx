import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

/**
 * Bottom-tab layout for the app.
 * We now expose four main sections: live race dashboard, thresholds,
 * race history, and the food library.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2563eb',
        tabBarLabelStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Race',
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="thresholds"
        options={{
          title: 'Thresholds',
          tabBarIcon: ({ color, size }) => <Ionicons name="options-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="food-library"
        options={{
          title: 'Food Library',
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}