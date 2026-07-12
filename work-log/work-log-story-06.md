# Work Log - Lord of the Text

## 2026-05-03 - Unit Food Consumption Feature (STORY-006)

### Completed
- Added `unitFoodConsumption` to `src/data/game-constants.json` with rate of 2 food/minute for Peasant-Spear units
- Modified `TICK` action in `src/constants/gameReducer.js` to deduct food based on trained unit count
- Updated `OFFLINE_PROGRESS` action to include food consumption calculation over offline period
- Consumption applies after production each tick, using `Math.max(0, ...)` to prevent negative food
- All 44 tests pass
- Build succeeds

### Technical Details
- Food consumption rate: 2 food per minute per unit (0.033 per second)
- Rate scales with unit count automatically
- Per-unit-type rates supported via `unitFoodConsumption` config