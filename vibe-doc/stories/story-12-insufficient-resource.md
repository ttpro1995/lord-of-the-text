# Story: Explain Why Actions Are Blocked (Build and Training)

## Metadata
- **Story ID**: STORY-012
- **Priority**: High
- **Status**: Draft
- **Created**: 2026-07-12T00:00:00Z
- **Updated**: 2026-07-12T00:00:00Z
- **Author**: GitHub Copilot
- **Related**:
   - src/components/BuildingCard.jsx
   - src/components/UnitTraining.jsx
   - src/constants/gameReducer.js
   - src/App.jsx
   - tests/integration.test.jsx
   - docs/user-guide.md
   - docs/buildings-and-units.md

## User Story
As a player, I want to see exactly why a build or training action is blocked so that I can quickly understand what I must do next.

## Context
Current UI mostly shows generic messages such as "Insufficient resources" or a disabled button. This makes blocked actions ambiguous.

The game already has several distinct failure reasons in reducer and UI logic:
- Missing resources for building or unit training
- Missing building dependency level
- Unit capacity reached
- Building already at max level
- Invalid/unknown action payloads (defensive case)

This story introduces a single player-facing explanation model that maps these failure reasons to concrete, actionable messages.

## Requirements

### Functional Requirements
- [ ] Building actions must show precise blockers when action is unavailable.
- [ ] Unit training actions must show precise blockers when action is unavailable.
- [ ] Missing resource feedback must include per-resource deficit, for example: `Missing: 12 Timber, 5 Stone`.
- [ ] Dependency feedback must include required and current level, for example: `Requires Barracks Lv 2 (current Lv 1)`.
- [ ] Capacity feedback must include current usage and cap, for example: `Unit cap reached: 20/20`.
- [ ] Max-level feedback must be explicit, for example: `Max level reached`.
- [ ] If multiple blockers exist, UI must display all relevant blockers in a stable order.
- [ ] Explanations must be visible without requiring hover (tooltip can remain supplemental).

### Non-Functional Requirements
- [ ] Explanation computation must be deterministic and side-effect free.
- [ ] Messages must be concise and readable on desktop and mobile.
- [ ] Accessibility: blocker messages must be screen-reader discoverable (`aria-live` or clearly associated text).
- [ ] No regression to existing success paths (resource deduction, queue creation, notifications).

## Acceptance Criteria
- [ ] When a building cannot be afforded, card shows exact missing amounts by resource.
- [ ] When dependencies are unmet, card shows each unmet requirement with `current/required` level.
- [ ] When both dependency and resource blockers exist, both are shown in predictable order:
   1. Dependencies
   2. Capacity (if relevant)
   3. Resources
- [ ] Training panel shows missing resource amounts for selected quantity.
- [ ] Training panel shows cap blocker with exact values when queue + units already hit cap.
- [ ] Building card shows explicit max-level state and no misleading cost/action message.
- [ ] Triggering blocked actions does not mutate state.
- [ ] Existing success behavior remains unchanged when requirements are satisfied.

## Technical Specifications

### Architecture Impact
- `src/components/BuildingCard.jsx`
   - Replace generic resource/dependency lock text with structured blocker list.
   - Compute deficits from next-level building cost and current resources.
   - Preserve current max-level rendering, but make message consistent with blocker style.
- `src/components/UnitTraining.jsx`
   - Add blocker summary under training controls.
   - Include both cap and resource deficits for current quantity and for Train Max.
- `src/constants/gameReducer.js`
   - Keep reducer as source of truth for enforcement.
   - Optional enhancement: return diagnostic reason metadata for UI alignment (only if done without reducer impurity).
- `src/App.jsx`
   - If needed, pass derived blocker info props to child components.

### Suggested Data Contract (UI Layer)
Define a normalized blocker shape for rendering:

```javascript
{
   code: 'MISSING_RESOURCE' | 'MISSING_DEPENDENCY' | 'CAP_REACHED' | 'MAX_LEVEL' | 'INVALID_ACTION',
   message: 'human readable explanation',
   details: {
      resource?: 'timber',
      missing?: 12,
      building?: 'Barracks',
      requiredLevel?: 2,
      currentLevel?: 1,
      currentCap?: 20,
      maxCap?: 20
   }
}
```

