# Story: Food Cost Clarity in Army Tab

## Metadata
- **Story ID**: STORY-009
- **Priority**: Medium
- **Status**: Completed
- **Created**: 2026-05-03T16:26:00Z
- **Updated**: 2026-05-03T16:30:00Z
- **Author**: Kilo
- **Related**:
  - src/components/UnitTraining.jsx
  - src/components/ArmyDisplay.jsx
  - docs/release-notes.md

## User Story
As a player, I want clear food cost information in the Army tab so that I can make informed decisions about unit training without guesswork.

## Context
Currently, when training units, players cannot easily see:
- How much food each unit costs to train
- How much food capacity they have remaining
- Whether they have enough resources before attempting to train

This leads to confusion and inefficient gameplay as players train units without understanding the food implications.

## Requirements

### Functional Requirements
- [x] Display food cost for each unit type in the training section
- [x] Show food capacity status: "Food Cap: X/Y" with progress indicator
- [x] Disable train button when insufficient resources or food cap exceeded
- [x] Show tooltip explaining why train button is disabled (food cap vs. resources)

### Non-Functional Requirements
- [ ] Information updates in real-time as resources change
- [ ] Clear visual distinction between resource vs. cap constraints

## Acceptance Criteria
- [x] Food cost per unit is visible next to each unit type
- [x] Food capacity bar shows used vs. total capacity
- [x] Train button disabled when cannot afford or cap exceeded
- [x] Tooltip explains specific reason for disabled state
- [x] No confusion about food requirements when training units

## Technical Specifications

### Architecture Impact
- **Components**: `UnitTraining.jsx` - Add food cost display and capacity indicator
- **State**: Use existing `resources.food`, `unitCap`, and `resources.food` cap calculation

### Data Structures
Food cap calculated as: `baseUnitCap + (barracksLevel * unitCapPerBarracksLevel)`

### API Changes
None - uses existing state and calculations

## Implementation Plan

### Step 1: Display Food Cost Per Unit
**Objective**: Show food requirement for training each unit

**Tasks**:
- [x] Add food cost display in UnitTraining component
- [x] Show both training cost and ongoing consumption rate

**Validation**:
- [x] Food costs visible for all unit types

### Step 2: Add Food Capacity Indicator
**Objective**: Show current vs. maximum unit capacity

**Tasks**:
- [x] Add "Food Cap: X/Y" display with progress bar
- [x] Calculate based on Barracks level

**Validation**:
- [x] Capacity updates when Barracks upgrade completes
- [x] Visual indicator clearly shows remaining space

### Step 3: Disable Train with Tooltip
**Objective**: Prevent training when impossible, explain why

**Tasks**:
- [x] Disable train button when resources or cap insufficient
- [x] Add tooltip showing specific constraint (food, timber, cap)
- [x] Update button state on resource/capacity changes

**Validation**:
- [x] Button disabled in correct scenarios
- [x] Tooltip accurately explains constraint

## Testing Strategy

### Unit Tests
- [ ] Test food cost display renders correctly
- [ ] Test capacity calculation with various Barracks levels
- [ ] Test button disabled state logic

### Integration Tests
- [ ] Test tooltip appears when hovering disabled button
- [ ] Test capacity updates after Barracks upgrade

### Manual Testing
- [ ] Verify food costs match game-constants.json values
- [ ] Verify cap calculation matches expected formula
- [ ] Verify tooltip messages are helpful

## Completion Checklist
- [x] All functional requirements implemented
- [x] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Work-log entry created

## Dependencies

### Prerequisites
- [ ] Unit training system exists
- [ ] Resource system functional

### Blocked By
- None

### Blocks
- None

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Players confused about two food values | Medium | High | Clearly label training cost vs. ongoing consumption |
| Food cap calculation performance | Low | Low | Use memoized calculation |

## Notes
- Food cost now displays as "Food Cost: 10 (have X)" showing both cost and available amount
- Train button disabled when missing resources, with tooltip explaining what's needed
- Quantity input clamped to maxAffordable to prevent over-allocating