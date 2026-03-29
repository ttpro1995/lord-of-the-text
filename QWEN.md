# Lord of the Text - Project Context

## Project Overview

**Lord of the Text** is an incremental base-building game built with React and Vite. Players manage a kingdom as a lord, expanding their domain through construction, resource management, military training, and territory conquest. The game features idle mechanics with auto-save functionality, allowing offline progress.

### Tech Stack
- **Framework**: React 19 (functional components, hooks)
- **Build Tool**: Vite 8
- **Testing**: Vitest + React Testing Library (jsdom environment)
- **Linting**: ESLint 9 with react-hooks and react-refresh plugins
- **State Management**: useReducer pattern with combineReducers
- **Persistence**: localStorage for save/load functionality

### Core Architecture

The game uses a centralized state management pattern with `useReducer`:

```
src/
├── App.jsx              # Main component, game loop, UI rendering
├── reducers/
│   ├── index.js         # combineReducers implementation
│   ├── resources.js     # Resource state management
│   ├── buildings.js     # Building state management
│   ├── units.js         # Unit training & queue management
│   └── notifications.js # Toast notification system
├── data/
│   └── game-constants.json  # Global game constants
└── assets/

data/
└── building-definitions.json  # Building costs, production, dependencies
```

### Key Game Systems

1. **Resource System**: 7 resources (timber, stone, iron, food, gold, knowledge, faith) with production/consumption mechanics
2. **Building System**: Constructible/upgradable buildings with dependency gating
3. **Unit System**: Military training with queue, caps, and training times
4. **Tick System**: 1-second intervals for resource production and queue progression
5. **Save System**: Auto-save every tick + manual save/load (S/L keys)
6. **Offline Progress**: Calculates resource/unit progress when returning

## Building and Running

### Prerequisites
- Node.js 16+ (18 LTS recommended)
- npm or yarn

### Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm test
```

### Development Workflow

1. Start dev server: `npm run dev`
2. Make changes to components/reducers/data
3. Tests run with `npm test` (Vitest with watch mode)
4. Build verification: `npm run build`

## Development Conventions

### Code Style
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Files**: `.jsx` for React components, `.js` for modules
- **State**: Use `useReducer` pattern; avoid direct state mutation
- **Unused vars**: Prefix with `_` or `^[A-Z_]` to ignore ESLint rule

### Work Logging
- **Always write to work-log what has been done** - Document completed tasks and changes

### State Management Pattern

Reducers follow a consistent pattern:
```javascript
export function reducer(state, action, fullState) {
  switch (action.type) {
    case 'ACTION_TYPE':
      // Return new state, never mutate
      return { ...state, property: newValue };
    default:
      return state;
  }
}
```

### Testing Practices
- Tests located in `tests/` directory
- Uses React Testing Library for component tests
- Setup file: `tests/setup.js` (cleans up after each test)
- Test command: `npm test` (Vitest with globals enabled)

### Key Files to Understand

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main game loop, UI rendering, tick system |
| `src/reducers/index.js` | Combined reducer setup |
| `data/building-definitions.json` | All building data (costs, production, dependencies) |
| `src/data/game-constants.json` | Global constants (unit costs, caps) |
| `vite.config.js` | Vite + Vitest configuration |
| `eslint.config.js` | ESLint rules and configuration |

### Game State Structure

```javascript
{
  playerName: "Lord",
  resources: { timber, stone, iron, food, gold, knowledge, faith },
  buildings: { "Building-Name": level },
  units: [],           // Trained units
  unitQueue: [],       // Units in training
  notifications: [],   // Toast messages
  version: "v0.3"
}
```

### Adding New Features

**New Building**: Add to `data/building-definitions.json` with cost, production, dependencies

**New Resource**: Update `RESOURCE_CAPS` in App.jsx, add to initialState, update UI

**New Unit**: Add to `game-constants.json` unitCosts, add training logic in reducer

**New Action Type**: Add case to `gameReducer`, dispatch from components

### Common Patterns

- **Dependency Checking**: Buildings check prerequisites before allowing construction
- **Resource Affordability**: All actions validate resource availability
- **Cap Enforcement**: Unit caps enforced via Barracks level scaling
- **Toast Notifications**: Push to `notifications` array for user feedback

## Documentation

Additional documentation available in `docs/`:
- `architecture.md` - System design and component relationships
- `game-mechanics.md` - Core gameplay mechanics
- `resources.md` - Resource types and management
- `buildings-and-units.md` - Complete catalog
- `getting-started-for-contributors.md` - Contribution guidelines
