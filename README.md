# Race Nutrition Tracker

## Features

- Start and stop races
- Create nutrition check-ins during active races
- Track:
  - Calories
  - Carbs
  - Sodium
  - Water
- Save reusable food items
- Manage food items in a Food Library
  - Search saved foods
  - Edit saved foods
  - Delete saved foods
- View separate cumulative graphs for each nutrition metric
- Set hourly upper and lower intake thresholds
- View threshold status categories:
  - Critically Low
  - Moderately Low
  - On Target
  - Moderately High
  - Critically High
- Review previous check-ins
- Store completed races for later analysis
- Open past races in a read-only dashboard view
- Delete saved race events from history
- Refresh dashboard data manually or with pull-to-refresh
- Haptic feedback when using the refresh button
- Jenkins pipeline for basic project structure validation

## Tech Stack

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- Expo SQLite
- React Native SVG
- Expo Haptics
- Jenkins

## Project Structure

```
app/
  _layout.tsx
  index.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    thresholds.tsx
    history.tsx
    food-library.tsx
  race-history/
    [id].tsx

components/
  CheckinForm.tsx
  FoodItemEditor.tsx
  GraphCard.tsx
  MetricCard.tsx
  PreviousCheckinsList.tsx
  RaceSummaryCard.tsx
  ThresholdEditor.tsx

lib/
  RaceNutritionContext.tsx
  analytics.ts
  constants.ts
  db.ts
  store.ts
  utils.ts

types/
  models.ts
  ```

## Setup

1. Create a folder and copy these files into it.
2. Run:

```bash
npm install
npx expo start
```
