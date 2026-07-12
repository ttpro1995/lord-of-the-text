# Story: Replace Auto-Tick with Manual Tick (Button + Space)

## Metadata
- **Story ID**: STORY-009
- **Priority**: High
- **Status**: Draft
- **Created**: 2026-07-12T00:00:00Z
- **Updated**: 2026-07-12T00:00:00Z
- **Author**: GitHub Copilot
- **Related**:
	- src/App.jsx
	- src/constants/gameReducer.js
	- src/hooks/useKeyboardShortcuts.js
	- tests/integration.test.jsx
	- docs/game-mechanics.md

## User Story
As a player, I want to advance the game turn manually by clicking a **Tick** button or pressing **Space**, so that game progression happens only when I choose.

## Context
The current game loop advances automatically every second using `setInterval`. This creates passive progression and removes player control over pace. This story changes progression to an explicit turn model:
- No automatic ticking.
- One user action = one game tick.
- Keyboard support for fast play (`Space`).

This is a gameplay behavior change and should be clearly reflected in UI text and documentation.

## Requirements

### Functional Requirements
- [ ] Remove automatic `TICK` dispatch from the interval-based loop.
- [ ] Add a visible **Tick** button in the main gameplay UI.
- [ ] Clicking **Tick** dispatches exactly one `TICK` action.
- [ ] Pressing **Space** dispatches exactly one `TICK` action.
- [ ] `Space` tick shortcut must not fire while focused in input/textarea/contentEditable elements.
- [ ] Existing shortcuts (`B`, `U`, `M`, `Escape`, `S`, `L`) continue to work.
- [ ] Save state updates continue to happen reliably after player-driven ticks.

### Non-Functional Requirements
- [ ] No regression in reducer purity or existing action behavior.
- [ ] Tick interactions remain responsive on desktop and mobile.
- [ ] UI clearly communicates that the game is now manual-turn based.

## Acceptance Criteria
- [ ] Game resources/queues do not progress over time while idle with no input.
- [ ] Clicking the Tick button once applies one turn of production/queue progress.
- [ ] Pressing Space once applies one turn of production/queue progress.
- [ ] Holding Space does not create unintended high-frequency multi-tick bursts (implementation-defined debounce or key-repeat handling).
- [ ] Building, training queue progress, and resource changes still use existing `TICK` logic.
- [ ] Manual save/load still works with `S` and `L` keys.
- [ ] Settings/help text and docs reflect manual tick controls.

## Technical Specifications

### Architecture Impact
- `src/App.jsx`
	- Remove interval-based tick loop.
	- Add `handleManualTick` handler used by button and keyboard shortcut.
	- Keep persistence behavior by saving state during manual tick actions (or equivalent reliable mechanism).
- `src/hooks/useKeyboardShortcuts.js`
	- Reuse current shortcut system to map `space` to manual tick.
	- Ensure existing “ignore input fields” guard remains effective.
- `src/constants/gameReducer.js`
	- No `TICK` reducer behavior changes expected.

### UI/UX Changes
- Add a primary Tick control in a prominent location (header or above tabs).
- Label suggestion: `Tick (+1s)` or `Advance Turn`.
- Optional hint text: `Space` shortcut near the button.
- Update settings modal keyboard shortcut list to include `Space=Tick`.

### State and Persistence Notes
- Keep using existing game state shape; no schema migration required.
- Verify `lastActive` updates still produce expected offline behavior after removing interval loop.
- Ensure manual ticks persist current state without waiting for periodic autosave.

## Implementation Plan

### Step 1: Replace Tick Trigger Source
**Objective**: End automatic ticking and introduce explicit manual tick handler.

**Tasks**:
- [ ] Remove interval `setInterval(... dispatch({ type: 'TICK' }) ...)` loop.
- [ ] Add `handleManualTick` function in `App.jsx`.
- [ ] Rewire autosave behavior to occur on manual tick (or equivalent event-driven save).

**Validation**:
- [ ] Idle game state remains unchanged without click or key input.

### Step 2: Add UI Tick Control
**Objective**: Make ticking accessible and obvious through UI.

**Tasks**:
- [ ] Add Tick button to main layout.
- [ ] Attach onClick to `handleManualTick`.
- [ ] Add accessible label/title describing the action.

**Validation**:
- [ ] Single click equals single turn advance.

### Step 3: Add Space Keyboard Tick
**Objective**: Enable fast keyboard-driven progression.

**Tasks**:
- [ ] Add `space` mapping in `useKeyboardShortcuts` usage.
- [ ] Guard against accidental repeat bursts (for held key behavior).
- [ ] Preserve all existing keyboard shortcuts.

**Validation**:
- [ ] Space triggers tick outside inputs only.
- [ ] Existing shortcuts remain intact.

### Step 4: Update Player-Facing Text and Docs
**Objective**: Prevent confusion after behavior change.

**Tasks**:
- [ ] Update in-app shortcut/help text.
- [ ] Update `docs/game-mechanics.md` to describe manual turn progression.
- [ ] Ensure story and docs use consistent language (`Tick`, `Space`, no auto-tick).

**Validation**:
- [ ] No documentation still claims “automatic 1-second ticking”.

## Testing Strategy

### Unit Tests
- [ ] Reducer-level tests confirm one `TICK` produces expected resource and queue changes.
- [ ] Keyboard shortcut hook tests (or focused integration coverage) for space handling and input-field bypass.

### Integration Tests
- [ ] Render app, wait >1s without interaction, assert no progression.
- [ ] Click Tick button and assert one-step progression.
- [ ] Fire Space key event and assert one-step progression.
- [ ] Verify save/load shortcuts continue to function.

### Manual Testing
- [ ] Desktop: click Tick repeatedly, verify deterministic progression.
- [ ] Desktop: press Space repeatedly, verify same results as click.
- [ ] Input focus case: typing Space in reset input should not tick.
- [ ] Mobile: tap Tick button works and is comfortably tappable.

## Out of Scope
- Changing the internal duration semantics of one tick (currently equivalent to prior 1-second tick logic).
- Rebalancing resource rates, unit training times, or building costs.
- Introducing hold-to-repeat acceleration modes.

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Autosave no longer runs predictably after removing interval | High | Medium | Trigger save on manual tick and key progression points |
| Space key conflicts with browser scrolling | Medium | Medium | `preventDefault()` when shortcut is handled |
| Players miss the gameplay model change | Medium | Medium | Add visible Tick CTA and shortcut hint in UI/settings |

## Documentation Updates
- [ ] Update docs/game-mechanics.md (manual turn progression)
- [ ] Update in-app settings shortcut text
- [ ] Create/update work-log entry after implementation

## Completion Checklist
- [ ] Auto-tick removed
- [ ] Tick button implemented
- [ ] Space shortcut implemented
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Work-log updated

## Notes
- Suggested follow-up: Add optional “auto mode” as a future unlock or accessibility setting, but keep it out of this story’s scope.

