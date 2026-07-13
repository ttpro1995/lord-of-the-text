import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gameReducer, initialState } from '../src/App';
import buildingDefinitions from '../data/building-definitions.json';

describe('Milestone 2 - Growing Estate (v0.3)', () => {
  let state;

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(initialState));
  });

  describe('Building Construction and Upgrades', () => {
    it('should allow building Tier-0/1 buildings', () => {
      // Test Farm construction (from fresh state each time to avoid resource issues)
      let testState = { ...initialState };
      let newState = gameReducer(testState, { type: 'BUILD', payload: 'Farm' });
      expect(newState.buildings['Farm']).toBe(1);

      // Test Quarry construction (needs 50 timber, 30 food - initial food is only 20)
      testState = { ...initialState, resources: { ...initialState.resources, food: 50 } };
      newState = gameReducer(testState, { type: 'BUILD', payload: 'Quarry' });
      expect(newState.buildings['Quarry']).toBe(1);

      // Test Warehouse construction (from fresh state with enough resources)
      testState = { ...initialState, resources: { ...initialState.resources, timber: 200, stone: 200, food: 100 } };
      newState = gameReducer(testState, { type: 'BUILD', payload: 'Warehouse' });
      expect(newState.buildings['Warehouse']).toBe(1);
    });

    it('should respect building dependencies', () => {
      // Try to build Iron Mine without Quarry Lv 2 (should fail)
      let newState = gameReducer(state, { type: 'BUILD', payload: 'Iron-Mine' });
      expect(newState.buildings['Iron-Mine']).toBe(0);

      // Build Quarry to Lv 2 (needs: 50+100=150 timber, 30+60=90 food for Quarry, plus 60 timber, 40 stone, 20 food for Iron Mine)
      let testState = { ...initialState, resources: { ...initialState.resources, timber: 300, food: 200, stone: 100 } };
      newState = gameReducer(testState, { type: 'BUILD', payload: 'Quarry' });
      newState = gameReducer(newState, { type: 'UPGRADE', payload: 'Quarry' });
      expect(newState.buildings['Quarry']).toBe(2);

      // Now Iron Mine should be buildable
      newState = gameReducer(newState, { type: 'BUILD', payload: 'Iron-Mine' });
      expect(newState.buildings['Iron-Mine']).toBe(1);
    });

    it('should respect Barracks dependency on Farm Lv 2', () => {
      // Try to build Barracks without Farm Lv 2 (should fail)
      let newState = gameReducer(state, { type: 'BUILD', payload: 'Barracks' });
      expect(newState.buildings['Barracks']).toBe(0);

      // Build Farm to Lv 2 (needs: 40+80=120 timber, 20+40=60 stone for Farm, plus 70 timber, 50 food for Barracks)
      let testState = { ...initialState, resources: { ...initialState.resources, timber: 250, stone: 100, food: 100 } };
      newState = gameReducer(testState, { type: 'BUILD', payload: 'Farm' });
      newState = gameReducer(newState, { type: 'UPGRADE', payload: 'Farm' });
      expect(newState.buildings['Farm']).toBe(2);

      // Now Barracks should be buildable
      newState = gameReducer(newState, { type: 'BUILD', payload: 'Barracks' });
      expect(newState.buildings['Barracks']).toBe(1);
    });
  });

  describe('Unit Training', () => {
    it('should train Peasant Spear with correct resource cost', () => {
      // Add enough resources
      state.resources.food = 20;
      state.resources.timber = 20;

      // Build Barracks first
      state.buildings['Farm'] = 2;
      state = gameReducer(state, { type: 'BUILD', payload: 'Barracks' });

      // Train unit
      const newState = gameReducer(state, {
        type: 'TRAIN_UNIT',
        payload: { unitType: 'Peasant-Spear' }
      });

      // Check resource deduction
      expect(newState.resources.food).toBe(10); // 20 - 10 = 10
      expect(newState.resources.timber).toBe(15); // 20 - 5 = 15

      // Check unit in queue
      expect(newState.unitQueue.length).toBe(1);
      expect(newState.unitQueue[0].type).toBe('Peasant-Spear');
    });

    it('should respect unit cap', () => {
      // Add enough resources
      state.resources.food = 100;
      state.resources.timber = 100;

      // Build Barracks
      state.buildings['Farm'] = 2;
      state = gameReducer(state, { type: 'BUILD', payload: 'Barracks' });

      // Train 5 units (base cap)
      for (let i = 0; i < 5; i++) {
        state = gameReducer(state, {
          type: 'TRAIN_UNIT',
          payload: { unitType: 'Peasant-Spear' }
        });
      }

      // Check that we can't train more than the cap
      const newState = gameReducer(state, {
        type: 'TRAIN_UNIT',
        payload: { unitType: 'Peasant-Spear' }
      });

      // Should not be able to train more
      expect(newState.unitQueue.length).toBe(5); // Still 5, not 6
    });

    it('should increase unit cap with Barracks level', () => {
      // Add enough resources for Farm L1+L2, Barracks L1+L2, and 15 units
      // Farm L1: 40 timber, 20 stone
      // Farm L2: 80 timber, 40 stone
      // Barracks L1: 70 timber, 50 food
      // Barracks L2: 140 timber, 100 food
      // 15 units: 150 food, 75 timber
      state.resources.food = 400;
      state.resources.timber = 600;
      state.resources.stone = 100;

      // Build and upgrade Barracks to Lv 2
      state = gameReducer(state, { type: 'BUILD', payload: 'Farm' });
      state = gameReducer(state, { type: 'UPGRADE', payload: 'Farm' });
      state = gameReducer(state, { type: 'BUILD', payload: 'Barracks' });
      state = gameReducer(state, { type: 'UPGRADE', payload: 'Barracks' });

      // Barracks Lv 2 gives cap = 5 (base) + 2*5 = 15
      // Train 15 units
      for (let i = 0; i < 15; i++) {
        state = gameReducer(state, {
          type: 'TRAIN_UNIT',
          payload: { unitType: 'Peasant-Spear' }
        });
      }

      // Check that we can't train more than the cap
      const newState = gameReducer(state, {
        type: 'TRAIN_UNIT',
        payload: { unitType: 'Peasant-Spear' }
      });

      // Should not be able to train more
      expect(newState.unitQueue.length).toBe(15); // Still 15, not 16
    });
  });

  describe('Resource Production and Offline Progress', () => {
    it('should produce resources from buildings', () => {
      // Build a Farm
      state = gameReducer(state, { type: 'BUILD', payload: 'Farm' });

      // Simulate 60 ticks (60 seconds)
      for (let i = 0; i < 60; i++) {
        state = gameReducer(state, { type: 'TICK' });
      }

      // Farm produces 3 food per minute
      expect(state.resources.food).toBeGreaterThan(10); // Initial 10 + production
    });

    it('should respect resource caps', () => {
      // Set initial resources near cap
      state.resources.timber = 190;

      // Build Lumber Camp
      state = gameReducer(state, { type: 'BUILD', payload: 'Lumber-Camp' });

      // Simulate production
      for (let i = 0; i < 60; i++) {
        state = gameReducer(state, { type: 'TICK' });
      }

      // Should not exceed cap of 200
      expect(state.resources.timber).toBeLessThanOrEqual(200);
    });
  });

  describe('Notifications', () => {
    it('should show unit ready notification', () => {
      // Add enough resources
      state.resources.food = 20;
      state.resources.timber = 20;

      // Build Barracks
      state.buildings['Farm'] = 2;
      state = gameReducer(state, { type: 'BUILD', payload: 'Barracks' });

      // Train unit
      state = gameReducer(state, {
        type: 'TRAIN_UNIT',
        payload: { unitType: 'Peasant-Spear' }
      });

      // Simulate training time (30 ticks)
      for (let i = 0; i < 30; i++) {
        state = gameReducer(state, { type: 'TICK' });
      }

      // Check notification
      expect(state.notifications.length).toBeGreaterThan(0);
      expect(state.notifications[0]).toContain('Unit ready');
    });

    it('should show building complete notification when building new structure', () => {
      // Ensure we have enough resources for Farm (40 timber, 20 stone)
      state.resources.timber = 100;
      state.resources.stone = 50;

      // Build Farm
      const newState = gameReducer(state, { type: 'BUILD', payload: 'Farm' });

      // Check notification
      expect(newState.notifications.length).toBe(1);
      expect(newState.notifications[0]).toBe('Farm complete');
      expect(newState.buildings['Farm']).toBe(1);
      expect(newState.resources.timber).toBe(60); // 100 - 40 = 60
      expect(newState.resources.stone).toBe(30); // 50 - 20 = 30
    });

    it('should show building complete notification when upgrading existing building', () => {
      // Set up Farm at level 1
      state.buildings['Farm'] = 1;
      // Ensure we have enough resources for upgrade (80 timber, 40 stone)
      state.resources.timber = 100;
      state.resources.stone = 50;

      // Upgrade Farm to level 2
      const newState = gameReducer(state, { type: 'UPGRADE', payload: 'Farm' });

      // Check notification
      expect(newState.notifications.length).toBe(1);
      expect(newState.notifications[0]).toBe('Farm complete');
      expect(newState.buildings['Farm']).toBe(2);
      expect(newState.resources.timber).toBe(20); // 100 - 80 = 20
      expect(newState.resources.stone).toBe(10); // 50 - 40 = 10
    });

    it('should not show notification when building fails due to dependencies', () => {
      // Try to build Iron Mine without Quarry level 2
      // Iron Mine requires Quarry level 2
      state.buildings['Quarry'] = 1; // Only level 1
      state.resources.timber = 200;
      state.resources.stone = 100;
      state.resources.food = 200;

      const newState = gameReducer(state, { type: 'BUILD', payload: 'Iron-Mine' });

      // Should not build and no notification
      expect(newState.buildings['Iron-Mine']).toBe(0);
      expect(newState.notifications.length).toBe(0);
    });

    it('should not show notification when building fails due to insufficient resources', () => {
      // Try to build Barracks with insufficient resources
      // Barracks requires 70 timber, 50 food but we only have 50 timber, 30 food
      state.resources.timber = 50;
      state.resources.food = 30;
      // Ensure dependency (Farm level 2) is met
      state.buildings['Farm'] = 2;

      const newState = gameReducer(state, { type: 'BUILD', payload: 'Barracks' });

      // Should not build and no notification
      expect(newState.buildings['Barracks']).toBe(0);
      expect(newState.notifications.length).toBe(0);
      // Resources should remain unchanged
      expect(newState.resources.timber).toBe(50);
      expect(newState.resources.food).toBe(30);
    });
  });
});