import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="checkin" options={{ title: "Check-In" }} />
      <Tabs.Screen name="foods" options={{ title: "Foods" }} />
      <Tabs.Screen name="summary" options={{ title: "Summary" }} />
    </Tabs>
  );
}