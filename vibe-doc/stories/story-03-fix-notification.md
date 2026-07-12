# Story: Notification Auto-Dismiss and UX Improvements

## Metadata
- **Story ID**: STORY-003
- **Priority**: Medium
- **Status**: Draft
- **Created**: 2026-03-29T00:00:00Z
- **Updated**: 2026-03-29T00:00:00Z
- **Author**: GitHub Copilot
- **Related**: 
	- src/reducers/notifications.js
	- src/App.jsx
	- docs/game-mechanics.md

## User Story
As a player, I want notifications to disappear automatically after a short time, with new notifications appearing on top and a manual dismiss option, so that the notification area stays clean and relevant.

## Context
Currently, notifications persist indefinitely, leading to clutter and reduced usability. Improving notification behavior will enhance user experience and keep the interface tidy.

## Requirements

### Functional Requirements
- [ ] Each notification disappears automatically after 5 seconds
- [ ] New notifications appear at the top, pushing previous ones down
- [ ] Each notification has an 'X' button to manually dismiss it

### Non-Functional Requirements
- [ ] Auto-dismiss should not cause performance issues with many notifications
- [ ] Manual dismiss should be instant and reliable
- [ ] UI should be accessible and visually clear

## Acceptance Criteria
- [ ] Notification disappears 5 seconds after appearing unless manually dismissed
- [ ] New notifications are always at the top of the list
- [ ] Clicking 'X' removes the notification immediately
- [ ] No memory leaks or performance degradation with rapid notifications

## Technical Specifications

### Architecture Impact
- **Reducers**: `notifications.js` - May require timer logic or unique IDs for notifications
- **UI**: `App.jsx` - Notification list rendering, auto-dismiss logic, and 'X' button

### Data Structures
- Notification object should include a unique ID, message, and timestamp

### API Changes
- Add action: `{ type: 'DISMISS_NOTIFICATION', payload: notificationId }`
- Ensure notification add action includes unique ID and timestamp

## Implementation Plan

### Step 1: Add Unique IDs to Notifications
**Objective**: Ensure each notification can be individually managed

**Tasks**:
- [ ] Update notification creation to include unique ID and timestamp
- [ ] Update reducer and UI to use notification IDs

**Validation**:
- [ ] Notifications have unique IDs in state

### Step 2: Implement Auto-Dismiss Logic
**Objective**: Notifications disappear after 5 seconds

**Tasks**:
- [ ] Set timer when notification is added
- [ ] Dispatch dismiss action after 5 seconds

**Validation**:
- [ ] Notification disappears after 5 seconds

### Step 3: Show New Notifications on Top
**Objective**: Most recent notification is always at the top

**Tasks**:
- [ ] Update reducer/UI to unshift new notifications

**Validation**:
- [ ] New notifications appear at the top

### Step 4: Add Manual Dismiss Button
**Objective**: Allow user to remove notification instantly

**Tasks**:
- [ ] Add 'X' button to each notification
- [ ] Dispatch dismiss action on click

**Validation**:
- [ ] Clicking 'X' removes notification immediately

## Testing Strategy

### Unit Tests
- [ ] Notification reducer handles add and dismiss actions
- [ ] Auto-dismiss logic triggers after 5 seconds

### Integration Tests
- [ ] UI displays notifications in correct order
- [ ] Manual dismiss works instantly
- [ ] Auto-dismiss does not interfere with manual dismiss

### Manual Testing
- [ ] Trigger multiple notifications and verify order and timing
- [ ] Dismiss notifications manually and verify behavior

## Dependencies

### Prerequisites
- [ ] Notification system in place

### Blocked By
- None

### Blocks
- None

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Memory leaks from timers | Medium | Low | Clear timers on unmount/dismiss |
| Race conditions with rapid notifications | Low | Medium | Use unique IDs and robust reducer logic |

## Design Decisions

### Decision 1: Auto-Dismiss via setTimeout
- **Context**: Need to remove notifications after a delay
- **Options Considered**:
	1. setTimeout in UI
	2. setTimeout in reducer (not possible)
- **Decision**: Use setTimeout in UI
- **Rationale**: Timers are side effects, best handled in UI layer

## Examples

### Code Examples
```javascript
// Notification object example
{
	id: 'uuid-123',
	message: 'Farm upgraded!',
	timestamp: 1711670400000
}

// Dismiss action
{ type: 'DISMISS_NOTIFICATION', payload: 'uuid-123' }
```

### Usage Examples
```javascript
// Add notification
dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, timestamp } })
// Dismiss notification
dispatch({ type: 'DISMISS_NOTIFICATION', payload: id })
```

## Documentation Updates
- [ ] Update `docs/game-mechanics.md` with notification behavior
- [ ] Create work-log entry for implementation

## Completion Checklist
- [ ] All functional requirements implemented
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] Work-log entry created

## Notes
- Consider batching notifications in future if too many appear at once

## References
- [Notification Reducer](../../src/reducers/notifications.js)
- [Game Mechanics Documentation](../../docs/game-mechanics.md)