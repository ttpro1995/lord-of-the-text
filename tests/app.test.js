import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '../src/App.jsx';

describe('Milestone 1 - Timber Resource System', () => {
  it('should start with 100 timber', () => {
    expect(initialState.resources.timber).toBe(100);
  });

  it('timber should stay the same per tick by default (no base production)', () => {
    const state = gameReducer(initialState, { type: 'TICK' });
    expect(state.resources.timber).toBe(100);
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

    // Check timber production - only from Lumber-Camp Lv 1 (no base production)
    // Lumber-Camp Lv 1 produces 5 timber per minute = 5/60 per tick
    const stateAfterTick = gameReducer(stateAfterBuild, { type: 'TICK' });
    expect(stateAfterTick.resources.timber).toBeCloseTo(
      stateAfterBuild.resources.timber + (5/60),
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

    // Check timber production - only from Lumber-Camp Lv 2 (no base production)
    // Lumber-Camp Lv 2 produces 12 timber per minute = 12/60 per tick
    const stateAfterTick = gameReducer(stateAfterUpgrade, { type: 'TICK' });
    expect(stateAfterTick.resources.timber).toBeCloseTo(
      stateAfterUpgrade.resources.timber + (12/60),
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

    // Check timber production - only from Lumber-Camp Lv 3 (no base production)
    // Lumber-Camp Lv 3 produces 28 timber per minute = 28/60 per tick
    const stateAfterTick = gameReducer(stateAfterUpgrade, { type: 'TICK' });
    expect(stateAfterTick.resources.timber).toBeCloseTo(
      stateAfterUpgrade.resources.timber + (28/60),
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

    // Verify timber has increased from Lumber-Camp production
    expect(currentState.resources.timber).toBeGreaterThan(timberBeforeTicks);

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

    // Set timber to a value below cap to test production increase
    currentState = {
      ...currentState,
      resources: {
        ...currentState.resources,
        timber: 190
      }
    };

    // Simulate several ticks after upgrade
    timberBeforeTicks = currentState.resources.timber;
    for (let i = 0; i < 10; i++) {
      currentState = gameReducer(currentState, { type: 'TICK' });
    }

    // Verify timber has increased from upgraded Lumber-Camp
    expect(currentState.resources.timber).toBeGreaterThan(timberBeforeTicks);
  });
});

describe('Hard Reset Feature', () => {
  it('should reset all state to initial values on HARD_RESET action', () => {
    // Create a modified state with resources, buildings, and units
    const modifiedState = {
      ...initialState,
      resources: {
        timber: 500,
        stone: 400,
        iron: 100,
        food: 300,
        gold: 150,
        knowledge: 200
      },
      buildings: {
        'Lumber-Camp': 3,
        'Farm': 2,
        'Quarry': 2,
        'Iron-Mine': 1,
        'Barracks': 1,
        'Warehouse': 1
      },
      units: [
        { type: 'Peasant-Spear', id: 1 },
        { type: 'Peasant-Spear', id: 2 }
      ],
      unitQueue: [
        { type: 'Peasant-Spear', progress: 10, trainingTime: 30 }
      ],
      notifications: ['Building complete', 'Unit ready'],
      version: 'v0.3'
    };

    // Dispatch HARD_RESET action
    const resetState = gameReducer(modifiedState, { type: 'HARD_RESET' });

    // Verify all resources are reset to initial values
    expect(resetState.resources.timber).toBe(initialState.resources.timber);
    expect(resetState.resources.stone).toBe(initialState.resources.stone);
    expect(resetState.resources.iron).toBe(initialState.resources.iron);
    expect(resetState.resources.food).toBe(initialState.resources.food);
    expect(resetState.resources.gold).toBe(initialState.resources.gold);
    expect(resetState.resources.knowledge).toBe(initialState.resources.knowledge);

    // Verify all buildings are reset to initial values
    expect(resetState.buildings['Lumber-Camp']).toBe(initialState.buildings['Lumber-Camp']);
    expect(resetState.buildings['Farm']).toBe(initialState.buildings['Farm']);
    expect(resetState.buildings['Quarry']).toBe(initialState.buildings['Quarry']);
    expect(resetState.buildings['Iron-Mine']).toBe(initialState.buildings['Iron-Mine']);
    expect(resetState.buildings['Barracks']).toBe(initialState.buildings['Barracks']);
    expect(resetState.buildings['Warehouse']).toBe(initialState.buildings['Warehouse']);

    // Verify units are reset
    expect(resetState.units).toEqual([]);
    expect(resetState.unitQueue).toEqual([]);

    // Verify notifications are reset
    expect(resetState.notifications).toEqual([]);

    // Verify version is preserved (as it's part of initialState)
    expect(resetState.version).toBe(initialState.version);
  });

  it('should reset state after multiple TICK actions', () => {
    // Start with initial state and simulate some ticks
    let state = initialState;
    for (let i = 0; i < 10; i++) {
      state = gameReducer(state, { type: 'TICK' });
    }

    // Dispatch HARD_RESET
    const resetState = gameReducer(state, { type: 'HARD_RESET' });

    // Should match initial state exactly
    expect(resetState).toEqual(initialState);
  });
});