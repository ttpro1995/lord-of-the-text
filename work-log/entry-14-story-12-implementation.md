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
- `tests/blockers.test.js` - Unit tests for blocker helpers (12 tests)

### Files Modified (merged with develop branch)
- `src/components/BuildingCard.jsx`:
  - Added blocker computation using `getBuildBlockers()`
  - Shows specific blocker messages instead of generic "Locked"/"Insufficient resources"
  - Displays exact missing amounts and dependency requirements
  - Added `aria-live="polite"` for accessibility
- `src/components/UnitTraining.jsx`:
  - Added blocker computation using `getTrainingBlockers()`
  - Shows cap status with exact values (`5/5`)
  - Shows missing resource amounts for training
  - Added `aria-live="polite"` for accessibility
- `src/App.css`:
  - Added styles for `.blocker-messages`, `.blocker-message`, `.training-blockers`
  - Color-coded blocker types (yellow for dependencies, orange for resources, red for cap)
- `tests/integration.test.jsx` - Added 5 integration tests for blocker display UI

### Key Features Implemented
1. **Building blockers** - Exact missing resource amounts and dependency requirements
2. **Training blockers** - Cap status with current/max values and missing resources
3. **Ordering** - Blockers display: dependencies → cap → resources
4. **Accessibility** - `aria-live="polite"` on blocker containers
5. **Max level** - Explicit "Max Level Reached" message

### Test Results
- Blocker unit tests: 12 passed
- Blocker integration tests: 5 passed
- Build: Successful (34 modules transformed)

### Git Operations
Merged develop branch into feature/story-12-insufficient-resource. Conflicts resolved by adapting blocker changes to the refactored component architecture (BuildingCard.jsx, UnitTraining.jsx exist as separate files in develop).