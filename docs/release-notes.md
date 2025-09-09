# Release Notes

Track changes, features, and fixes between versions.

## [v0.4] - March to War - UNRELEASED
### Features
- Territory conquest system
- Army management interface
- First external territories (villages, castle)
- New base unlock mechanics
- Prestige system tracking

### Changes
- Enhanced UI for conquest mechanics
- Base switching tabs implemented
- Military strength calculations
- Conquest rewards system

## [v0.3] - Growing Estate - CURRENT
### Features
- Full resource chain implementation
- Building dependency gating
- Unit training system (Barracks)
- Infantry unit cap system
- Offline progress persistence
- Toast notification system

### Building Additions
- Farm, Quarry, Iron Mine, Barracks, Warehouse
- Granary for food storage
- Dependency chains enforced

### Bug Fixes
- Resource accumulation respects storage limits
- Offline loading calculates elapsed time correctly
- UI refreshes properly on state changes

### Known Issues
- Siege Workshop not yet implemented
- Multi-base switching limited
- Conquest system basic

## [v0.2] - First Brick - COMPLETED
### Features
- Lumber Camp construction and upgrades
- Basic production scaling mechanics
- Resource storage caps
- Autosave functionality

### Technical
- Production scaling formula implemented
- Storage cap enforcement added
- Manual save/load mechanics

### UI
- Building upgrade buttons added
- Resource overflow indicators
- Basic building cards completed

## [v0.1] - Hello Manor - COMPLETED
### Features
- Basic game framework
- Resource tick system (every second)
- 6 core resources initialized
- Fundamental UI structure
- Manual save (S key) / load (L key)

### Core Systems
- React useReducer state management
- LocalStorage integration
- Vite development server
- Basic responsive design

## Unversioned Milestones (Development)

### Milestone 0 - Foundation
- React empty project
- Basic state structure
- Development environment setup

## Planned Releases

### [v0.5] - Age of Steel
- Technology research system
- Tier-2 units (Swordsman, Longbowman, Catapult)
- Siege Workshop mechanics
- Knowledge resource production

### [v0.6] - Realms & Rituals
- Multi-base management expansion
- Faith resource system
- Policy execution framework
- Random events system
- Mobile responsiveness improvements

### [v1.0] - Gold Master
- Complete building/unit catalog
- Prestige rebirth system
- Event system with choices
- Sound effects and particle animations
- Analytics integration
- Deployment-ready production build

## Technical Debt & Fixes
- [ ] Console error cleanup
- [ ] Performance optimization for large unit counts
- [ ] Improved error boundaries
- [ ] Mobile touch interface improvements
- [ ] Browser compatibility testing

## Migration Notes

### From v0.2 to v0.3
- Resource storage no longer unlimited
- Building construction has delays
- Units consume Food upkeep
- New dependencies must be met
- Offline progress respects caps

### From v0.1 to v0.2
- Production scales with level upgrades
- Storage caps enforce limits
- Autosave enabled by default
- Manual save/load keys added

## Breaking Changes
- **v0.3**: Unlimited storage removed - builds costly storage structures early
- **v0.2**: Production formula changed - recalculate expected yields
- **v0.2**: Building ownership concept introduced - affects available actions

## Feature Preview
Watch development in the [Roadmap](development-plan.md) for upcoming features including:
- Advanced military tactics
- Economic policies per base
- Random events with branching choices
- Cultural buildings and tech tree expansions
- Achievement and prestige systems