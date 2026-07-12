import buildingDefinitions from '../../data/building-definitions.json';
import gameConstants from '../data/game-constants.json';
import { initialState, BASE_RESOURCE_CAPS, calculateResourceCap } from './gameState.js';
import { BASE_UNIT_CAP, UNIT_CAP_PER_BARRACKS_LEVEL } from './unitConstants.js';

// Reducer function
export function gameReducer(state, action) {
  switch (action.type) {
    case 'HARD_RESET':
      return initialState;
    case 'TICK': {
      let newResources = { ...state.resources };

      // Process resource production from buildings
      Object.entries(state.buildings).forEach(([buildingName, level]) => {
        if (level > 0 && buildingDefinitions[buildingName]) {
          const production = buildingDefinitions[buildingName][level].production || {};
          Object.entries(production).forEach(([resource, amount]) => {
            const amountPerTick = amount / 60;
            newResources[resource] = Math.min(
              calculateResourceCap(resource, state),
              newResources[resource] + amountPerTick
            );
          });
        }
      });

      // Process unit training queue
      let newUnitQueue = [...state.unitQueue];
      let newUnits = [...state.units];
      let notifications = [];

      newUnitQueue = newUnitQueue.map(item => {
        const updatedItem = { ...item, progress: item.progress + 1 };
        if (updatedItem.progress >= updatedItem.trainingTime) {
          newUnits.push({
            type: updatedItem.type,
            id: Date.now() + Math.random()
          });
          notifications.push({
            id: `notif-${Date.now()}-${Math.random()}`,
            message: `Unit ready: ${updatedItem.type}`,
            timestamp: Date.now()
          });
          return null; // Remove from queue
        }
        return updatedItem;
      }).filter(Boolean);

      // Calculate and apply food consumption from units
      const totalFoodConsumption = newUnits.reduce((total, unit) => {
        const consumptionPerMinute = gameConstants.unitFoodConsumption[unit.type] || 0;
        return total + (consumptionPerMinute / 60);
      }, 0);
      newResources.food = Math.max(0, newResources.food - totalFoodConsumption);

      return {
        ...state,
        resources: newResources,
        units: newUnits,
        unitQueue: newUnitQueue,
        notifications: notifications.length > 0 ? notifications : state.notifications
      };
    }
    case 'BUILD':
    case 'UPGRADE': {
      const buildingName = action.payload;
      const currentLevel = state.buildings[buildingName] || 0;
      const nextLevel = currentLevel + 1;
      const definition = buildingDefinitions[buildingName]?.[nextLevel];

      if (!definition) return state; // Max level reached or invalid building

      // Check dependencies
      const dependencies = definition.dependencies || [];
      const hasDependencies = dependencies.every(dep => {
        const requiredBuildingLevel = state.buildings[dep.building] || 0;
        return requiredBuildingLevel >= dep.level;
      });

      if (!hasDependencies) {
        return state; // Don't show notification on dependency failure
      }

      const costs = definition.cost;
      const canAfford = Object.entries(costs).every(
        ([resource, cost]) => state.resources[resource.toLowerCase()] >= cost
      );

      if (canAfford) {
        console.log(`Deducting resources for ${buildingName} level ${nextLevel}:`, costs);
        const newResources = { ...state.resources };
        Object.entries(costs).forEach(([resource, cost]) => {
          const resourceKey = resource.toLowerCase();
          newResources[resourceKey] -= cost;
        });

        const newNotification = {
          id: `notif-${Date.now()}-${Math.random()}`,
          message: `${buildingName} complete`,
          timestamp: Date.now()
        };

        return {
          ...state,
          resources: newResources,
          buildings: {
            ...state.buildings,
            [buildingName]: nextLevel,
          },
          notifications: [newNotification, ...state.notifications]
        };
      }
      if (!canAfford) {
        return state; // Don't show notification on resource failure
      }
      break; // Add missing break statement
    }
    case 'TRAIN_UNIT': {
      const { unitType } = action.payload;
      const unitCost = gameConstants.unitCosts[unitType];

      if (!unitCost) return state;

      const canAfford = Object.entries(unitCost).every(
        ([resource, cost]) => state.resources[resource] >= cost
      );

      if (!canAfford) return state;

      const barracksLevel = state.buildings["Barracks"] || 0;
      const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);

      // Check total units (trained + in queue) against cap
      if (state.units.length + state.unitQueue.length >= unitCap) {
        console.log("Unit cap reached");
        return state;
      }

      const newResources = { ...state.resources };
      Object.entries(unitCost).forEach(([resource, cost]) => {
        newResources[resource] -= cost;
      });

      const trainingTime = gameConstants.unitTrainingTimes[unitType] || 30;
      const newUnitQueue = [
        ...state.unitQueue,
        {
          type: unitType,
          progress: 0,
          trainingTime
        }
      ];

      return {
        ...state,
        resources: newResources,
        unitQueue: newUnitQueue
      };
    }
    case 'TRAIN_UNITS_BATCH': {
      const { unitType, quantity } = action.payload;
      const unitCost = gameConstants.unitCosts[unitType];
      const trainingTime = gameConstants.unitTrainingTimes[unitType] || 30;

      if (!unitCost || quantity <= 0) return state;

      // Calculate total cost for all units
      const totalCost = {};
      Object.entries(unitCost).forEach(([resource, cost]) => {
        totalCost[resource] = cost * quantity;
      });

      const canAffordBatch = Object.entries(totalCost).every(
        ([resource, cost]) => state.resources[resource] >= cost
      );

      if (!canAffordBatch) return state;

      const barracksLevel = state.buildings["Barracks"] || 0;
      const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);

      // Check total units (trained + in queue + new batch) against cap
      if (state.units.length + state.unitQueue.length + quantity > unitCap) {
        return state;
      }

      const newResources = { ...state.resources };
      Object.entries(totalCost).forEach(([resource, cost]) => {
        newResources[resource] -= cost;
      });

      const newUnitQueue = [...state.unitQueue];
      for (let i = 0; i < quantity; i++) {
        newUnitQueue.push({
          type: unitType,
          progress: 0,
          trainingTime
        });
      }

      return {
        ...state,
        resources: newResources,
        unitQueue: newUnitQueue
      };
    }
    case 'CANCEL_TRAINING': {
      const { queueIndex } = action.payload;
      const item = state.unitQueue[queueIndex];
      if (!item) return state;

      // Refund resources
      const unitCost = gameConstants.unitCosts[item.type];
      const newResources = { ...state.resources };
      if (unitCost) {
        Object.entries(unitCost).forEach(([resource, cost]) => {
          newResources[resource] += cost;
        });
      }

      const newUnitQueue = state.unitQueue.filter((_, index) => index !== queueIndex);

      return {
        ...state,
        resources: newResources,
        unitQueue: newUnitQueue
      };
    }
    case 'DISMISS_UNIT': {
      const { unitId } = action.payload;
      const unitIndex = state.units.findIndex(u => u.id === unitId);
      if (unitIndex === -1) return state;

      const newUnits = state.units.filter(u => u.id !== unitId);

      return {
        ...state,
        units: newUnits
      };
    }
    case 'DISMISS_UNITS': {
      const { unitType, count } = action.payload;
      if (count <= 0) return state;

      const matchingUnits = state.units.filter(u => u.type === unitType);
      const toDismiss = Math.min(count, matchingUnits.length);

      const unitsToKeep = state.units.filter(u => u.type !== unitType);
      const newUnits = [...unitsToKeep, ...matchingUnits.slice(toDismiss)];

      return {
        ...state,
        units: newUnits
      };
    }
    case 'BULK_DISMISS_UNITS': {
      const { unitIds } = action.payload;
      if (!unitIds || unitIds.length === 0) return state;

      const newUnits = state.units.filter(u => !unitIds.includes(u.id));

      return {
        ...state,
        units: newUnits
      };
    }
    case 'OFFLINE_PROGRESS': {
      const { seconds } = action.payload;
      let newResources = { ...state.resources };
      let newUnits = [...state.units];
      let newUnitQueue = [...state.unitQueue];
      let notifications = [...state.notifications]; // Copy any existing notifications

// Calculate resource production over offline period
       Object.entries(state.buildings).forEach(([buildingName, level]) => {
         if (level > 0 && buildingDefinitions[buildingName]) {
           const production = buildingDefinitions[buildingName][level].production || {};
           Object.entries(production).forEach(([resource, amountPerMinute]) => {
             const amountPerSecond = amountPerMinute / 60;
             const totalGain = amountPerSecond * seconds;
             newResources[resource] = Math.min(
               calculateResourceCap(resource, state),
               newResources[resource] + totalGain
             );
           });
         }
       });

      // Advance unit training queue over offline period
      newUnitQueue = newUnitQueue.map(item => {
        const newProgress = item.progress + seconds;
        if (newProgress >= item.trainingTime) {
          newUnits.push({
            type: item.type,
            id: Date.now() + Math.random()
          });
          notifications.push({
            id: `notif-${Date.now()}-${Math.random()}`,
            message: `Unit ready: ${item.type}`,
            timestamp: Date.now()
          });
          return null; // Remove from queue
        }
        return { ...item, progress: newProgress };
      }).filter(Boolean);

      // Calculate and apply food consumption over offline period
      const totalFoodConsumption = newUnits.reduce((total, unit) => {
        const consumptionPerMinute = gameConstants.unitFoodConsumption[unit.type] || 0;
        return total + (consumptionPerMinute / 60) * seconds;
      }, 0);
      newResources.food = Math.max(0, newResources.food - totalFoodConsumption);

      return {
        ...state,
        resources: newResources,
        units: newUnits,
        unitQueue: newUnitQueue,
        notifications: notifications
      };
    }
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}