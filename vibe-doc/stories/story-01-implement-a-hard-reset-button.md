
# Story: Hard Reset Button (Danger Zone)

## Metadata
- **Story ID**: STORY-001
- **Priority**: High
- **Status**: Draft
- **Created**: 2026-03-29T08:00:00Z
- **Updated**: 2026-03-29T08:00:00Z
- **Author**: GitHub Copilot
- **Related**:
	- docs/user-guide.md
	- docs/game-mechanics.md
	- src/App.jsx

## User Story
As a player, I want a clearly marked "Hard Reset" button that wipes all game data and returns the game to a clean state, so that I can start over or troubleshoot issues without residual data.

## Context
Players may want to restart their game from scratch, either to try a new strategy, recover from a mistake, or resolve a corrupted save. Currently, there is no easy way to fully clear all progress, local storage, and in-memory state. A dedicated, well-warned "Danger Zone" reset button will empower users to do this safely and intentionally.

## Requirements

### Functional Requirements
- [ ] Add a "Hard Reset" button to the Settings screen (or a similarly hard-to-reach location)
- [ ] Button must be visually distinct (e.g., red, warning icon, "Danger Zone" label)
- [ ] Clicking the button opens a confirmation dialog with a clear warning
- [ ] Confirming the dialog:
	- [ ] Clears all localStorage and any other persistent storage
	- [ ] Resets all in-memory game state to initial values
	- [ ] Reloads the game to a clean state
- [ ] Button is not accessible from main gameplay UI (to prevent accidental clicks)

### Non-Functional Requirements
- [ ] Confirmation dialog must require explicit user action (e.g., typing "RESET" or double confirmation)
- [ ] Button and dialog must be accessible and usable on all supported devices
- [ ] Operation must be atomic—no partial resets
- [ ] No sensitive data is leaked or left behind after reset

## Acceptance Criteria
- [ ] "Hard Reset" button is only visible in the Settings or Danger Zone section
- [ ] Button is styled with red color and warning icon
- [ ] Clicking button opens a modal with a strong warning and confirmation step
- [ ] Confirming clears all game data and reloads the app to a clean state
- [ ] After reset, all progress, saves, and localStorage are gone
- [ ] Manual and automated tests verify reset works as intended

## Technical Specifications

### Architecture Impact
- **UI**: Add button and modal to Settings or Danger Zone section in App.jsx
- **State Management**: Add a reducer action to reset all state slices to initial values
- **Persistence**: Clear localStorage and any other persistent storage
- **Reload**: Trigger a full page reload after reset

### Data Structures
- No new data structures; will use existing initial state definitions for all reducers

### API Changes
- New reducer action: `type: 'HARD_RESET'`
- UI event handler for reset button and confirmation dialog

## Implementation Plan

### Step 1: Add Danger Zone UI
**Objective**: Add a visually distinct Danger Zone section to Settings

**Tasks**:
- [ ] Add "Danger Zone" section to Settings
- [ ] Add red "Hard Reset" button with warning icon
- [ ] Style section and button for high visibility and caution

**Validation**:
- [ ] Button appears only in Settings/Danger Zone
- [ ] Button is styled as dangerous

### Step 2: Implement Confirmation Dialog
**Objective**: Prevent accidental resets with a strong confirmation

**Tasks**:
- [ ] Add modal dialog that appears on button click
- [ ] Dialog displays clear warning and requires explicit confirmation (e.g., type "RESET")
- [ ] Only allow reset if confirmation is correct

**Validation**:
- [ ] Dialog appears and blocks accidental reset
- [ ] Reset only proceeds after correct confirmation

### Step 3: Implement Reset Logic
**Objective**: Fully clear all game data and reload app

**Tasks**:
- [ ] Dispatch `HARD_RESET` action to reset all reducers to initial state
- [ ] Clear localStorage and any other persistent storage
- [ ] Reload the page to ensure clean state

**Validation**:
- [ ] All state and storage are cleared after reset
- [ ] App reloads to initial state

### Step 4: Testing and Documentation
**Objective**: Ensure reliability and document feature

**Tasks**:
- [ ] Write unit tests for reducer reset logic
- [ ] Write integration tests for full reset flow
- [ ] Add manual test instructions
- [ ] Update user guide and game mechanics docs

**Validation**:
- [ ] All tests pass
- [ ] Documentation is updated

## Testing Strategy

### Unit Tests
- [ ] Reducers return initial state on `HARD_RESET`
- [ ] UI components render Danger Zone and button correctly

### Integration Tests
- [ ] Full reset flow clears state and storage, reloads app
- [ ] Confirmation dialog blocks accidental reset

### Manual Testing
- [ ] Verify button is hard to reach and clearly marked
- [ ] Verify confirmation dialog works as intended
- [ ] Verify all data is cleared and game restarts cleanly

## Dependencies

### Prerequisites
- [ ] Settings screen or equivalent exists
- [ ] Centralized state management with `useReducer`

### Blocked By
- None

### Blocks
- None

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User accidentally resets game | High | Low | Strong confirmation dialog, Danger Zone placement |
| Partial reset leaves data | High | Low | Atomic reset logic, reload app |
| Reset button is too hidden | Medium | Medium | Document location in user guide |
| Accessibility issues | Medium | Low | Follow accessibility best practices |

## Design Decisions

### Decision 1: Location of Reset Button
- **Context**: Prevent accidental use
- **Options Considered**:
	1. Main menu
	2. Settings screen (Danger Zone)
- **Decision**: Settings screen, Danger Zone
- **Rationale**: Reduces risk of accidental clicks

### Decision 2: Confirmation Mechanism
- **Context**: Ensure intentional action
- **Options Considered**:
	1. Simple "Are you sure?" dialog
	2. Require typing "RESET" or similar
- **Decision**: Require typing "RESET"
- **Rationale**: Stronger protection against mistakes

## Examples

### Code Examples

**Reducer Reset Action:**
```javascript
case 'HARD_RESET':
	return initialState;
```

**UI Handler:**
```javascript
function handleHardReset() {
	if (window.confirm('Type RESET to confirm')) {
		localStorage.clear();
		dispatch({ type: 'HARD_RESET' });
		window.location.reload();
	}
}
```

### Usage Example
```javascript
// In Settings component
<button className="danger" onClick={handleHardReset}>
	Hard Reset (Danger Zone)
</button>
```

## Documentation Updates
- [ ] Update `docs/user-guide.md` with reset instructions
- [ ] Update `docs/game-mechanics.md` to mention reset feature
- [ ] Add work-log entry for implementation

## Completion Checklist
- [ ] All functional requirements implemented
- [ ] All acceptance criteria met
- [ ] Unit and integration tests written and passing
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Work-log entry created

## Notes
- Consider adding a tooltip or help icon explaining the consequences of reset
- May want to log reset events for analytics (if privacy policy allows)

## References
- [React useReducer docs](https://react.dev/reference/react/useReducer)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Accessibility: WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)