# Work Ticket: Army Tab with Batch Training & Troop Management

## Overview
Implement a dedicated "Army" tab for comprehensive troop management, including batch training (multiple units per action), troop dismissal, and improved UI organization similar to Travian-style gameplay.

## Current State Analysis

### Existing Implementation
- **Training**: Single-unit training via `TRAIN_UNIT` action in `gameReducer.js:112-152`
- **Unit Queue**: Basic queue with 30-second training time, displayed inline in `App.jsx:255-291`
- **Troop Display**: Simple list in `App.jsx:292-308` 
- **Unit Data**: Single unit type "Peasant-Spear" defined in `game-constants.json:2-6`
- **Unit Cap**: 5 base + 5 per Barracks level (from `unitConstants.js`)

### Limitations
1. No way to train multiple units at once (one click = one unit)
2. No ability to dismiss/released trained troops
3. Unit management scattered alongside buildings (not in dedicated tab)
4. Training time hardcoded to 30 seconds

## Proposed Changes

### 1. UI Structure - Army Tab
**File**: `src/App.jsx`
- Add tab navigation with "Kingdom" (current) and "Army" tabs
- Army tab contains:
  - **Unit Training Section**: Unit selection dropdown, quantity input, train button
  - **Training Queue**: Enhanced queue display with cancel individual units
  - **Your Army Section**: Grouped unit count display with dismiss capability

### 2. Batch Training Feature
**File**: `src/constants/gameReducer.js`
- New action: `TRAIN_UNITS_BATCH` with payload `{ unitType, quantity }`
- Validate total cost for all units at once
- Add multiple units to queue in single transaction
- Return early if cannot afford full batch

### 3. Unit Dismissal Feature
**File**: `src/constants/gameReducer.js`
- New action: `DISMISS_UNIT` with payload `{ unitId }` (for specific unit)
- Alternative: `DISMISS_UNITS` with payload `{ unitType, count }` (dismiss by type)
- Remove unit from `state.units` array

### 4. Enhanced Unit Data
**File**: `src/data/game-constants.json`
```json
{
  "unitCosts": {
    "Peasant-Spear": { "food": 10, "timber": 5 },
    "Militia-Archer": { "food": 15, "timber": 10 }
  },
  "unitTrainingTimes": {
    "Peasant-Spear": 30,
    "Militia-Archer": 45
  },
  "baseUnitCap": 5,
  "unitCapPerBarracksLevel": 5
}
```

### 5. Training Queue Improvements
**File**: `src/App.jsx`
- Show unit icon, type, progress bar with ETA
- Add cancel button (X) for each queued unit
- Display total queue time remaining

### 6. Army Management UI
**File**: `src/App.jsx`
- Group units by type with count badges
- Show total army size vs cap
- Dismiss selected units with confirmation

## File Changes Summary

| File | Changes |
|------|---------|
| `src/App.jsx` | Add tabs, Army tab UI, batch training form, dismiss handlers |
| `src/constants/gameReducer.js` | Add `TRAIN_UNITS_BATCH`, `DISMISS_UNIT` actions |
| `src/data/game-constants.json` | Add training times per unit type |
| `src/App.css` | Add styles for tabs, army section, quantity input |

## Technical Details

### State Shape (No Changes Required)
```javascript
{
  units: [{ id, type }],           // Array of trained units
  unitQueue: [{ type, progress, trainingTime }], // Training queue
  buildings: { "Barracks": level }  // For unit cap calculation
}
```

### New Action Types
```javascript
// Batch training
{ type: 'TRAIN_UNITS_BATCH', payload: { unitType: string, quantity: number } }

// Dismiss specific unit
{ type: 'DISMISS_UNIT', payload: { unitId: string } }

// Dismiss by type/count
{ type: 'DISMISS_UNITS', payload: { unitType: string, count: number } }

// Cancel from queue
{ type: 'CANCEL_TRAINING', payload: { queueIndex: number } }
```

### Validation Rules
1. **Batch Training**: Check resources for `quantity * unitCost`
2. **Unit Cap**: `(units.length + unitQueue.length + quantity) <= unitCap`
3. **Dismissal**: Cannot dismiss more than owned

## Implementation Order
1. Add `unitTrainingTimes` to `game-constants.json`
2. Implement `TRAIN_UNITS_BATCH` and `DISMISS_UNIT` actions
3. Create tab navigation in `App.jsx`
4. Build Army tab UI with batch training form
5. Add dismiss functionality
6. Add cancel training for queue items
7. Style new components

## Testing Considerations
- Test batch training with varying quantities (1, 5, max cap)
- Test resource deduction for batch orders
- Test unit cap enforcement with queue
- Test dismissing specific units by ID
- Test cancelling queued training