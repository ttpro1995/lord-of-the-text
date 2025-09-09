# Milestone 2 – Growing Estate (v0.3) Architectural Plan

## 1. Current Codebase Analysis

The current implementation (Milestone 1) includes:
- React-based game using `useReducer` for state management
- Resource system with timber, stone, iron, food, gold, knowledge
- Building system with Lumber-Camp (3 levels)
- Game tick system (1 second intervals)
- LocalStorage-based save/load functionality
- Simple UI with building cards and resource display

## 2. New Building Data Structures

### Farm
- **Purpose**: Food production
- **Base Cost**: 40 timber, 20 stone
- **Production**: 3 food/minute at Level 1
- **Upgrade Path**:
  - Level 2: 80 timber, 40 stone → 6 food/minute
  - Level 3: 160 timber, 80 stone → 12 food/minute

### Quarry
- **Purpose**: Stone production
- **Base Cost**: 50 timber, 30 food
- **Production**: 4 stone/minute at Level 1
- **Upgrade Path**:
  - Level 2: 100 timber, 60 food → 8 stone/minute
  - Level 3: 200 timber, 120 food → 16 stone/minute

### Iron Mine
- **Purpose**: Iron production
- **Base Cost**: 60 timber, 40 stone, 20 food
- **Dependency**: Requires Quarry Level 2
- **Production**: 2 iron/minute at Level 1
- **Upgrade Path**:
  - Level 2: 120 timber, 80 stone, 40 food → 4 iron/minute
  - Level 3: 240 timber, 160 stone, 80 food → 8 iron/minute

### Barracks
- **Purpose**: Unit training
- **Base Cost**: 70 timber, 50 food
- **Dependency**: Requires Farm Level 2
- **Production**: Enables unit training
- **Upgrade Path**:
  - Level 2: 140 timber, 100 food → Increases unit cap by 5
  - Level 3: 280 timber, 200 food → Increases unit cap by 10 (total +15)

### Warehouse
- **Purpose**: Resource storage expansion
- **Base Cost**: 80 timber, 60 stone, 40 food
- **Effect**: Increases resource caps by 100 each
- **Upgrade Path**:
  - Level 2: 160 timber, 120 stone, 80 food → Increases caps by additional 200
  - Level 3: 320 timber, 240 stone, 160 food → Increases caps by additional 400

## 3. Dependency Gating System

Buildings with dependencies will only be available when prerequisites are met:
- Iron Mine: Requires Quarry Level 2
- Barracks: Requires Farm Level 2

Implementation:
- Add `dependencies` field to building definitions
- Modify `renderBuildingCard` to check dependencies
- Add visual indicators for locked buildings

## 4. Unit Training System

### Peasant Spear
- **Cost**: 20 food, 10 timber
- **Training Time**: 30 seconds
- **Stats**: Basic infantry unit

### System Design
- Add `units` array to game state
- Add `unitQueue` for training in progress
- Implement training progress tracking
- Add UI for unit queue and training controls

## 5. Infantry Unit Cap System

- **Base Cap**: 5 units
- **Scaling**: +5 units per Barracks level
- **Implementation**:
  - Add `unitCap` to state calculation
  - Enforce cap when training units
  - Display current cap in UI

## 6. UI Changes

### New Components
- Building cards for all new buildings
- Dependency indicators (lock icons/tooltips)
- Unit training interface
- Unit cap display
- Toast notification system

### Building Card Enhancements
- Show dependency status
- Display production rates
- Visual feedback for affordability

## 7. Offline Progress System

- Track last active timestamp in localStorage
- On load, calculate elapsed time
- Apply resource production for offline period
- Cap production based on resource limits

## 8. Toast Notification System

- Simple notification component
- Trigger on events: building completion, unit training finish
- Auto-dismiss after timeout
- Queue for multiple notifications

## 9. Implementation Specifications

### File Structure Changes
- Add `src/components/` directory for new UI components
- Create `src/utils/` for helper functions
- Update `data/building-definitions.json` with new buildings

### State Management Extensions
- Add `units`, `unitQueue`, `unitCap` to initial state
- Extend reducer to handle unit training actions
- Add dependency checking to build/upgrade logic

### Component Architecture
- `BuildingCard` component (reusable)
- `UnitTraining` component
- `ToastNotification` component
- `ResourceDisplay` enhancements

### Data Format Updates
```json
{
  "Farm": {
    "1": {
      "cost": {"timber": 40, "stone": 20},
      "production": {"food": 3},
      "dependencies": []
    },
    "2": {
      "cost": {"timber": 80, "stone": 40},
      "production": {"food": 6},
      "dependencies": []
    }
  },
  "Quarry": {...},
  "Iron-Mine": {
    "1": {
      "cost": {"timber": 60, "stone": 40, "food": 20},
      "production": {"iron": 2},
      "dependencies": [{"building": "Quarry", "level": 2}]
    }
  },
  "Barracks": {
    "1": {
      "cost": {"timber": 70, "food": 50},
      "production": {},
      "dependencies": [{"building": "Farm", "level": 2}]
    }
  },
  "Warehouse": {...}
}