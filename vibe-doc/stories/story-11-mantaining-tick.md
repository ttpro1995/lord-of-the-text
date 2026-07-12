# Story: Maintain Manual Tick Behavior and Improve Tick Feedback

## Metadata
- **Story ID**: STORY-011
- **Priority**: High
- **Status**: Draft
- **Created**: 2026-07-12T00:00:00Z
- **Updated**: 2026-07-12T00:00:00Z
- **Author**: GitHub Copilot
- **Related**:
	- src/App.jsx
	- src/hooks/useKeyboardShortcuts.js
	- src/App.css
	- src/components/ResourceDisplay.jsx
	- tests/integration.test.jsx
	- docs/game-mechanics.md
	- vibe-doc/stories/story-09-change-tick-into-click-tick-or-space.md

## User Story
As a player, I want the game to progress only when I manually tick, and I want clear visual feedback when a tick happens, so that controls feel intentional and responsive.

## Context
The game already introduced manual ticking, but players still report behavior that feels like old auto-tick is active. This story hardens manual-tick-only progression and improves interaction clarity.

Primary goals:
- Ensure no background auto-tick dispatch remains.
- Add a visible UI clue when a tick is triggered (button click or Space).
- Improve Tick button copy to explicitly teach the Space shortcut.

## Requirements

### Functional Requirements
- [ ] Remove any residual automatic tick progression from interval/effect logic.
- [ ] Ensure idle game state does not change unless a tick is triggered by user action.
- [ ] Add visual feedback on every successful manual tick (button click or Space).
- [ ] Update Tick button text to mention Space as an alternative input.
- [ ] Keep existing shortcuts functional and avoid ticking while typing in input/textarea/contentEditable.

### Non-Functional Requirements
- [ ] Tick feedback must be lightweight and non-blocking.
- [ ] UI hint text must be clear on desktop and mobile.
- [ ] No reducer purity regressions or state shape changes.

## Acceptance Criteria
- [ ] Waiting at least 5 seconds with no interaction produces zero tick-driven resource or queue changes.
- [ ] Clicking Tick once causes exactly one progression step.
- [ ] Pressing Space once causes exactly one progression step.
- [ ] Tick visual clue appears for both click and Space-triggered ticks.
- [ ] Tick button text explicitly communicates Space shortcut (example: `Tick (Space)`).
- [ ] Space does not trigger tick when typing in reset-name input or any editable field.
- [ ] Existing Save/Load shortcuts remain functional.

## Technical Specifications

### Architecture Impact
- `src/App.jsx`
	- Audit and remove any remaining interval-driven `TICK` dispatch path.
	- Keep one single tick entry point for button and keyboard events.
	- Introduce transient UI feedback state for the tick clue.
- `src/hooks/useKeyboardShortcuts.js`
	- Keep Space binding aligned with manual tick handler.
	- Preserve editable-field guard and default-prevent behavior where needed.
- `src/App.css`
	- Add small animation/state style for tick feedback.

### UI/UX Guidance
- Tick button label should communicate both action and shortcut.
	- Preferred: `Tick (Space)`
	- Alternative: `Tick - press Space`
- Visual clue can be one of:
	- brief button pulse/highlight,
	- quick glow/ripple around tick control,
	- short-lived `+1 Tick` helper text.
- Animation duration target: about 120-300ms.

## Implementation Plan

### Step 1: Eliminate Residual Auto-Tick
**Objective**: Guarantee manual-only progression.

**Tasks**:
- [ ] Search for `setInterval`, timers, and effect paths that dispatch `TICK` automatically.
- [ ] Remove or gate any leftover auto progression triggers.
- [ ] Verify no idle progression in runtime.

**Validation**:
- [ ] Idle state remains unchanged without click/key input.

### Step 2: Add Unified Tick Feedback Signal
**Objective**: Show a visual cue for every manual tick source.

**Tasks**:
- [ ] Add transient `isTicking` (or similar) UI state in `App.jsx`.
- [ ] Trigger it from shared manual tick handler used by button and Space.
- [ ] Reset it after short timeout for repeatable feedback.

**Validation**:
- [ ] Feedback appears reliably and does not stack into jank during rapid ticks.

### Step 3: Improve Tick Button Label
**Objective**: Teach Space shortcut directly in primary control.

**Tasks**:
- [ ] Update button text to include Space hint.
- [ ] Ensure accessible name remains clear and concise.
- [ ] Verify mobile layout still looks correct.

**Validation**:
- [ ] Players can discover shortcut without opening help/settings.

### Step 4: Test and Document
**Objective**: Lock behavior and prevent regressions.

**Tasks**:
- [ ] Add/adjust integration coverage for no-idle-progression behavior.
- [ ] Add test for feedback class/state toggling on manual tick.
- [ ] Confirm keyboard guard behavior in editable fields.
- [ ] Update docs where manual tick behavior is explained.

**Validation**:
- [ ] Tests pass and docs match current behavior.

## Testing Strategy

### Integration Tests
- [ ] Render app and wait >5 seconds with no interaction; assert no tick progression.
- [ ] Click Tick once; assert exactly one progression step.
- [ ] Press Space once outside inputs; assert exactly one progression step.
- [ ] Focus an input and press Space; assert no tick progression.
- [ ] Verify tick feedback style/class appears briefly after manual tick.

### Manual Testing
- [ ] Rapidly click Tick and verify smooth, consistent feedback.
- [ ] Alternate click and Space; feedback should behave identically.
- [ ] Check mobile tap target and button text wrapping.

## Out of Scope
- Rebalancing game economy/resource rates.
- Introducing optional auto-tick modes.
- Large UI redesign beyond tick control feedback/hinting.

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Hidden auto-tick path still exists in an effect | High | Medium | Search all `TICK` dispatch sources and timer usage before closing story |
| Visual feedback causes noisy UI during fast ticks | Medium | Medium | Use short, subtle animation and debounce reset logic |
| Space shortcut conflicts with default browser behavior | Medium | Low | Keep preventDefault for handled Space shortcut path |

## Documentation Updates
- [ ] Update docs/game-mechanics.md to clarify manual-only tick progression
- [ ] Update any shortcut/help copy if needed
- [ ] Create/update work-log entry after implementation

## Completion Checklist
- [ ] Residual auto-tick removed
- [ ] Tick feedback added for click and Space
- [ ] Tick button label includes Space hint
- [ ] Tests updated and passing
- [ ] Documentation updated
- [ ] Work-log updated

## Notes
- This story is a stabilization and UX-clarity follow-up to Story-009 and Story-010.
- Keep implementation focused: behavior correctness first, visual polish second.