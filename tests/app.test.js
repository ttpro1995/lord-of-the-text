import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '../src/App.jsx';
import buildingDefinitions from '../data/building-definitions.json';

describe('Milestone 1 - Timber Resource System', () => {
  it('should start with 60 timber', () => {
    expect(initialState.resources.timber).toBe(60);
  });

  it('should produce 1 timber per tick by default', () => {
    const state = gameReducer(initialState, { type: 'TICK' });
    expect(state.resources.timber).toBe(1);
  });



  it('should increase timber production when Lumber-Camp is built', () => {
    // First, give the player enough resources to build Lumber-Camp
    const stateWithResources = {
      ...initialState,
      resources: {
        ...initialState.resources,
        timber: 50,
        stone: 30
      }
    };

    // Build Lumber-Camp
    const stateAfterBuild = gameReducer(stateWithResources, { 
      type: 'BUILD', 
      payload: 'Lumber-Camp' 
    });

    // Check that Lumber-Camp was built
    expect(stateAfterBuild.buildings['Lumber-Camp']).toBe(1);

    // Check timber production - base 1 + Lumber-Camp Lv 1 production
    // Lumber-Camp Lv 1 produces 5 timber per minute = 5/60 per second
    const stateAfterTick = gameReducer(stateAfterBuild, { type: 'TICK' });
    expect(stateAfterTick.resources.timber).toBeCloseTo(
      stateAfterBuild.resources.timber + 1 + (5/60), 
      10
    );
  });

  it('should increase timber production when Lumber-Camp is upgraded', () => {
    // Create a state with Lumber-Camp already built and enough resources for upgrade
    const stateWithCamp = {
      ...initialState,
      buildings: {
        ...initialState.buildings,
        'Lumber-Camp': 1
      },
      resources: {
        ...initialState.resources,
        timber: 150, // Enough for upgrade to Lv 2 (100)
        stone: 90   // Enough for upgrade to Lv 2 (60)
      }
    };

    // Upgrade Lumber-Camp to level 2
    const stateAfterUpgrade = gameReducer(stateWithCamp, { 
      type: 'UPGRADE', 
      payload: 'Lumber-Camp' 
    });

    // Check that Lumber-Camp was upgraded
    expect(stateAfterUpgrade.buildings['Lumber-Camp']).toBe(2);

    // Check timber production - base 1 + Lumber-Camp Lv 2 production
    // Lumber-Camp Lv 2 produces 12 timber per minute = 12/60 per second
    const stateAfterTick = gameReducer(stateAfterUpgrade, { type: 'TICK' });
    expect(stateAfterTick.resources.timber).toBeCloseTo(
      stateAfterUpgrade.resources.timber + 1 + (12/60),
      10
    );
  });

  it('should further increase timber production when Lumber-Camp is upgraded again', () => {
    // Create a state with Lumber-Camp at level 2 and enough resources for upgrade to level 3
    const stateWithCampLv2 = {
      ...initialState,
      buildings: {
        ...initialState.buildings,
        'Lumber-Camp': 2
      },
      resources: {
        ...initialState.resources,
        timber: 300, // Enough for upgrade to Lv 3 (200)
        stone: 200   // Enough for upgrade to Lv 3 (120)
      }
    };

    // Upgrade Lumber-Camp to level 3
    const stateAfterUpgrade = gameReducer(stateWithCampLv2, { 
      type: 'UPGRADE', 
      payload: 'Lumber-Camp' 
    });

    // Check that Lumber-Camp was upgraded
    expect(stateAfterUpgrade.buildings['Lumber-Camp']).toBe(3);

    // Check timber production - base 1 + Lumber-Camp Lv 3 production
    // Lumber-Camp Lv 3 produces 28 timber per minute = 28/60 per second
    const stateAfterTick = gameReducer(stateAfterUpgrade, { type: 'TICK' });
    expect(stateAfterTick.resources.timber).toBeCloseTo(
      stateAfterUpgrade.resources.timber + 1 + (28/60),
      10
    );
  });

  it('should verify the play test scenario works correctly', () => {
    // Start with initial state
    let currentState = { ...initialState };

    // Give player enough resources to build Lumber-Camp
    currentState = {
      ...currentState,
      resources: {
        ...currentState.resources,
        timber: 50,
        stone: 30
      }
    };

    // Build Lumber-Camp
    currentState = gameReducer(currentState, { 
      type: 'BUILD', 
      payload: 'Lumber-Camp' 
    });

    // Verify Lumber-Camp is built
    expect(currentState.buildings['Lumber-Camp']).toBe(1);

    // Simulate several ticks to see timber rise
    let timberBeforeTicks = currentState.resources.timber;
    for (let i = 0; i < 10; i++) {
      currentState = gameReducer(currentState, { type: 'TICK' });
    }

    // Verify timber has increased (faster than base production)
    expect(currentState.resources.timber).toBeGreaterThan(timberBeforeTicks + 10);

    // Simulate ticks until timber reaches cap
    while (currentState.resources.timber < 200) {
      currentState = gameReducer(currentState, { type: 'TICK' });
    }

    // Verify timber is at cap
    expect(currentState.resources.timber).toBe(200);

    // Give player enough resources to upgrade Lumber-Camp
    currentState = {
      ...currentState,
      resources: {
        ...currentState.resources,
        timber: 300, // More than needed for Lv 2 (100)
        stone: 150   // More than needed for Lv 2 (60)
      }
    };

    // Upgrade Lumber-Camp
    currentState = gameReducer(currentState, { 
      type: 'UPGRADE', 
      payload: 'Lumber-Camp' 
    });

    // Verify Lumber-Camp is upgraded
    expect(currentState.buildings['Lumber-Camp']).toBe(2);

    // Simulate several ticks after upgrade
    timberBeforeTicks = currentState.resources.timber;
    for (let i = 0; i < 10; i++) {
      currentState = gameReducer(currentState, { type: 'TICK' });
    }

    // Verify timber has increased (even faster production after upgrade)
    expect(currentState.resources.timber).toBeGreaterThan(timberBeforeTicks);
  });
});