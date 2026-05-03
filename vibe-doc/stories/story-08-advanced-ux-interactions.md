# Story: Advanced UX and Interaction Improvements

## Metadata
- **Story ID**: STORY-008
- **Priority**: High
- **Status**: Draft
- **Created**: 2026-05-03T14:00:00Z
- **Updated**: 2026-05-03T14:00:00Z
- **Author**: Claude AI
- **Related**:
  - docs/UI-design.md
  - src/App.jsx
  - src/App.css
  - story-02-improve-ui.md

## User Story
As a player, I want advanced interactions and enhanced visual feedback so that I can efficiently manage my kingdom with intuitive controls, clear production insights, and seamless mobile/desktop experience.

## Context
Building on STORY-002's UI modernization, the current interface is visually appealing but lacks advanced interaction patterns and information visualization that would make gameplay more efficient and engaging. Players need better ways to:
- Understand resource production rates and trends
- Perform bulk operations efficiently  
- Navigate using keyboard shortcuts
- Have a smooth mobile touch experience
- Get immediate visual feedback for actions

## Requirements

### Functional Requirements
- [ ] **Enhanced Resource Display**: Show production rates (+5/min) next to resource amounts
- [ ] **Keyboard Navigation**: Full keyboard shortcuts for common actions (B=Buildings, U=Units, Tab navigation)
- [ ] **Bulk Operations**: Multi-select for units with bulk dismiss, "Train Max" button for optimal resource usage
- [ ] **Improved Mobile Touch**: Larger touch targets, swipe gestures for tab switching
- [ ] **Visual Feedback**: Animated resource changes, loading states, optimistic UI updates
- [ ] **Smart Defaults**: Auto-calculate optimal training quantities based on available resources
- [ ] **Component Architecture**: Refactor monolithic App.jsx into focused, reusable components

### Non-Functional Requirements
- [ ] Maintain current performance levels
- [ ] Preserve all existing functionality during refactor
- [ ] Enhance accessibility with proper ARIA labels and screen reader support
- [ ] Responsive design improvements for mobile/tablet experience

## Acceptance Criteria
- [ ] Resource display shows real-time production rates (e.g., "150 (+5/min)")
- [ ] Keyboard shortcuts work: `B` focuses buildings, `U` focuses army, `Tab` navigates, `M` for train max
- [ ] Multi-select units with `Shift+click` and `Ctrl+click`, bulk dismiss selected units
- [ ] "Train Max" button calculates and fills optimal quantity based on resources and cap space
- [ ] Touch targets are minimum 44px on mobile, swipe left/right changes tabs
- [ ] Resource changes animate with slide-in numbers (+10, -5) and subtle pulsing on generation
- [ ] Loading states during training/building actions with skeleton UI
- [ ] App.jsx split into `<BuildingCard>`, `<UnitTraining>`, `<ResourceDisplay>`, `<NotificationSystem>` components
- [ ] Mobile layout optimizations with proper viewport handling and safe area insets

## Technical Specifications

### Architecture Impact
**Component Structure:**
```
src/
├── App.jsx (orchestrates game state and layout)
├── components/
│   ├── ResourceDisplay.jsx (production rates, animations)
│   ├── BuildingCard.jsx (individual building management)
│   ├── UnitTraining.jsx (training controls, queue, bulk ops)
│   ├── ArmyDisplay.jsx (unit grid, multi-select)
│   ├── NotificationSystem.jsx (toast management)
│   └── TabNavigation.jsx (keyboard + swipe support)
├── hooks/
│   ├── useKeyboardShortcuts.js
│   ├── useResourceAnimation.js
│   └── useMultiSelect.js
└── utils/
    └── productionCalculator.js
```

### Data Structures
**Enhanced Resource State:**
```javascript
resources: {
  timber: 150,
  stone: 120,
  // ... other resources
}
// Add computed production rates:
resourceRates: {
  timber: 5,   // per minute
  stone: 4,
  // ... calculated from buildings
}
```

**Multi-select State:**
```javascript
multiSelect: {
  selectedUnits: [unitId1, unitId2],
  isMultiSelectMode: false
}
```

### API Changes
- Add `BULK_DISMISS_UNITS` action for multi-select operations
- Add `CALCULATE_PRODUCTION_RATES` for real-time rate display
- Add `TRAIN_MAX_UNITS` action for smart quantity calculation

## Implementation Plan

### Step 1: Enhanced Resource Display with Production Rates
**Objective**: Show real-time production information to help players make informed decisions

