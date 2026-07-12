# Story: Normalize Time Unit to Tick

## Metadata
- **Story ID**: STORY-010
- **Priority**: High
- **Status**: Completed
- **Created**: 2026-07-12T00:00:00Z
- **Updated**: 2026-07-12T18:53:00Z
- **Author**: GitHub Copilot
- **Completed By**: Thai Thien
- **Related**:
  - src/constants/gameReducer.js
  - src/reducers/resources.js
  - src/reducers/units.js
  - src/App.jsx
  - src/data/game-constants.json
  - src/components/ResourceDisplay.jsx
  - docs/game-mechanics.md
  - vibe-doc/stories/story-09-change-tick-into-click-tick-or-space.md

## User Story
As a player, I want all gameplay time values to use tick units so that progression math is consistent and easy to understand.

## Context
After switching gameplay to manual ticking, time is still represented in mixed units (seconds, per-minute rates, and tick actions). This creates conversion complexity and potential balancing bugs.

This story standardizes time to one unit:
- 1 minute ~= 1 tick
- Any minute/second duration must be converted to ticks
- Conversion rounds up (ceiling)

Example:
- 1:30 (90 seconds) -> 2 ticks

## Requirements

### Functional Requirements
- [x] Introduce one canonical conversion rule for all time values: `ticks = ceil(totalSeconds / 60)`.
- [x] Convert unit training durations from second-based values to tick-based values.
- [x] Remove per-second arithmetic from tick progression paths.
- [x] Ensure production and food consumption calculations run per tick with tick-native rates.
- [x] Normalize offline progress to tick units before reducer processing.
- [x] Keep existing gameplay behavior coherent after conversion (no broken queues or negative progress).
- [x] Preserve save/load behavior for existing users, including migration for legacy second-based queue data.

### Non-Functional Requirements
- [x] Keep reducer logic pure and deterministic.
- [x] Avoid hidden time-unit assumptions in UI and constants naming.
- [x] Maintain responsiveness for repeated manual ticks.

## Acceptance Criteria
- [x] No core reducer path uses raw second-based progression math for tick updates.
- [x] Duration conversion uses ceiling rule globally.
- [x] 30 seconds converts to 1 tick.
- [x] 60 seconds converts to 1 tick.
- [x] 90 seconds converts to 2 ticks.
- [x] Unit queue progress increments in tick units and completes at expected converted durations.
- [x] Offline progress applies converted ticks consistently.
- [x] UI labels/tooltips no longer imply per-second timing where tick timing is intended.

## Technical Specifications

### Architecture Impact
- `src/constants/gameReducer.js`
  - Replace second/minute mixed math with tick-native math.
  - Apply centralized conversion helper where conversion is required.
- `src/reducers/resources.js` and `src/reducers/units.js`
  - Keep behavior aligned with canonical tick conversion if these reducers remain in use.
- `src/App.jsx`
  - Convert elapsed real time to ticks for offline progress dispatch.
- `src/data/game-constants.json`
  - Store training durations in tick semantics (or convert at load boundary).
- `src/components/ResourceDisplay.jsx`
  - Update display language from `/min` to `/tick` when showing gameplay rates.

### Data Structures
- Add shared time constants (example):
  - `SECONDS_PER_TICK = 60`
- Add conversion helper (example):
  - `toTicksFromSeconds(seconds) => Math.ceil(seconds / SECONDS_PER_TICK)`
- Queue items should represent training duration/progress in tick units.

### API Changes
- Introduce a reusable utility for time normalization.
- Update payload semantics for offline progression to use ticks (or convert immediately at reducer boundary).
- If migration is needed, add a one-time save-transform step when loading legacy data.

## Implementation Plan

### Step 1: Define Canonical Time Conversion
**Objective**: Establish one conversion source of truth.

**Tasks**:
- [ ] Create a shared time utility with `SECONDS_PER_TICK` and `toTicksFromSeconds`.
- [ ] Replace ad hoc conversion code with utility usage.
- [ ] Document conversion rule in code comments and docs.

**Validation**:
- [ ] Utility tests pass for 30/60/90 second cases.

### Step 2: Convert Gameplay Math to Tick-Native
**Objective**: Remove mixed second/minute arithmetic in reducer logic.

**Tasks**:
- [ ] Refactor production and consumption math to tick-based rates.
- [ ] Refactor queue progress/training completion logic to tick units.
- [ ] Ensure no `/60` dependency remains in core tick path.

**Validation**:
- [ ] Single tick always represents one unit of gameplay progression.

### Step 3: Migrate Data and Save Compatibility
**Objective**: Prevent regressions for existing saves.

**Tasks**:
- [ ] Convert config durations to tick semantics.
- [ ] Add migration logic for legacy queue items that store second-based durations/progress.
- [ ] Guard migration to avoid double conversion.

**Validation**:
- [ ] Legacy save loads successfully and queue timing remains sensible.

### Step 4: Update UI and Documentation
**Objective**: Ensure player-facing clarity.

**Tasks**:
- [ ] Update rate text from minute/second language to tick language where applicable.
- [ ] Update gameplay docs to describe normalized tick time model.
- [ ] Align all examples with ceiling conversion rule.

**Validation**:
- [ ] No docs or UI text contradict the tick-normalized model.

## Testing Strategy

### Unit Tests
- [ ] `toTicksFromSeconds(30) === 1`
- [ ] `toTicksFromSeconds(60) === 1`
- [ ] `toTicksFromSeconds(90) === 2`
- [ ] Queue completion timing matches converted tick durations.

### Integration Tests
- [ ] Trigger one manual tick and verify tick-based production increments.
- [ ] Simulate offline elapsed time and verify converted tick application.
- [ ] Verify save/load round-trip with legacy and current data formats.

### Manual Testing
- [ ] Train a unit with previously second-based duration and confirm converted completion timing.
- [ ] Verify resource rates and tooltips show tick semantics.
- [ ] Confirm no unexpected jumps from rounding in common durations.

## Out of Scope
- Rebalancing economy values beyond unit conversion and semantic normalization.
- Adding variable tick speeds or acceleration modes.

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Conversion causes progression to feel too fast or too slow | High | Medium | Validate baseline scenarios and adjust config values after normalization |
| Legacy saves break due to mixed units | High | Medium | Add explicit one-time migration with format guards |
| Hidden second-based assumptions remain in UI/docs | Medium | Medium | Search for second/minute labels and update all occurrences |

## Documentation Updates
- [ ] Update docs/game-mechanics.md (time model and examples)
- [ ] Update docs/resources.md if rate semantics change in text
- [ ] Update in-app labels/tooltips from minute/second language to tick language
- [ ] Create/update work-log entry after implementation

## Completion Checklist
- [x] Canonical conversion utility added
- [x] Reducers normalized to tick-native math
- [x] Legacy save migration implemented
- [x] Tests added/updated and passing
- [x] UI/docs aligned with tick semantics
- [x] Work-log updated

## Notes
- Rounding policy is always ceiling when converting from second/minute durations to ticks.
- Example mapping: `1:30 -> 2 ticks`.
- Future balancing pass can tune numbers after semantic normalization is complete.
