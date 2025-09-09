# Manual Test Procedures

This document provides structured, comprehensive manual test procedures for Lord of the Text game features that require human interaction and visual verification.

## MT-001: Building Construction UI Interaction
**Feature:** Building construction buttons and visual feedback

**Description:** Verify that building buttons display correctly, respond to clicks, show appropriate states, and provide visual feedback during construction.

**Preconditions:**
- Game loaded on `http://localhost:5173`
- Fresh game state (no buildings constructed)

**Steps:**
1. Locate the building construction section in the UI
2. Note the visual state of building buttons (enabled/disabled)
3. Click on "Farm" building option
4. Observe visual feedback during construction
5. Wait for construction to complete
6. Verify building appears in constructed list

**Expected Result:**
- Initial buttons show correct states based on resource availability
- Click triggers visual construction animation and resource deduction
- Construction progress visual is clear and accurate
- Completed building displays in the constructed buildings area

**Pass/Fail Criteria:**
- PASS: All visual states display correctly and construction completes as expected
- FAIL: Missing visual feedback, incorrect button states, construction doesn't complete properly

## MT-002: Unit Training Interface
**Feature:** Unit training UI and queue management

**Description:** Verify unit training buttons work, queue displays correctly, and units appear upon completion.

**Preconditions:**
- Barracks built (Level 1)
- Sufficient resources for training units

**Steps:**
1. Navigate to unit training section
2. Select "Peasant Spear" unit
3. Click train button
4. Observe training queue display
5. Wait for training to complete (30 seconds)
6. Verify unit appears in army composition

**Expected Result:**
- Training button shows resource costs
- Click adds unit to training queue with timer
- Queue display updates during training
- Completed unit moves to army composition area

**Pass/Fail Criteria:**
- PASS: Unit training process completes successfully with proper visual updates
- FAIL: Training fails, queue doesn't update, or unit doesn't appear

## MT-003: Dependency Gating System
**Feature:** Building unlock requirements

**Description:** Verify buildings are correctly gated behind prerequisites and unlock when conditions are met.

**Preconditions:**
- Fresh game state

**Steps:**
1. Check Iron Mine building button state (should be disabled)
2. Build Quarry to Level 2 by upgrading
3. Observe Iron Mine button state change
4. Attempt to build Iron Mine
5. Verify cost and availability

**Expected Result:**
- Iron Mine starts disabled
- Enabling after Quarry Level 2
- Construction succeeds once enabled

**Pass/Fail Criteria:**
- PASS: Button state correctly reflects dependencies
- FAIL: Button always enabled or dependency ignored

## MT-004: Army Composition Drag-and-Drop
**Feature:** Drag-and-drop functionality for army formation

**Description:** Verify units can be dragged to form army compositions for conquest.

**Preconditions:**
- At least 3 units trained
- Game supports conquest feature

**Steps:**
1. Locate army composition area
2. Drag a "Peasant Spear" to army slot 1
3. Drag an "Hunter" (if available) to army slot 2
4. Drag unit from slot back to army pool
5. Verify army strength calculation updates

**Expected Result:**
- Units can be dragged between army and pool
- Visual feedback during drag operation
- Army strength updates correctly based on composition

**Pass/Fail Criteria:**
- PASS: All drag operations work smoothly with correct updates
- FAIL: Dragging fails, units don't move, or calculations incorrect

## MT-005: Persistence Across Browser Sessions
**Feature:** Save/load functionality and offline progress

**Description:** Verify game state persists after browser tab close and re-open.

**Preconditions:**
- Game running with some progress (built buildings, trained units)

**Steps:**
1. Note current resource amounts and buildings
2. Press 'S' key to manual save
3. Close browser tab
4. Wait 1 minute
5. Re-open browser tab to game URL
6. Observe if progress has loaded
7. Press 'L' key if needed
8. Verify resources and buildings match previous state

**Expected Result:**
- Progress automatically loads on page reload
- 'S' and 'L' hotkeys function if required
- Offline progress accumulates up to storage limits

**Pass/Fail Criteria:**
- PASS: Game state fully preserved and loads correctly
- FAIL: Progress lost or loads incorrectly

## MT-006: Conquest Combat Resolution
**Feature:** Territory conquest mechanics

**Description:** Verify army vs. territory combat resolves correctly and yields rewards.

**Preconditions:**
- At least 5 units in army
- Target territory available

**Steps:**
1. Form army with Peasant Spears
2. Select target territory (verify army strength vs defense)
3. Click "Launch Conquest"
4. Observe combat resolution
5. Check reward notifications and gains
6. Verify territory added to controlled areas

**Expected Result:**
- Combat occurs with clear visual feedback
- Success/failure based on strength comparison
- Rewards applied correctly to game state

**Pass/Fail Criteria:**
- PASS: Combat process works and rewards match expected outcomes
- FAIL: Combat doesn't resolve, rewards incorrect, or UI glitches

## MT-007: Resource Storage Capacity Management
**Feature:** Storage limits and visual warnings

**Description:** Verify storage capacities work and provide appropriate warnings.

**Preconditions:**
- Warehouse built
- Resources approaching capacity