**Tasks**:
- [ ] Create `ResourceDisplay.jsx` component with production rate calculation
- [ ] Add `useResourceAnimation` hook for number change animations
- [ ] Display format: "150 (+5/min)" with hover showing detailed breakdown
- [ ] Add subtle pulsing animation on resource generation ticks

**Validation**:
- [ ] Production rates update correctly when buildings change
- [ ] Animations perform smoothly without impacting game tick performance

### Step 2: Keyboard Navigation System
**Objective**: Enable efficient keyboard-only gameplay

**Tasks**:
- [ ] Create `useKeyboardShortcuts` hook with event handling
- [ ] Implement shortcuts: `B` (buildings focus), `U` (army focus), `M` (train max), `Tab` (navigation)
- [ ] Add visual focus indicators for keyboard navigation
- [ ] Support `Escape` to close modals, `Enter` for primary actions

**Validation**:
- [ ] All major game functions accessible via keyboard
- [ ] Focus indicators are clearly visible
- [ ] Shortcuts work across all game states

### Step 3: Bulk Operations and Multi-Select
**Objective**: Allow efficient management of multiple units

**Tasks**:
- [ ] Implement `useMultiSelect` hook with `Shift+click` and `Ctrl+click` support
- [ ] Add multi-select visual indicators (checkboxes, selection highlighting)
- [ ] Create "Bulk Dismiss" button that appears when units are selected
- [ ] Add "Train Max" button that calculates optimal quantity based on resources and cap space

**Validation**:
- [ ] Multi-select works intuitively with standard desktop conventions
- [ ] Bulk operations provide confirmation for destructive actions
- [ ] "Train Max" calculates correctly across all resource scenarios

### Step 4: Mobile Touch Experience Enhancement
**Objective**: Create smooth, touch-friendly mobile interactions

**Tasks**:
- [ ] Increase button touch targets to minimum 44px
- [ ] Implement swipe gestures for tab switching using touch events
- [ ] Add long-press context menus for mobile-specific actions
- [ ] Optimize modal sizing for mobile viewports with proper safe area handling

**Validation**:
- [ ] Touch interactions feel responsive and accurate
- [ ] Swipe gestures work smoothly without conflicts
- [ ] UI adapts properly to different mobile screen sizes and orientations

### Step 5: Visual Feedback and Microinteractions
**Objective**: Provide immediate, satisfying feedback for user actions

**Tasks**:
- [ ] Add animated number changes for resource updates (+10, -5 slide effects)
- [ ] Implement loading states with skeleton UI during async operations
- [ ] Add optimistic UI updates for immediate feedback
- [ ] Create subtle hover and focus animations for enhanced interactivity

**Validation**:
- [ ] Animations enhance rather than distract from gameplay
- [ ] Loading states provide clear indication of processing
- [ ] Visual feedback feels immediate and responsive

### Step 6: Component Architecture Refactoring
**Objective**: Improve code maintainability and enable future extensions

**Tasks**:
- [ ] Extract `BuildingCard.jsx` component with isolated building logic
- [ ] Create `UnitTraining.jsx` with training queue and controls
- [ ] Split `ResourceDisplay.jsx` with production rate features
- [ ] Refactor `NotificationSystem.jsx` for better toast management
- [ ] Move game logic to custom hooks for reusability

**Validation**:
- [ ] All existing functionality preserved after refactor
- [ ] Components are focused, reusable, and well-tested
- [ ] Code is more maintainable with clear separation of concerns

## Testing Strategy

### Unit Tests
- [ ] Test production rate calculations with various building configurations
- [ ] Test keyboard shortcut handling and focus management
- [ ] Test multi-select logic and bulk operations
- [ ] Test component isolation and prop interfaces

### Integration Tests
- [ ] Test keyboard navigation flow through entire game
- [ ] Test mobile touch interactions and swipe gestures
- [ ] Test visual feedback timing and animation coordination
- [ ] Test responsive design across device breakpoints

### Manual Testing
- [ ] Comprehensive mobile device testing (iOS/Android)
- [ ] Keyboard-only gameplay session
- [ ] Accessibility audit with screen reader testing
- [ ] Performance testing with animations and multiple components

## Dependencies

### Prerequisites
- [ ] STORY-002 (UI Improvement) completed
- [ ] Current game state management stable

### Blocked By
- None

