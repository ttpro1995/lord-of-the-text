# Entry 2

## Milestone 1 – "First Brick" (v0.2) Implementation

### Completed Tasks:
1. **Building Definition**: Created `data/building-definitions.json` with Lumber-Camp Lv 1-3, including cost, production, and storage curves.
2. **Build Button**: Implemented functionality to build Lumber-Camp Lv 1, checking for sufficient resources.
3. **Upgrade Button**: Implemented functionality to upgrade Lumber-Camp to subsequent levels, checking for sufficient resources.
4. **Production Loop**: Adjusted resource tick to incorporate Lumber-Camp's production rate (`5 × 1.2ⁿ⁻¹` Timber/minute).
5. **Storage Cap**: Implemented a hard cap for Timber storage, stopping production when reached.
6. **Autosave**: Implemented automatic state saving every 10 seconds to `localStorage`.
7. **UI Styling**: Added CSS for the building card to display Lumber Camp information and buttons.

### Files Modified:
- `data/building-definitions.json`: New file created.
- `src/App.jsx`: Modified to include building logic, new state, reducer actions, and UI.
- `src/App.css`: Added styles for the building card.

### Next Steps:
- Verify all acceptance criteria for Milestone 1 are met through playtesting.
- Prepare for Milestone 2.