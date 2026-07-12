import { describe, it, expect } from 'vitest';
import { getBuildBlockers, getTrainingBlockers, formatBlockers } from '../src/utils/blockers.js';

const mockBuildingDefinitions = {
  "Lumber-Camp": {
    "1": {
      cost: { timber: 50, stone: 30 },
      production: { timber: 5 },
      dependencies: []
    },
    "2": {
      cost: { timber: 100, stone: 60 },
      production: { timber: 12 },
      dependencies: []
    },
    "3": {
      cost: { timber: 200, stone: 120 },
      production: { timber: 28 },
      dependencies: []
    }
  },
  "Iron-Mine": {
    "1": {
      cost: { timber: 60, stone: 40, food: 20 },
      production: { iron: 2 },
      dependencies: [{ building: "Quarry", level: 2 }]
    }
  },
  "Barracks": {
    "1": {
      cost: { timber: 70, food: 50 },
      production: {},
      dependencies: [{ building: "Farm", level: 2 }]
    }
  }
};

const mockUnitCosts = {
  "Peasant-Spear": { food: 10, timber: 5 }
};

describe('Blocker Helper Functions', () => {
  describe('getBuildBlockers', () => {
    it('should return MAX_LEVEL blocker when building is at max level', () => {
      const buildings = { "Lumber-Camp": 3 };
      const resources = { timber: 100, stone: 100, iron: 20, food: 20, gold: 20, knowledge: 20 };
      
      const blockers = getBuildBlockers("Lumber-Camp", buildings, resources, mockBuildingDefinitions);
      
      expect(blockers).toHaveLength(1);
      expect(blockers[0].code).toBe('MAX_LEVEL');
      expect(blockers[0].message).toBe('Max level reached');
    });

    it('should return MISSING_RESOURCE blockers for insufficient resources', () => {
      const buildings = { "Lumber-Camp": 0 };
      const resources = { timber: 20, stone: 10, iron: 20, food: 20, gold: 20, knowledge: 20 };
      
      const blockers = getBuildBlockers("Lumber-Camp", buildings, resources, mockBuildingDefinitions);
      
      // Should have 2 missing resource blockers (timber and stone deficit)
      const missingResourceBlockers = blockers.filter(b => b.code === 'MISSING_RESOURCE');
      expect(missingResourceBlockers).toHaveLength(2);
      
      expect(missingResourceBlockers[0].message).toBe('Missing: 30 Timber');
      expect(missingResourceBlockers[1].message).toBe('Missing: 20 Stone');
    });

    it('should return MISSING_DEPENDENCY blockers for unmet dependencies', () => {
      const buildings = { "Farm": 1, "Quarry": 1 }; // Farm not level 2
      const resources = { timber: 100, stone: 100, iron: 20, food: 20, gold: 20, knowledge: 20 };
      
      const blockers = getBuildBlockers("Barracks", buildings, resources, mockBuildingDefinitions);
      
      const depBlockers = blockers.filter(b => b.code === 'MISSING_DEPENDENCY');
      expect(depBlockers).toHaveLength(1);
      expect(depBlockers[0].message).toBe('Requires Farm Lv 2 (current Lv 1)');
    });

    it('should sort missing resources by largest deficit first', () => {
      const buildings = { "Iron-Mine": 0 };
      const resources = { timber: 10, stone: 10, food: 10, iron: 20, gold: 20, knowledge: 20 };
      
      const blockers = getBuildBlockers("Iron-Mine", buildings, resources, mockBuildingDefinitions);
      
      const missingResourceBlockers = blockers.filter(b => b.code === 'MISSING_RESOURCE');
      // All three resources are missing, sorted by largest deficit
      expect(missingResourceBlockers[0].details.missing).toBeGreaterThan(missingResourceBlockers[1].details.missing);
      expect(missingResourceBlockers[1].details.missing).toBeGreaterThan(missingResourceBlockers[2].details.missing);
    });

    it('should return empty array when no blockers exist', () => {
      const buildings = { "Lumber-Camp": 0 };
      const resources = { timber: 100, stone: 100, iron: 20, food: 20, gold: 20, knowledge: 20 };
      
      const blockers = getBuildBlockers("Lumber-Camp", buildings, resources, mockBuildingDefinitions);
      
      expect(blockers).toHaveLength(0);
    });

    it('should return blockers in correct order: dependencies first, then resources', () => {
      const buildings = { "Farm": 1, "Quarry": 1 };
      const resources = { timber: 10, stone: 10, food: 10, iron: 20, gold: 20, knowledge: 20 };
      
      const blockers = getBuildBlockers("Barracks", buildings, resources, mockBuildingDefinitions);
      
      // Check ordering
      const depIndex = blockers.findIndex(b => b.code === 'MISSING_DEPENDENCY');
      const resourceIndex = blockers.findIndex(b => b.code === 'MISSING_RESOURCE');
      expect(depIndex).toBeLessThan(resourceIndex);
    });
  });

  describe('getTrainingBlockers', () => {
    it('should return CAP_REACHED blocker when unit cap is reached', () => {
      const buildings = { "Barracks": 0 }; // Base cap = 5
      const resources = { timber: 100, stone: 100, iron: 20, food: 100, gold: 20, knowledge: 20 };
      const units = [{ type: "Peasant-Spear", id: 1 }, { type: "Peasant-Spear", id: 2 }, 
                     { type: "Peasant-Spear", id: 3 }, { type: "Peasant-Spear", id: 4 }, 
                     { type: "Peasant-Spear", id: 5 }]; // 5 units = cap reached
      const unitQueue = [];
      
      const blockers = getTrainingBlockers("Peasant-Spear", buildings, resources, units, unitQueue, mockUnitCosts);
      
      expect(blockers).toHaveLength(1);
      expect(blockers[0].code).toBe('CAP_REACHED');
      expect(blockers[0].message).toBe('Unit cap reached: 5/5');
    });

    it('should return MISSING_RESOURCE blockers for insufficient resources', () => {
      const buildings = { "Barracks": 0 };
      const resources = { timber: 2, stone: 20, iron: 20, food: 2, gold: 20, knowledge: 20 };
      const units = [];
      const unitQueue = [];
      
      const blockers = getTrainingBlockers("Peasant-Spear", buildings, resources, units, unitQueue, mockUnitCosts);
      
      const missingResourceBlockers = blockers.filter(b => b.code === 'MISSING_RESOURCE');
      expect(missingResourceBlockers).toHaveLength(2);
      expect(missingResourceBlockers[0].code).toBe('MISSING_RESOURCE');
    });

    it('should return empty array when no blockers exist', () => {
      const buildings = { "Barracks": 0 };
      const resources = { timber: 100, stone: 100, iron: 20, food: 100, gold: 20, knowledge: 20 };
      const units = [];
      const unitQueue = [];
      
      const blockers = getTrainingBlockers("Peasant-Spear", buildings, resources, units, unitQueue, mockUnitCosts);
      
      expect(blockers).toHaveLength(0);
    });

    it('should check cap against both units and queue', () => {
      const buildings = { "Barracks": 0 }; // Base cap = 5
      const resources = { timber: 100, stone: 100, iron: 20, food: 100, gold: 20, knowledge: 20 };
      const units = [{ type: "Peasant-Spear", id: 1 }];
      const unitQueue = [{ type: "Peasant-Spear", progress: 10, trainingTime: 30 }];
      
      const blockers = getTrainingBlockers("Peasant-Spear", buildings, resources, units, unitQueue, mockUnitCosts);
      
      // 1 unit + 1 in queue = 2, should still be able to train
      expect(blockers).toHaveLength(0);
    });
  });

  describe('formatBlockers', () => {
    it('should join blocker messages with newlines', () => {
      const blockers = [
        { code: 'MISSING_DEPENDENCY', message: 'Requires Farm Lv 2 (current Lv 1)', details: {} },
        { code: 'MISSING_RESOURCE', message: 'Missing: 30 Timber', details: {} }
      ];
      
      const result = formatBlockers(blockers);
      
      expect(result).toBe('Requires Farm Lv 2 (current Lv 1)\nMissing: 30 Timber');
    });

    it('should return empty string for empty blockers', () => {
      expect(formatBlockers([])).toBe('');
    });
  });
});