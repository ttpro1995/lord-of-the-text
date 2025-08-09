# 📜 Lord of the Text – Milestone Roadmap  
Each milestone compiles to a runnable web build (React + Vite).  
Save / load already works from milestone 0 onward.

---

## 🔹 Milestone 0 – “Hello Manor” (v0.1)  
**Goal**: The game window opens and the loop is alive.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **Engine Skeleton** | React + Vite dev server starts without errors (`npm run dev`). |
| **Global State** | Player name, 6 basic resources (Timber, Stone, Iron, Food, Gold, Knowledge) stored in a single `useReducer` slice. |
| **Resource Tick** | Every 1  s the console prints `+1 Timber`. |
| **UI Shell** | Top bar shows “Lord of the Text – v0.1” plus the 6 resource icons and counts. |
| **Save / Load** | Pressing “S” key serialises state to `localStorage`; pressing “L” loads it back. |
| **Version Badge** | Bottom-left shows `v0.1` tag. |

✅ **Play Test**  
Open browser → resources climb → refresh page → progress restored.

---

## 🔹 Milestone 1 – “First Brick” (v0.2)  
**Goal**: Players can build & upgrade one building.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **Building Definition** | JSON file contains Lumber-Camp Lv 1–3 with cost & production curves. |
| **Build Button** | A card shows Lumber-Camp Lv 0 → click “Build (50 T, 30 S)” → if resources enough, building appears in base view. |
| **Upgrade Button** | Same card shows “Upgrade to Lv 2 (…)” when Lv 1 is built. |
| **Production Loop** | Lumber-Camp Lv *n* adds `5 × 1.2ⁿ⁻¹` Timber/minute to the tick. |
| **Storage Cap** | Hard cap 200 Timber; production stops when reached. |
| **Autosave** | State saved automatically every 10 s. |

✅ **Play Test**  
Build → watch Timber rise faster → cap at 200 → upgrade → cap raises.

---

## 🔹 Milestone 2 – “Growing Estate” (v0.3)  
**Goal**: Full resource chain & first military unit.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **All Tier-0/1 Buildings** | Farm, Quarry, Iron Mine, Barracks, Warehouse cards functional. |
| **Dependency Gating** | Iron Mine requires Quarry Lv 2; Barracks requires Farm Lv 2. |
| **Unit Training** | Barracks Lv 1 can queue **Peasant Spear** (cost 10 Food). |
| **Unit Cap** | Max 5 infantry enforced; tooltip explains “+5 per Barracks level”. |
| **Offline Progress** | While tab closed, resources still accrue up to storage cap. |
| **Notify Toast** | “Building complete”, “Unit ready” pop-ups. |

✅ **Play Test**  
Chain-build Quarry → Iron Mine → Barracks → train 5 spears → close tab for 5 min → reopen → resources & units persisted.

---

## 🔹 Milestone 3 – “March to War” (v0.4)  
**Goal**: First conquerable territory & combat.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **Territory List** | JSON file defines 3 villages (def 10, 15, 20) and one castle (def 100). |
| **Army Manager Tab** | Drag-and-drop units into an army stack. |
| **Conquest Button** | If army ATK ≥ territory DEF → victory. |
| **Post-Battle Rewards** | Village yields +2 Food/min passive buff; castle grants “Iron Banner” item (+10 % Iron). |
| **New Base Unlock** | First castle conquered becomes a second buildable city-type base (switch via tab). |
| **Prestige Counter** | Starts tracking prestige from conquests. |

✅ **Play Test**  
Train 12 Footmen → attack weakest village → win → Food income rises → switch base tabs → build Lumber-Camp in new city.

---

## 🔹 Milestone 4 – “Age of Steel” (v0.5)  
**Goal**: Tech tree & tier-2 gameplay.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **Knowledge Resource** | Library building produces Knowledge. |
| **Technology Panel** | 10-node tree (e.g., “Wheel → Cartography → Advanced Siege”). |
| **Tier-2 Units** | Swordsman, Longbowman, Light Cavalry, Catapult unlocked via tech & upgraded buildings. |
| **New Siege UI** | Siege Workshop shows build queue for Catapults. |
| **Balancing Tools** | Dev console command `/give 1000 Food` for quick testing. |
| **Version Log** | In-game modal shows patch notes for v0.5. |

✅ **Play Test**  
Research “Advanced Siege” → build Catapult → attack castle → breach walls animation.

---

## 🔹 Milestone 5 – “Realms & Rituals” (v0.6)  
**Goal**: Multi-base management & cultural layer.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **Base Types** | Castle, City, Village, Temple bases with distinct bonuses. |
| **Faith Resource** | Temple produces Faith; Paladin unit requires 50 Faith. |
| **Policy System** | City base can enact “Trade Tariff” policy (+15 % Gold, -10 % Food). |
| **Event Engine** | Every 5–10 min random event card appears (plague, feast, wandering merchant). |
| **Settings Panel** | Toggle offline gains, reset save, change tick rate. |
| **Mobile Layout** | UI responsive down to 360 px width. |

✅ **Play Test**  
Own 4 bases → enact policies → respond to “Bandit Raid” event → switch to Temple → recruit first Paladin.

---

## 🔹 Milestone 6 – “Gold Master” (v1.0)  
**Goal**: Feature-complete release candidate.

| Deliverable | Acceptance Criteria |
|-------------|---------------------|
| **All Units & Buildings** | Every entry from `unit-list.json` & `building-list.md` reachable. |
| **End-Game Loop** | Infinite prestige rebirth: reset for permanent multipliers. |
| **Polish Pass** | Sound effects, particle animations, loading spinner, error boundaries. |
| **Analytics Hook** | Basic telemetry (session length, milestones reached). |
| **Build & Deploy** | GitHub Actions produce static bundle to `gh-pages` branch. |
| **Marketing Page** | Landing page with screenshots, Discord link. |

✅ **Final QA**  
Fresh install → reach prestige 1 within 2 h → no console errors → Lighthouse score ≥ 90.

---

### 📅 Timeline (suggested)
* 1 week per milestone → 6 weeks to v1.0  
* Every milestone tagged in Git (`v0.1`, `v0.2`, … `v1.0`) and downloadable as zip.

Happy building, my lord!