# Lord of the Text - Project Guidelines

## Code Style

- **React**: Use functional components with hooks (`useState`, `useReducer`, `useEffect`)
- **Naming**: camelCase for variables/functions, PascalCase for React components
- **State Management**: Centralized state with `useReducer` pattern, avoid component-level state for game data
- **Comments**: Add explanatory comments for complex game logic, especially in reducers
- **Functions**: Keep functions small and focused, extract complex logic into separate functions

## Architecture

**State Management Pattern:**
- Main state in [src/App.jsx](src/App.jsx) using `useReducer` with combined reducers
- Modular reducers: `buildings.js`, `resources.js`, `units.js`, `notifications.js` 
- Game data in JSON files: [data/building-definitions.json](data/building-definitions.json), [src/data/game-constants.json](src/data/game-constants.json)

**Key Architectural Decisions:**
- Reducers handle all game logic - pure functions that return new state
- Building definitions stored in JSON with level-based configurations  
- Dependencies checked in reducers before allowing builds/upgrades
- Resource caps enforced through `RESOURCE_CAPS` constant
- Unit cap calculated: `BASE_UNIT_CAP + (barracks_level * UNIT_CAP_PER_BARRACKS_LEVEL)`

**Reducer Action Patterns:**
```javascript
// Building actions use payload with building name
{ type: 'BUILD', payload: 'Farm' }
{ type: 'UPGRADE', payload: 'Farm' }

// Resource actions include resource type and amount
{ type: 'SPEND_RESOURCES', payload: { timber: 40, stone: 20 } }
```

## Build and Test

**Key Commands:**
```bash
npm install          # Install dependencies
npm run dev         # Start development server (Vite, localhost:5173)
npm run build       # Production build
npm test            # Run all tests (Vitest)
npm run lint        # ESLint check
```

**Testing Approach:**
- Test reducer logic directly, not through UI
- Use milestone-based test organization ([tests/milestone2.test.js](tests/milestone2.test.js))
- Test both successful and failing scenarios (insufficient resources, unmet dependencies)
- Always test state transitions: initial state → action → expected final state

## Conventions

**Game Mechanics Implementation:**
- Building levels start at 0 (unbuilt), increment with BUILD/UPGRADE actions
- Check dependencies in reducers before modifying state
- Resource costs defined per building level in JSON data files
- Notifications added for successful builds/upgrades, not for failures
- Log resource deductions with `console.log("Deducting resources for...")` 

**Testing Patterns:**
- Start tests with clean `initialState`
- Chain actions to build up required state: `newState = gameReducer(newState, action)`
- Test edge cases: insufficient resources, unmet dependencies, max levels
- Verify both positive outcomes (building succeeds) and negative outcomes (building fails)

**File Organization:**
- New buildings/units: Add to JSON definitions first, then implement reducer logic
- Game constants: Store in [src/data/game-constants.json](src/data/game-constants.json)
- Documentation: Update relevant files in [docs/](docs/) when adding features

**Current Focus Areas:**
- Building upgrade system and multi-level dependencies
- Unit training and capacity management  
- Notification system for player feedback
- Resource production and offline progress mechanics

## Common Pitfalls

- Don't mutate state directly in reducers - always return new state objects
- Check building dependencies in the correct order (prerequisites first)
- Resource caps apply to production, not spending - prevent overflow
- Unit queue vs active units are separate arrays with different logic
- Test failures often indicate missing dependency checks or incorrect resource calculations