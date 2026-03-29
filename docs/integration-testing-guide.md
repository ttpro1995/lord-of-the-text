# Integration Testing Guide

This guide provides instructions for understanding, writing, and running integration tests for **Lord of the Text**.

## Overview

Integration tests verify end-to-end user flows by testing the React application with real component interactions, mocked browser APIs, and simulated game state.

**Test File:** `tests/integration.test.js`  
**Framework:** Vitest + React Testing Library  
**Environment:** jsdom

---

## Test Structure

### Key Imports

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App, { gameReducer, initialState } from '../src/App.jsx';
import buildingDefinitions from '../data/building-definitions.json';
import gameConstants from '../src/data/game-constants.json';
```

### Mocked Dependencies

| Mock | Purpose |
|------|---------|
| `localStorage` | Simulate save/load game state |
| `Date.now` | Consistent timestamps for testing |
| `gameConstants` | Faster test execution with reduced values |

---

## Writing Integration Tests

### 1. Setup Pattern

```javascript
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  Date.now.mockReturnValue(1000000000000);
});
```

### 2. Custom Initial State

Inject pre-configured game state for specific test scenarios:

```javascript
const customInitialState = {
  ...initialState,
  resources: {
    ...initialState.resources,
    timber: 300,
    stone: 200
  }
};
localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(customInitialState));
```

### 3. Render and Interact

```javascript
render(<App />);

// Wait for component to load
await screen.findByText('Lord of the Text');

// Find and click buttons
const button = screen.getByRole('button', { name: /build.*lumber-camp/i });
fireEvent.click(button);
```

### 4. Assert State Changes

```javascript
await waitFor(() => {
  expect(screen.getByText('T 250')).toBeInTheDocument();
  expect(screen.getByText('S 170')).toBeInTheDocument();
});

expect(screen.getByText(/lumber-camp complete/i)).toBeInTheDocument();
```

---

## Test Scenarios

### Building Upgrade Cycle

Tests the complete flow of building and upgrading a structure:

1. Verify initial resources
2. Build a building (level 0→1)
3. Assert resource deduction and level update
4. Upgrade building (level 1→2)
5. Assert notification appears

**Key Assertions:**
- Resource amounts after each action
- Building level display
- Toast notifications

### Unit Training Cycle

Tests the flow of building prerequisites and training units:

1. Build Farm (level 1→2)
2. Build Barracks (requires Farm Lv2)
3. Train unit (Peasant-Spear)
4. Verify queue entry

**Key Assertions:**
- Dependency chain completion
- Resource deduction for training
- Unit queue population

---

## Common Patterns

### Querying Elements

```javascript
// By role (preferred)
screen.getByRole('button', { name: /build.*farm/i });

// By text content
screen.getByText('T 300');
screen.getByText('Lumber Camp (Lv 1)');

// By regex pattern
screen.getByText(/peasant-spear/i);
```

### Waiting for Async Updates

```javascript
await waitFor(() => {
  expect(screen.getByText('T 250')).toBeInTheDocument();
}, { timeout: 5000 });
```

### Mocking Game Constants

For faster tests, override expensive values:

```javascript
vi.mock('../src/data/game-constants.json', () => ({
  unitCosts: {
    "Peasant-Spear": { "food": 10, "timber": 5 }
  },
  baseUnitCap: 5,
  unitCapPerBarracksLevel: 5
}));
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run integration tests only
npm test -- integration.test.js

# Run with coverage
npm test -- --coverage
```

---

## Debugging Tips

1. **Check mock setup**: Ensure `localStorageMock.getItem.mockReturnValueOnce()` is called before render
2. **Use findByText**: For async rendering, use `findByText` instead of `getByText`
3. **Inspect state**: Add `console.log(state)` in reducer for debugging
4. **Reset mocks**: Always call `vi.clearAllMocks()` in `beforeEach`

---

## Best Practices

- **Isolation**: Each test should be independent with its own initial state
- **Realistic scenarios**: Test complete user flows, not isolated actions
- **Descriptive names**: Use test names that describe the user goal
- **Wait properly**: Use `waitFor` for state changes, not fixed timeouts
- **Clean assertions**: Assert observable UI changes, not internal state

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Element not found | Check button text matches regex pattern |
| State not updating | Verify `waitFor` wraps the assertion |
| Mock not working | Ensure mock is set up before `render()` |
| Test flakiness | Increase `waitFor` timeout or use `findByText` |

---

## Related Documentation

- [Architecture](architecture.md) - System design overview
- [Game Mechanics](game-mechanics.md) - Core gameplay rules
- [Buildings and Units](buildings-and-units.md) - Building definitions
- [Manual Tests](manual-tests.md) - Manual testing procedures
