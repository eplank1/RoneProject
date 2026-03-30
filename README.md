# Race Nutrition Tracker

Expo app for tracking race-day nutrition with:
- start/stop race flow
- nutrition check-ins during races
- separate graphs for calories, carbs, sodium, and water
- hourly upper/lower thresholds
- local race history stored in SQLite

## Setup

1. Create a folder and copy these files into it.
2. Run:

```bash
npm install
npx expo start
```

## Notes

- Data is stored locally using `expo-sqlite`.
- Thresholds are measured per hour.
- Graphs show cumulative totals over time.
