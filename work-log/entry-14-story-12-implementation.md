# Work Log Entry - Story-12 Implementation

**Date:** 2026-07-12  
**Author:** Thai Thien  
**Story:** [story-12-insufficient-resource.md](../vibe-doc/stories/story-12-insufficient-resource.md)

## Implementation Summary

Implemented actionable blocked-action feedback for building and unit training as specified in Story-12.

### Files Created
- `src/utils/blockers.js` - Pure helper functions for computing blockers:
  - `getBuildBlockers()` - Computes blockers for building actions
  - `getTrainingBlockers()` - Computes blockers for unit training
  - `formatBlockers()` - Formats blocker array to display string
- `tests/blockers.test.js` - Unit tests for blocker helper functions (12 tests)

### Files Modified
- `src/App.jsx`:
  - Added `BuildingBlockers` component for rendering blocker messages
  - Added `TrainingPanel` component for training controls with blocker feedback
  - Building cards now show specific blocker reasons instead of generic text
  - Unit training panel shows exact missing amounts and cap status
  - Added `aria-live="polite"` for accessibility
- `src/App.css`:
  - Added styles for `.blocker-messages`, `.blocker-message`, `.training-blockers`
  - Color-coded blocker types (yellow for dependencies, orange for resources, red for cap)
  - Added `.max-level-message` style

### Key Features Implemented
1. **Building blockers** - Shows exact missing amounts per resource and dependency requirements
2. **Training blockers** - Shows cap status with current/max values and missing resources
3. **Ordering** - Blockers display in predictable order: dependencies → cap → resources
4. **Accessibility** - `aria-live="polite"` on blocker containers for screen readers
5. **Max level** - Explicit "Max Level Reached" message when building is maxed

### Tests
- 12 unit tests for blocker helpers (all passing)
- 5 integration tests for blocker display in UI (all passing)
- Total: 46 tests passing

### Compliance Notes
- Blocker computation is deterministic and side-effect free
- Messages use proper resource casing (Timber, Stone, etc.)
- Resource deficits sorted by largest missing value first
- No emojis in blocker text