**Steps:**
1. Generate excess resources beyond storage caps
2. Observe visual warnings for full storage
3. Verify production stops when storage full
4. Build additional warehouse
5. Verify increased capacity

**Expected Result:**
- Clear visual indicators when storage at/near capacity
- Production halts when full
- Additional storage increases capacity as expected

**Pass/Fail Criteria:**
- PASS: Storage limits enforced with clear visual feedback
- FAIL: Production continues past capacity or no warnings

## MT-008: Multi-Base Management
**Feature:** Base switching and individual management

**Description:** Verify switching between multiple bases works correctly.

**Preconditions:**
- At least 2 bases (main + 1 conquered territory)

**Steps:**
1. Note resources/buildings in main base
2. Switch to second base tab
3. Observe different base state (resources, buildings)
4. Build structure in second base
5. Switch back to main base
6. Verify main base unchanged

**Expected Result:**
- Clean tab switching between bases
- Each base maintains separate state
- No conflicts or data mixing

**Pass/Fail Criteria:**
- PASS: Base switching works seamlessly with separate states
- FAIL: Switching fails, states mixed, or UI confusing

## MT-009: Random Events System
**Feature:** Dynamic events triggering and response

**Description:** Verify random events appear and can be responded to.

**Preconditions:**
- Game running for period allowing events

**Steps:**
1. Wait for random event notification
2. Read event description and options
3. Select response option
4. Observe consequence application
5. Verify changes to game state

**Expected Result:**
- Events trigger with notification
- Clear options and consequences visible
- Selected response applies correctly

**Pass/Fail Criteria:**
- PASS: Events trigger and responses work as expected
- FAIL: No events trigger or responses fail

## MT-010: Notification System Verification
**Feature:** Toast notifications for all game actions

**Description:** Verify notifications appear for all major game actions.

**Preconditions:**
- Game running

**Steps:**
1. Build a building - observe notification
2. Train a unit - observe notification
3. Reach resource cap - observe warning
4. Save/load - observe confirmation
5. Close browser - observe save notification

**Expected Result:**
- Clear toast notifications for all actions
- Notifications disappear appropriately
- No notification overlaps or duplication

**Pass/Fail Criteria:**
- PASS: All actions produce appropriate, clear notifications
- FAIL: Missing notifications or display issues

## MT-011: Error Handling and Validation
**Feature:** Error states and user feedback for invalid actions

**Description:** Verify game provides appropriate feedback for invalid operations.

**Preconditions:**
- Various game states with limited resources

**Steps:**
1. Attempt build with insufficient resources
2. Try train unit beyond unit cap
3. Attempt conquest with insufficient army
4. Try invalid hotkey combinations

**Expected Result:**
- Clear error messages for invalid actions
- UI prevents impossible operations
- Helpful feedback on how to resolve issues

**Pass/Fail Criteria:**
- PASS: All error cases handled gracefully with clear feedback

## Integration into Development Workflow

### Pre-Release Quality Assurance
- **Milestone Testing**: Execute all MT-001 to MT-011 after major features complete
- **Regression Cycle**: Run priority tests (UI critical: MT-001, MT-003, MT-005, MT-010) after bug fixes
- **Platform Validation**: Run critical UI tests (MT-001, MT-002, MT-008) across target browsers/devices

### Feature Development Integration
- **New UI Features**: Add custom MT-XX test case for each significant UI component
- **Game Mechanic Changes**: Design specific test procedures before feature completion
- **UX Improvements**: Test in user-facing flows before/after implementation

### Sprint Review Preparation
- **Demo Readiness**: Run MT-005 and MT-010 to ensure stable presentations
- **Acceptance Criteria**: Map sprint goals to specific test procedures
- **Defect Management**: Use test case IDs for bug reporting and tracking

### Continuous Integration Considerations
- **Automated Test Gaps**: Identify manual tests that could become automated
- **Performance Monitoring**: Track test execution times vs. feature complexity
- **Accessibility Validation**: Extend procedures for screen reader and keyboard navigation tests
- FAIL: Crashes, confusing errors, or silent failures
# Manual Test Procedures

This document provides structured, comprehensive manual test procedures for Lord of the Text game features that require human interaction and visual verification.

## Integration into Development Workflow

### Pre-Release Quality Assurance
- **Milestone Testing**: Execute all MT-001 to MT-011 after major features complete
- **Regression Cycle**: Run priority tests (UI critical: MT-001, MT-003, MT-005, MT-010) after bug fixes
- **Platform Validation**: Run critical UI tests (MT-001, MT-002, MT-008) across target browsers/devices

### Feature Development Integration
- **New UI Features**: Add custom MT-XX test case for each significant UI component
- **Game Mechanic Changes**: Design specific test procedures before feature completion
- **UX Improvements**: Test in user-facing flows before/after implementation

### Sprint Review Preparation
- **Demo Readiness**: Run MT-005 and MT-010 to ensure stable presentations
- **Acceptance Criteria**: Map sprint goals to specific test procedures
- **Defect Management**: Use test case IDs for bug reporting and tracking

### Continuous Integration Considerations
- **Automated Test Gaps**: Identify manual tests that could become automated
- **Performance Monitoring**: Track test execution times vs. feature complexity
- **Accessibility Validation**: Extend procedures for screen reader and keyboard navigation tests