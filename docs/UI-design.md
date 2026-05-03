# UI Design - Lord of the Text

## Overview

Lord of the Text uses a modern, dark-themed interface built with React and styled with CSS variables. The UI follows a tabbed layout with Kingdom and Army sections, featuring real-time resource display, building management, and unit training.

## Layout Structure

### Main Sections

```
┌─────────────────────────────────────────────────────────────┐
│                    Top Bar (Sticky)                        │
│  ┌─────────────────────┐         ┌────────────────────────┐ │
│  │ Game Title          │         │ Resource Display       │ │
│  │ "Lord of the Text"  │         │ 7 resource icons       │ │
│  └─────────────────────┘         └────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Main Content Area                        │
│  ┌────────────────────────────────────────────────────────┐│
│  │ Tab Navigation: [Kingdom] [Army]                       ││
│  ├────────────────────────────────────────────────────────┤│
│  │                                                        ││
│  │  Kingdom Tab          │   Army Tab                     ││
│  │  ─────────────────    │   ─────────                    ││
│  │  Building Cards       │   Unit Training Section        ││
│  │  • Lumber Camp        │   • Unit Cap Display           ││
│  │  • Farm               │   • Unit Selector              ││
│  │  • Quarry             │   • Quantity Selector          ││
│  │  • Iron Mine          │   • Train Button               ││
│  │  • Barracks           │   • Training Queue            ││
│  │  • Warehouse          │   Your Army Section          ││
│  │  • Granary            │   • Unit List                ││
│  └───────────────────────┴────────────────────────────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Toast Notifications                      │
│                    Bottom-left version badge                │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Top Bar

**Location**: Fixed at top of viewport, sticky on scroll

**Elements**:
- **Game Title**: "Lord of the Text – v0.3" with gradient text effect
- **Settings Button**: ⚙️ icon, opens settings modal
- **Resource Display**: Horizontal grid of resource cards

**Resource Cards** (left to right):
| Icon | Resource | Display |
|------|----------|---------|
| T | Timber | Current amount |
| S | Stone | Current amount |
| I | Iron | Current amount |
| F | Food | Current amount |
| G | Gold | Current amount |
| K | Knowledge | Current amount |
| H | Faith | Current amount |

Resource caps are shown as tooltip on hover when cap > 200.

### 2. Tab Navigation

**Location**: Below top bar, above main content

**Tabs**:
- 🏰 **Kingdom**: Building management and construction
- ⚔️ **Army**: Unit training and management

Active tab highlighted with gradient background.

### 3. Kingdom Tab

#### Building Cards

Grid layout (responsive: 1-3 columns depending on screen width).

**Card Structure**:
```
┌─────────────────────────────────┐
│ Building Name        Lv 2       │
│                                 │
│ [Build/Upgrade to Lv 3]         │
│ 50T, 30S                        │
│                                 │
│ OR                              │
│ 🔒 Requires: Quarry (Lv 1/2)    │
│ 💰 Insufficient resources       │
│                                 │
│ ✅ Max Level Reached            │
└─────────────────────────────────┘
```

**Buildings** (display order):
1. Lumber-Camp (produces Timber)
2. Farm (produces Food)
3. Quarry (produces Stone)
4. Iron-Mine (produces Iron, requires Quarry Lv2)
5. Barracks (unit training, requires Farm Lv2)
6. Warehouse (storage)
7. Granary (food storage bonus)

**Button States**:
- Enabled: Can build/upgrade
- Disabled: Missing dependencies or insufficient resources
- Tooltip: Shows required buildings/resources

### 4. Army Tab

#### Unit Training Section

**Unit Cap Display**:
- Shows current/total units with tooltip explaining calculation
- Formula: `BASE_UNIT_CAP + (Barracks Level × UNIT_CAP_PER_BARRACKS_LEVEL)`

**Training Controls**:
- **Unit Type Selector**: Dropdown (currently only Peasant Spear)
- **Quantity Input**: Number field (1-remaining cap)
- **Train Button**: Initiates batch training

**Training Queue Display**:
- List of units in training with progress bars
- Each item shows: unit type, progress bar, time remaining, cancel button

#### Your Army Section

**Unit List**:
- Grid of trained units (2-4 columns depending on screen)
- Each unit shows: icon, type name, dismiss button (appears on hover)
- Dismissed units are permanently removed

### 5. Modals

#### Settings Modal

 accessed via ⚙️ button or standard modal pattern:
- Game version display
- Save instructions (S key / L key)
- Danger zone with hard reset option

#### Reset Confirmation Dialog

Appears when reset is triggered:
- Warns of irreversible data loss
- Requires typing "RESET" to confirm
- Cancel and Confirm buttons

### 6. Toast Notifications

**Position**: Fixed top-right corner

**Behavior**:
- Slide in from right on appear
- Auto-dismiss after 5 seconds
- Manual dismiss via × button
- Stack vertically when multiple notifications

## Color System

### CSS Variables (defined in :root)

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-dark` | `#1a1b23` | Background gradient start |
| `--secondary-dark` | `#252730` | Background gradient end |
| `--surface` | `#353843` | Card backgrounds |
| `--surface-light` | `#404354` | Hover states, inputs |
| `--surface-hover` | `#4a4d62` | Button hover |
| `--accent-primary` | `#3b82f6` | Primary actions, active tabs |
| `--accent-secondary` | `#10b981` | Success states, unit cap |
| `--accent-warning` | `#f59e0b` | Warning (dependencies) |
| `--accent-danger` | `#ef4444` | Danger (reset, dismiss) |
| `--text-primary` | `#f8fafc` | Main text |
| `--text-secondary` | `#cbd5e1` | Secondary text |
| `--text-muted` | `#94a3b8` | Disabled/hint text |

## Responsive Breakpoints

| Width | Changes |
|-------|---------|
| `&gt; 768px` | 3-column resource grid, 2-column building grid |
| `≤ 768px` | 3-column resource grid, 1-column building grid, stacked top bar |
| `≤ 480px` | 2-column resource grid, compact padding |

## State Management

### Persistent State
- Game state saved to `localStorage` every tick (1 second)
- Manual save: Press 'S'
- Manual load: Press 'L'

### Transient State
- `showSettings`: Settings modal visibility
- `showResetConfirm`: Confirmation dialog visibility
- `resetConfirmText`: Text input for reset confirmation
- `activeTab`: Current tab ('kingdom' or 'army')
- `trainQuantity`: Selected training quantity

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| S | Save game state |
| L | Load saved game state |

## Animations

| Animation | Trigger | Duration |
|-----------|---------|----------|
| `slideInFromRight` | Toast appear | 0.3s |
| `slideInFromBottom` | Modal appear | 0.3s |
| `fadeIn` | Modal overlay | 0.2s |
| Button hover gradient | Button hover | 0.5s |
| Card hover lift | Building card hover | 0.2s |