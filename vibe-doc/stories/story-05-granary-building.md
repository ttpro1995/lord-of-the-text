# Story: Granary Building Implementation

## Metadata
- **Story ID**: STORY-005
- **Priority**: Medium
- **Status**: Draft
- **Created**: 2026-05-03T13:28:00Z
- **Updated**: 2026-05-03T13:28:00Z
- **Author**: Kilo
- **Related**:
  - docs/release-notes.md
  - data/building-definitions.json
  - src/constants/gameState.js

## User Story
As a player, I want a Granary building to increase my food storage capacity, so that I can store more food for my growing army and population.

## Context
The release notes for v0.3 list Granary as a building addition, but it is not implemented. Currently, all resources have a cap of 200. The Granary will provide food storage bonuses, similar to how Warehouse works for other resources.

## Requirements

### Functional Requirements
- [ ] Add Granary building to building-definitions.json
- [ ] Level 1: +100 food storage cap (total 300)
- [ ] Level 2: +200 food storage cap (total 400)
- [ ] Level 3: +300 food storage cap (total 500)
- [ ] Add Granary to building cards in App.jsx
- [ ] Update food cap calculation when Granary levels change

### Non-Functional Requirements
- [ ] Food storage bonuses apply immediately after construction
- [ ] UI clearly shows current food cap

## Acceptance Criteria
- [ ] Granary building appears in Kingdom tab
- [ ] Building can be constructed with required resources (timber, stone, food)
- [ ] Each level increases food storage cap
- [ ] Off-line production respects increased caps

## Technical Specifications

### Data Structures
**Building Definition:**
```json
{
  "Granary": {
    "1": {
      "cost": { "timber": 60, "stone": 40, "food": 20 },
      "storageBonus": { "food": 100 }
    },
    "2": {
      "cost": { "timber": 120, "stone": 80, "food": 40 },
      "storageBonus": { "food": 200 }
    },
    "3": {
      "cost": { "timber": 240, "stone": 160, "food": 80 },
      "storageBonus": { "food": 300 }
    }
  }
}
```

### API Changes
- Update `RESOURCE_CAPS` calculation to include Granary bonus
- No new reducer actions needed (existing BUILD/UPGRADE work)

## Implementation Plan

### Step 1: Add Granary to Building Definitions
**Tasks**:
- [ ] Add Granary definition to building-definitions.json
- [ ] Define cost and storage bonus for each level

### Step 2: Update Resource Cap Calculation
**Tasks**:
- [ ] Modify `RESOURCE_CAPS` or create dynamic cap calculation function
- [ ] Include Granary food bonus in cap calculation

### Step 3: Add Granary to UI
**Tasks**:
- [ ] Add Granary to buildings object in initialState
- [ ] Add Granary card to renderBuildingCard calls

### Step 4: Testing
**Tasks**:
- [ ] Test Granary construction and cap increase
- [ ] Test offline production respects new caps

## Dependencies
- Warehouse implementation as reference for storage building pattern

## Notes
- Consider if storage buildings should have unique mechanics or follow Warehouse pattern