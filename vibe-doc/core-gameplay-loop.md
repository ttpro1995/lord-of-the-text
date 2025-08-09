# Lord of the Text – Core Gameplay Loop

## 1. Overview
The core gameplay loop defines the repeating cycle of actions the player engages in to progress in *Lord of the Text*.  
The loop balances **resource generation**, **expansion**, and **progression**, ensuring continuous engagement.

---

## 2. Core Loop Structure

### Step 1 – Resource Generation
- **Passive Production**:
  - Resource buildings (e.g., Lumber Camp, Quarry, Farm) produce resources over time.
  - Production rate depends on building type, level, and applied buffs.
- **Player Interaction**:
  - Collect accumulated resources.
  - Manage storage capacity (build/upgrade warehouses/granaries).

### Step 2 – Resource Allocation
- Spend resources on:
  - **Constructing new buildings**
  - **Upgrading existing buildings** to increase production efficiency.
  - **Training units** for the military.
  - **Researching technologies** for passive bonuses.

### Step 3 – Expansion & Conquest
- Use armies to attempt **territory conquest**.
- Conquest mechanics:
  - Compare **military strength** vs **territory defense**.
  - Success yields:
    - New resources or production bonuses.
    - Unique units or special buildings.
    - Increased territory influence.

### Step 4 – Unlocks & Progression
- Unlock new building types, unit types, and technologies.
- Progression provides:
  - Faster production.
  - Access to higher-tier territories.
  - Expanded strategic options.

### Step 5 – Event & Challenge Response
- Periodic **random events**:
  - Positive (resource windfall, temporary buffs).
  - Negative (raids, disasters reducing production).
- Player makes strategic decisions in response.

### Step 6 – Save & Idle Progress
- **Autosave** game state to LocalStorage/IndexedDB.
- **Idle accumulation**:
  - Resources continue to accumulate while offline (with production capped by storage).

---

## 3. Loop Diagram (Simplified)

```mermaid
flowchart TD
    A[Generate Resources] --> B[Allocate Resources]
    B --> C[Construct/Upgrade Buildings]
    B --> D[Train Units]
    C --> E[Increase Production Capacity]
    D --> F[Attempt Conquest]
    F --> G[Gain Rewards & Territory Bonuses]
    G --> H[Unlock New Content]
    H --> A
    H --> I[Respond to Events]
    I --> A
