# Story: Siege Workshop Building

## Metadata
- **Story ID**: STORY-007
- **Priority**: Medium
- **Status**: Draft
- **Created**: 2026-05-03T13:30:00Z
- **Updated**: 2026-05-03T13:30:00Z
- **Author**: Kilo
- **Related**:
  - docs/release-notes.md
  - data/building-definitions.json
  - src/data/game-constants.json

## User Story
As a player, I want a Siege Workshop to train advanced military units, so that I can build a stronger army for conquest.

## Context
The v0.3 release notes list "Siege Workshop not yet implemented" under Known Issues. The Siege Workshop is planned for v0.5 (Age of Steel) but should be partially implemented for v0.3 completeness. It will enable training of tier-2 siege units.

## Requirements

### Functional Requirements
- [ ] Add Siege Workshop to building-definitions.json
- [ ] Define building cost and dependencies (likely requires Barracks Lv 2+)
- [ ] Add unit types that can only be trained with Siege Workshop (future units)
- [ ] Add building card to UI

### Non-Functional Requirements
- [ ] Siege Workshop follows existing building patterns
- [ ] Ready for tier-2 unit unlocks

## Acceptance Criteria
- [ ] Siege Workshop building can be constructed
- [ ] Building has appropriate resource costs (timber, stone, iron)
- [ ] Building has dependency on Barracks level
- [ ] Building card displays correctly in Kingdom tab

## Technical Specifications

### Data Structures
**Building Definition:**
```json
{
  "Siege-Workshop": {
    "1": {
      "cost": { "timber": 100, "stone": 80, "iron": 50 },
      "dependencies": [{ "building": "Barracks", "level": 2 }]
    },
    "2": {
      "cost": { "timber": 200, "stone": 160, "iron": 100 },
      "dependencies": [{ "building": "Barracks", "level": 2 }]
    }
  }
}
```

## Implementation Plan

### Step 1: Add Siege Workshop Definition
**Tasks**:
- [ ] Add Siege-Workshop to building-definitions.json
- [ ] Define level 1 and 2 costs and dependencies

### Step 2: Add to GameState
**Tasks**:
- [ ] Add "Siege-Workshop": 0 to buildings initialState

### Step 3: Add to UI
**Tasks**:
- [ ] Add renderBuildingCard call for Siege-Workshop

## Dependencies
- Barracks building implementation

## Notes
- Siege Workshop currently serves as placeholder for future siege units
- Will enable Catapult and other siege units in v0.5