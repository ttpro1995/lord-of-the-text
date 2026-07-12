// Pure helper functions for computing blocked action explanations

import gameConstants from '../data/game-constants.json';

export const BASE_UNIT_CAP = gameConstants.baseUnitCap;
export const UNIT_CAP_PER_BARRACKS_LEVEL = gameConstants.unitCapPerBarracksLevel;

/**
 * Get resource name with proper casing
 */
function formatResourceName(resourceKey) {
  return resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1);
}

/**
 * Compute blockers for a building action
 * @param {string} buildingName - Name of the building
 * @param {object} buildings - Current buildings state
 * @param {object} resources - Current resources state
 * @param {object} buildingDefinitions - Building definitions data
 * @returns {array} Ordered blockers (dependencies first, then resources)
 */
export function getBuildBlockers(buildingName, buildings, resources, buildingDefinitions) {
  const blockers = [];
  const currentLevel = buildings[buildingName] || 0;
  const nextLevel = currentLevel + 1;
  const definition = buildingDefinitions[buildingName]?.[nextLevel];

  // Check if max level reached
  if (!definition) {
    blockers.push({
      code: 'MAX_LEVEL',
      message: 'Max level reached',
      details: {}
    });
    return blockers;
  }

  // Check dependencies (sorted alphabetically for stable order)
  const dependencies = definition.dependencies || [];
  const unmetDeps = [...dependencies].sort((a, b) => 
    a.building.localeCompare(b.building)
  ).filter(dep => {
    const requiredBuildingLevel = buildings[dep.building] || 0;
    return requiredBuildingLevel < dep.level;
  });

  unmetDeps.forEach(dep => {
    const currentLevel = buildings[dep.building] || 0;
    blockers.push({
      code: 'MISSING_DEPENDENCY',
      message: `Requires ${formatBuildingName(dep.building)} Lv ${dep.level} (current Lv ${currentLevel})`,
      details: {
        building: dep.building,
        requiredLevel: dep.level,
        currentLevel: currentLevel
      }
    });
  });

  // Check resources (sorted by largest missing first)
  const costs = definition.cost || {};
  const missingResources = Object.entries(costs)
    .map(([resource, cost]) => ({
      resource,
      missing: cost - (resources[resource.toLowerCase()] || 0)
    }))
    .filter(({ missing }) => missing > 0)
    .sort((a, b) => b.missing - a.missing);

  missingResources.forEach(({ resource, missing }) => {
    blockers.push({
      code: 'MISSING_RESOURCE',
      message: `Missing: ${missing} ${formatResourceName(resource)}`,
      details: {
        resource,
        missing
      }
    });
  });

  return blockers;
}

/**
 * Format building name for display
 */
function formatBuildingName(buildingName) {
  return buildingName.replace('-', ' ');
}

/**
 * Compute blockers for unit training action
 * @param {string} unitType - Type of unit to train
 * @param {object} buildings - Current buildings state
 * @param {object} resources - Current resources state
 * @param {array} units - Currently trained units
 * @param {array} unitQueue - Currently queued units
 * @param {object} unitCosts - Unit cost definitions
 * @returns {array} Ordered blockers (cap first, then resources)
 */
export function getTrainingBlockers(unitType, buildings, resources, units, unitQueue, unitCosts) {
  const blockers = [];
  const unitCost = unitCosts[unitType];

  if (!unitCost) {
    blockers.push({
      code: 'INVALID_ACTION',
      message: 'Invalid unit type',
      details: {}
    });
    return blockers;
  }

  // Check unit cap
  const barracksLevel = buildings["Barracks"] || 0;
  const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);
  const totalUnits = units.length + unitQueue.length;

  if (totalUnits >= unitCap) {
    blockers.push({
      code: 'CAP_REACHED',
      message: `Unit cap reached: ${totalUnits}/${unitCap}`,
      details: {
        currentCap: totalUnits,
        maxCap: unitCap
      }
    });
  }

  // Check resources
  const missingResources = Object.entries(unitCost)
    .map(([resource, cost]) => ({
      resource,
      missing: cost - (resources[resource] || 0)
    }))
    .filter(({ missing }) => missing > 0)
    .sort((a, b) => b.missing - a.missing);

  missingResources.forEach(({ resource, missing }) => {
    blockers.push({
      code: 'MISSING_RESOURCE',
      message: `Missing: ${missing} ${formatResourceName(resource)}`,
      details: {
        resource,
        missing
      }
    });
  });

  return blockers;
}

/**
 * Format blockers for display in UI
 * @param {array} blockers - Array of blocker objects
 * @returns {string} Formatted display string
 */
export function formatBlockers(blockers) {
  if (blockers.length === 0) return '';
  return blockers.map(b => b.message).join('\n');
}