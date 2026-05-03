# Story: Food Consumption for Units

## Metadata
- **Story ID**: STORY-006
- **Priority**: Medium
- **Status**: Draft
- **Created**: 2026-05-03T13:29:00Z
- **Updated**: 2026-05-03T13:29:00Z
- **Author**: Kilo
- **Related**:
  - docs/release-notes.md
  - src/constants/gameReducer.js
  - src/data/game-constants.json

## User Story
As a player, I want my units to consume food upkeep, so that there's strategic depth in managing my army size versus resource production.

## Context
The v0.3 migration notes state "Units consume Food upkeep" but this feature is not implemented. Currently, trained units exist indefinitely without cost. Adding food consumption creates meaningful decisions about army size vs resource management.

## Requirements

### Functional Requirements
- [ ] Units consume food per tick (e.g., 0.1 food per unit per second)
- [ ] Food consumption affects resource tick calculation
- [ ] Unit consumption scales with unit count
- [ ] Units cannot be trained if insufficient food production rate (optional)
- [ ] Negative food consequences (optional: units die/dismiss if food runs out)

### Non-Functional Requirements
- [ ] Food consumption calculation should not impact tick performance
- [ ] Consumption rate should be balanced for gameplay

## Acceptance Criteria
- [ ] Food decreases gradually when units are trained
- [ ] Food production vs consumption creates meaningful resource management
- [ ] Without enough food production, storage will deplete over time
- [ ] Offline progress includes food consumption calculation

## Technical Specifications

### Data Structures
**Unit Consumption Rules:**
```javascript
// Food consumption rate per unit type (per minute)
const unitFoodConsumption = {
  "Peasant-Spear": 2,  // 2 food per minute per unit
  "Militia-Archer": 3  // example for future units
}
```

### API Changes
**gameReducer.js - TICK action:**
```javascript
case 'TICK': {
  // Calculate food consumption from units
  const unitFoodConsumption = state.units.length * 2 / 60; // per tick
  // Apply consumption after production
  newResources.food = Math.max(0, newResources.food - unitFoodConsumption);
  // ... rest of tick logic
}
```

## Implementation Plan

### Step 1: Define Consumption Rates
**Tasks**:
- [ ] Add unit consumption rates to game-constants.json
- [ ] Define per-unit-type rates

### Step 2: Implement Consumption Logic
**Tasks**:
- [ ] Modify TICK action to deduct food based on unit count
- [ ] Ensure consumption happens after production

### Step 3: Balance and Testing
**Tasks**:
- [ ] Test food consumption with various unit counts
- [ ] Verify offline progress calculation
- [ ] Adjust rates for balanced gameplay

## Dependencies
- Unit training system already implemented

## Notes
- Starting with simple flat rate per unit type
- Could expand to different rates per unit type for balance
- Consider consequences when food storage hits 0