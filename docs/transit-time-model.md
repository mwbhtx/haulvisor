# Transit Time Model

How haulvisor estimates route duration and determines whether consecutive legs are reachable.

**Source code:** `@mwbhtx/haulvisor-core` → `packages/types/src/transit-time.ts`

---

## Overview

The transit time model simulates a truck driver's shift clock forward through each route leg. Instead of simply dividing total miles by speed, it accounts for federal Hours of Service regulations, mandatory breaks, rest periods, loading/unloading dwell time, and fueling stops.

This model is used in two places:
1. **Trip day estimates** — the "X days" displayed on route cards
2. **Feasibility checks** — determining if a driver can realistically reach the next pickup on time

---

## FMCSA Hours of Service Rules

All constants reference the Federal Motor Carrier Safety Administration (FMCSA) regulations under 49 CFR Part 395.

| Rule | Regulation | Value |
|------|-----------|-------|
| Max driving per shift | §395.3(a)(3)(i) | **11 hours** |
| On-duty window | §395.3(a)(2) | **14 hours** from start of shift |
| Mandatory break | §395.3(a)(3)(ii) | **30 min** before 8th consecutive hour of driving |
| Off-duty rest | §395.3(a)(1) | **10 hours** minimum consecutive off-duty |

### How the simulation applies these rules

The model tracks three clocks simultaneously:

- **Shift driving hours** — counts toward the 11-hour driving limit
- **Shift on-duty hours** — counts toward the 14-hour window (includes driving + dwell + breaks)
- **Hours since last break** — counts toward the 8-hour break trigger

When any limit is reached:
- **8 hours since break** → 30-minute mandatory break (resets break clock)
- **11 hours driving** or **14 hours on-duty** → 10-hour mandatory rest (resets all clocks)

---

## Additional Time Factors

| Factor | Default | Description |
|--------|---------|-------------|
| Dwell time per stop | **2 hours** | Loading/unloading at each pickup and delivery |
| Fueling interval | **500 miles** | Distance between fuel stops |
| Fueling stop duration | **30 min** | Time per fuel stop |

Dwell time counts as on-duty (not driving), so it advances the 14-hour on-duty window. A long loading delay can trigger a mandatory rest even if the driver hasn't used all 11 driving hours.

---

## User Setting: Avg. Driving Hours/Day

Most drivers don't push to the full 11-hour HOS limit every day. The **Avg. Driving Hours/Day** setting (range: 6–11, default: 8) replaces the 11-hour cap in the simulation.

When a driver sets this to 9 hours:
- Rest is triggered after **9 hours** of driving instead of 11
- The 14-hour on-duty window scales proportionally to **12 hours** (14 - (11 - 9))
- This produces more conservative estimates that match real-world behavior

---

## Calculation Examples

### Example 1: Short Haul — 300 miles, 2 stops

```
Settings: 55 mph avg speed, 11 hrs/day driving cap

Driving:       300 mi ÷ 55 mph = 5.45 hours
Dwell:         2 stops × 2 hrs = 4.00 hours
30-min break:  None (under 8 hrs driving)
Fueling:       None (under 500 mi)
Rest:          None (under 11 hrs driving, under 14 hrs on-duty)

Total:         9.45 hours
Estimated:     1 day
```

### Example 2: Medium Haul — 625 miles, 2 stops

```
Settings: 55 mph avg speed, 11 hrs/day driving cap

Driving:       625 mi ÷ 55 mph = 11.36 hours
30-min break:  At 8th hour of driving → 0.5 hrs
Fueling:       At 500 mi → 0.5 hrs
Rest:          After 11 hrs driving → 10 hrs (still has 0.36 hrs driving remaining)
Dwell:         2 stops × 2 hrs = 4.0 hrs
Remaining:     0.36 hrs driving after rest

Total:         ~26.7 hours
Estimated:     2 days
```

### Example 3: Long Haul — 1,768 miles, 4 stops (the screenshot route)

```
Settings: 55 mph avg speed, 11 hrs/day driving cap

Driving:       1,768 mi ÷ 55 mph = 32.15 hours
30-min breaks: ~3 breaks = 1.5 hrs
Fueling:       ~3 fuel stops = 1.5 hrs
Rest periods:  ~2 mandatory 10-hr rests = 20 hrs
Dwell:         4 stops × 2 hrs = 8.0 hrs

Total:         ~63 hours
Estimated:     3 days
```

### Example 4: Same route with 9 hrs/day driver setting

```
Settings: 55 mph avg speed, 9 hrs/day driving cap

Driving:       32.15 hours (same)
30-min breaks: ~3 breaks = 1.5 hrs
Fueling:       ~3 fuel stops = 1.5 hrs
Rest periods:  ~3 mandatory 10-hr rests = 30 hrs (more frequent!)
Dwell:         4 stops × 2 hrs = 8.0 hrs

Total:         ~73 hours
Estimated:     4 days
```

---

## Feasibility Checks (Timing Slack)

When building multi-leg routes, the model checks whether a driver can realistically travel from the delivery of order A to the pickup of order B within the pickup window.

### Previous behavior (inaccurate)
```
transition_time = distance / 50 mph
```
This assumed continuous driving with no rest — a 700-mile transition was calculated as 14 hours, but a driver would actually need a 10-hour rest break mid-way, making it ~24+ hours.

### Current behavior (realistic)
```
transition_time = estimateTransitionHours(distance, settings)
```
This runs the full HOS simulation for the deadhead segment, inserting rest breaks when driving limits are reached. The same 700-mile transition now correctly estimates ~24 hours, which may cause some previously "feasible" route pairings to be rejected.

---

## Functions Reference

All exported from `@mwbhtx/haulvisor-core`:

| Function | Purpose |
|----------|---------|
| `estimateTransitHours(legs, settings?)` | Full simulation → `TransitBreakdown` with itemized hours |
| `estimateTransitDays(legs, settings?)` | Wrapper → whole-day count for display |
| `estimateTransitionHours(miles, settings?)` | Deadhead transition → elapsed hours (used by feasibility checks) |
| `estimateTransitHoursForMiles(miles, stops?, settings?)` | Single-segment convenience (used by cost model) |
| `resolveTransitSettings(settings?)` | Merge user settings with defaults |

### TransitBreakdown fields

```typescript
{
  total_hours:    number;  // Total elapsed time
  driving_hours:  number;  // Time behind the wheel
  break_hours:    number;  // 30-min mandatory breaks
  rest_hours:     number;  // 10-hr off-duty rest periods
  dwell_hours:    number;  // Loading/unloading at stops
  fueling_hours:  number;  // Fuel stop time
}
```

---

## Calendar Days Override

When actual pickup/delivery dates are available on a route, the backend also calculates **calendar span days** (first pickup to last delivery + return deadhead). The displayed value is the calendar span — which may be larger than the modeled transit days if there's idle time between legs.

---

## Where Settings Flow From

1. User configures **Avg. Driving Hours/Day** on the settings page
2. Stored in DynamoDB as `avg_driving_hours_per_day`
3. Loaded by route services and merged into `CostModelSettings`
4. Passed to `resolveSettings()` → then to `estimateTripDays()` and `estimateTransitionHours()`
5. Affects both the day count displayed on route cards and the feasibility of multi-leg pairings
