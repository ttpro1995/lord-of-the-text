# Milestone 2 - Growing Estate (v0.3) Test Report

## Test Results Summary

### ✅ Working Features
1. **Version Badge**: Correctly shows v0.3
2. **Unit Training**:
   - Peasant Spear requires 10 Food and 5 Timber
   - Unit appears in army after training time
   - Resources are deducted when training starts
   - Unit cap of 5 is enforced
3. **Resource Production**:
   - Resources are produced from buildings
   - Resource caps are respected

### ❌ Issues Found

#### 1. Building Construction and Upgrades
- **Problem**: Buildings cannot be constructed due to resource constraints in tests
- **Details**: The initial state has 60 timber and 60 stone, but Quarry construction requires 50 timber and 30 food (not stone)
- **Impact**: Blocks testing of building dependencies and upgrades

#### 2. Dependency Gating
- **Problem**: Building dependencies are not properly checked
- **Details**:
  - Iron Mine requires Quarry Lv 2 but the dependency check fails
  - Barracks requires Farm Lv 2 but the dependency check fails
- **Impact**: Players can build buildings without meeting prerequisites

#### 3. Unit Cap Mechanics
- **Problem**: Unit cap doesn't increase with Barracks level
- **Details**: The unit cap calculation is correct (BASE_UNIT_CAP + barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL) but the test fails
- **Impact**: Players can't train more units as they upgrade barracks

#### 4. Toast Notifications
- **Problem**: Missing "Building complete" toast notifications
- **Details**: Only unit training notifications are implemented
- **Impact**: Players don't get feedback when buildings complete

#### 5. Tooltip Explanations
- **Problem**: Missing tooltips for unit cap mechanics
- **Details**: No tooltips are implemented
- **Impact**: Players may not understand game mechanics

## Manual Test Instructions

To manually test the application:

1. Open the application in a browser
2. Verify the version badge shows "v0.3"
3. Try building each Tier-0/1 building:
   - Farm (should work)
   - Quarry (should work)
   - Iron Mine (should be disabled until Quarry Lv 2)
   - Barracks (should be disabled until Farm Lv 2)
   - Warehouse (should work)
4. Train Peasant Spears and verify:
   - Costs 10 Food and 5 Timber
   - Appears in army after 30 seconds
   - Unit cap is enforced (max 5)
5. Test offline progress:
   - Close the tab for 5+ minutes
   - Reopen and check if resources continued to accrue
6. Check for toast notifications when:
   - Units finish training
   - Buildings complete (not implemented)

## Recommendations

1. Fix resource requirements for building construction
2. Implement proper dependency checking for buildings
3. Add "Building complete" toast notifications
4. Implement tooltips for unit cap mechanics
5. Test offline progress thoroughly