Use this contract as view-model only unless reducer-level diagnostics are intentionally introduced.

### Display Rules
- Resource labels should use project casing (`Timber`, `Stone`, `Food`, etc.).
- Resource deficits should be sorted by largest missing value first.
- No emojis required in blocker text.
- Keep one-line summary + optional detailed lines for mobile readability.

## Implementation Plan

### Step 1: Define Blocker Derivation Helpers
**Objective**: Centralize blocker computation logic for reuse.

**Tasks**:
- [ ] Add pure helper(s) to derive build blockers from state + definition.
- [ ] Add pure helper(s) to derive training blockers from state + quantity.
- [ ] Add unit tests for helper ordering and deficit calculations.

**Validation**:
- [ ] Same inputs always produce same ordered blocker array.

### Step 2: Upgrade BuildingCard Feedback
**Objective**: Replace generic locks with actionable details.

**Tasks**:
- [ ] Render blocker list in building cards.
- [ ] Keep disabled state tied to blocker existence.
- [ ] Keep max-level state explicit and visually distinct.

**Validation**:
- [ ] Building cards expose exact reasons for disabled actions.

### Step 3: Upgrade UnitTraining Feedback
**Objective**: Explain training failures for quantity and cap.

**Tasks**:
- [ ] Show missing resource amounts for chosen quantity.
- [ ] Show cap reason with `current/cap` values.
- [ ] Ensure `Train Max` reflects computed affordability and blockers.

**Validation**:
- [ ] Training panel feedback remains accurate as quantity changes.

### Step 4: Tests and Documentation
**Objective**: Prevent regressions and document behavior.

**Tasks**:
- [ ] Add/extend integration tests for blocked-action explanations.
- [ ] Add manual scenarios for dependency, resource, cap, and max-level cases.
- [ ] Update docs for player-facing explanation behavior.

**Validation**:
- [ ] Tests pass and docs match implemented messaging.

## Testing Strategy

### Unit Tests
- [ ] Build blocker helper returns exact missing resource deltas.
- [ ] Build blocker helper returns unmet dependencies with current/required level.
- [ ] Training blocker helper returns cap blocker when at cap.
- [ ] Blocker ordering is stable and matches acceptance criteria.

### Integration Tests
- [ ] Building card shows deficit text when resources are insufficient.
- [ ] Building card shows dependency requirement text when unmet.
- [ ] Unit training shows quantity-aware resource deficit.
- [ ] Unit training shows cap reached message when full.
- [ ] Successful actions still work and do not show stale blockers.

### Manual Testing
- [ ] Try to build with 0 resources and verify detailed deficit output.
- [ ] Try to build locked building and verify dependency level output.
- [ ] Fill unit cap and verify explicit cap message.
- [ ] Attempt max-level building upgrade and verify explicit max-level state.

## Out of Scope
- Rebalancing game economy values or costs.
- Adding new building tech tree mechanics not currently in data definitions.
- Backend/server validation (game is client-side state).

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| UI and reducer diverge on failure reason logic | High | Medium | Base UI blockers on same cost/dependency/cap calculations as reducer and cover with integration tests |
| Too much text clutters cards on mobile | Medium | Medium | Use concise summary line + compact detail formatting |
| Multiple blockers flicker as quantity changes | Medium | Low | Compute blockers via memoized pure helpers and stable sort |

## Documentation Updates
- [ ] Update docs/user-guide.md with blocked-action explanation examples
- [ ] Update docs/buildings-and-units.md where dependency gating is explained
- [ ] Add work-log entry after implementation

## Completion Checklist
- [ ] Blocker helper(s) implemented
- [ ] Building blocker UI implemented
- [ ] Training blocker UI implemented
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Work-log updated

## Notes
- The example blocker list in the original request is illustrative, not exhaustive.
- Final blocker taxonomy can be expanded later if new game mechanics add new failure reasons.