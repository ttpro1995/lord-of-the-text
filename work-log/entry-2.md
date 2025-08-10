# Entry 2

## Milestone 1 – “First Brick” (v0.2) Implementation

### Completed Tasks:
1.  **Building Definition**: Created `data/building-definitions.json` to define the Lumber-Camp's levels, costs, and production.
2.  **Build & Upgrade Logic**: Implemented `BUILD` and `UPGRADE` actions in the game's reducer to handle building construction and upgrades.
3.  **UI Implementation**: Added a "Lumber-Camp" card to the UI, showing its current level and providing buttons to build or upgrade.
4.  **Production Loop**: Updated the game's tick logic to incorporate the timber production from the Lumber-Camp, based on its level.
5.  **Storage Cap**: Implemented a hard cap of 200 for timber storage.
6.  **Autosave**: Added an autosave feature that saves the game state to `localStorage` every 10 seconds.
7.  **Version Update**: Updated the game version to `v0.2`.

### Files Modified:
-   `src/App.jsx`: Major rewrite to include building logic, production updates, storage caps, and UI elements.
-   `src/App.css`: Added styling for the new building card interface.
-   `data/building-definitions.json`: New file containing building data.

### Next Steps:
-   Thoroughly test the new features to ensure they meet all acceptance criteria.
-   Prepare for Milestone 2: "Growing Estate".