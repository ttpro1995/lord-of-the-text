# Work Log - Lord of the Text

## 2026-05-03 - Advanced UX and Interaction Improvements (STORY-008)

### Completed
- **Created reusable components:**
  - `src/components/ResourceDisplay.jsx` - Shows production rates per minute with animations
  - `src/components/BuildingCard.jsx` - Individual building management component
  - `src/components/UnitTraining.jsx` - Training controls with "Train Max" button
  - `src/components/ArmyDisplay.jsx` - Unit grid with multi-select and bulk dismiss
  - `src/components/TabNavigation.jsx` - Tab navigation with swipe gesture support

- **Created custom hooks:**
  - `src/hooks/useKeyboardShortcuts.js` - Keyboard shortcut handler (B/U/M/Escape)
  - `src/hooks/useMultiSelect.js` - Multi-select logic (Shift+click, Ctrl+click, range selection)

- **Created utilities:**
  - `src/utils/productionCalculator.js` - Calculates resource production rates from buildings

- **Updated game reducer:**
  - Added `BULK_DISMISS_UNITS` action for multi-select unit dismissal

- **Refactored App.jsx:**
  - Split into focused components
  - Integrated keyboard shortcuts
  - Uses new component architecture

- **Added CSS styles:**
  - Resource rate display (per minute)
  - Pulsing animation on resource updates
  - Train Max button styling
  - Bulk action buttons
  - Mobile touch target improvements (44px minimum)

### Features Implemented
- ✅ Resource production rates displayed (e.g., "150 (+300/min)")
- ✅ Keyboard shortcuts: B=Kingdom, U=Army, M=Train Max, Escape=Close modals
- ✅ Multi-select units with Shift+click and Ctrl+click
- ✅ Bulk dismiss for selected units
- ✅ Train Max button calculates optimal quantity based on resources and cap space
- ✅ Swipe left/right to switch tabs on mobile
- ✅ Touch targets >= 44px on mobile
- ✅ Component architecture refactor complete

### Testing
- All 51 tests pass (including new unit training tests)
- Build succeeds
- Linter passes

### Bug Investigation: "Limit 2/5 stuck" issue
- **Root Cause Analysis**: The issue is NOT a bug but expected game behavior
  - Initial state: 20 food, 100 timber
  - Unit cost: 10 food, 5 timber
  - Max affordable by food: 20/10 = 2 units
  - After training 2 units: food drops to 0
  - Without Farm: no food production
  - Cannot train more units due to insufficient food
  
- **Fix Applied**: Added user-friendly message when food is insufficient
  - Added "Need more food to train units" hint in UnitTraining.jsx
  - Added tooltip on Train Max button explaining why it's disabled

- **User Guidance**: To train more units, player needs to:
  1. Build a Farm (requires timber/stone)
  2. Wait for food production (Farm Lv1 = 3 food/min)
  3. Then train more units

### Remaining Tasks
- Visual feedback animations (slide-in numbers for resource changes)
- Loading skeleton states for async actions
- Accessibility audit for screen reader support
- Manual mobile testing