### Blocks
- Future advanced features requiring multi-select or keyboard navigation
- Mobile PWA implementation
- Advanced tutorial system

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Component refactoring breaks existing functionality | High | Medium | Incremental refactor with comprehensive testing |
| Mobile gestures conflict with browser navigation | Medium | Medium | Careful touch event handling with preventDefault |
| Performance impact from animations | Medium | Low | Use CSS transforms and requestAnimationFrame |
| Keyboard shortcuts conflict with browser defaults | Low | Low | Use game-specific keys, avoid browser shortcuts |

## Design Decisions

### Decision 1: Component-First Architecture
- **Context**: Need better maintainability and testability
- **Options Considered**: Keep monolithic App.jsx vs. Component extraction
- **Decision**: Extract focused components with clear responsibilities
- **Rationale**: Enables easier testing, future feature development, and code maintenance

### Decision 2: Production Rate Calculation Method
- **Context**: How to display real-time production rates
- **Options Considered**: Pre-calculated vs. Real-time calculation vs. Cached with invalidation
- **Decision**: Real-time calculation with memoization
- **Rationale**: Always accurate, minimal complexity, acceptable performance

### Decision 3: Mobile Gesture Implementation
- **Context**: Native browser gestures vs. Custom touch handling
- **Options Considered**: Use browser swipe vs. Custom touch event handling
- **Decision**: Custom touch handling with proper event management
- **Rationale**: Better control, no conflicts with browser navigation, consistent behavior

## Examples

**Enhanced Resource Display:**
```jsx
<ResourceDisplay 
  resource="timber" 
  amount={150} 
  productionRate={5} 
  cap={300}
  onChange={animateChange}
/>
// Renders: "150 (+5/min) / 300" with animation on changes
```

**Keyboard Shortcut Usage:**
```jsx
useKeyboardShortcuts({
  'b': () => focusTab('kingdom'),
  'u': () => focusTab('army'),
  'm': () => trainMaxUnits(),
  'Escape': () => closeActiveModal()
});
```

**Multi-Select Hook:**
```jsx
const { selectedItems, toggleSelect, selectRange, clearSelection } = useMultiSelect(units);
// Supports Ctrl+click, Shift+click, and programmatic selection
```

## Mobile Experience Improvements

### Touch Target Optimization
- Minimum 44px touch targets for all interactive elements
- Increased padding around small buttons (dismiss, cancel)
- Touch-friendly spacing in unit grids

### Swipe Gestures
- Swipe left/right to change tabs (Kingdom ↔ Army)
- Long-press for context menus on units/buildings
- Pull-down gesture for manual refresh

### Responsive Information Architecture
- Collapsible sections for resource details
- Priority-based information display on small screens
- Mobile-optimized modal sizing

## Accessibility Enhancements

### Keyboard Navigation
- Full Tab sequence through all interactive elements
- Clear focus indicators with high contrast
- Skip links for main content areas

### Screen Reader Support
- Live regions for resource updates and notifications
- Detailed button descriptions ("Dismiss Peasant Spear unit #3")
- Proper heading hierarchy and landmarks

### Visual Accessibility
- Maintain WCAG AA contrast ratios
- Support for reduced motion preferences
- Clear visual hierarchy with semantic markup

## Documentation Updates

- [ ] Update `docs/UI-design.md` with new component architecture
- [ ] Create keyboard shortcuts reference in user documentation
- [ ] Document mobile interaction patterns
- [ ] Add component API documentation for maintainers

## Completion Checklist

- [ ] All functional requirements implemented
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Manual testing completed on mobile and desktop
- [ ] Accessibility audit passed
- [ ] Performance benchmarks maintained
- [ ] Documentation updated
- [ ] Work-log entry created

## Notes

**Future Enhancements to Consider:**
- Gesture-based shortcuts (two-finger zoom for resource details)
- Advanced multi-select with marquee selection
- Contextual tooltips and guided tours
- Voice control integration for accessibility
- Haptic feedback on mobile devices

**Performance Considerations:**
- Use CSS transforms for animations (GPU acceleration)
- Throttle production rate calculations
- Optimize re-renders with React.memo and useMemo
- Lazy load components for better initial load time

## References

- [STORY-002: UI Improvement and Modernization](story-02-improve-ui.md)
- [Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Mobile Interaction Design Patterns](https://mobiscroll.com/blog/mobile-ui-design-patterns)
- [Keyboard Navigation Best Practices](https://webaim.org/techniques/keyboard/)
- [React Component Design Patterns](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example)

## STORY COMPLETION STATUS: 🚧 DRAFT

**Next Steps:**
1. Review with team for priority and scope approval
2. Create detailed technical specifications for component architecture
3. Begin implementation with enhanced resource display feature
4. Set up comprehensive testing framework for new interaction patterns