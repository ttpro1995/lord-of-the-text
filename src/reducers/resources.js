import buildingDefinitions from '../../data/building-definitions.json';
import { RESOURCE_CAPS } from '../App.jsx';

export const initialResources = {
  timber: 100,
  stone: 100,
  iron: 20,
  food: 20,
  gold: 20,
  knowledge: 20
};

export function resourcesReducer(resources = initialResources, action, buildings) {
  switch (action.type) {
    case 'TICK': {
      let newResources = { ...resources };
      let notifications = [];

      // Process resource production from buildings
      Object.entries(buildings).forEach(([buildingName, level]) => {
        if (level > 0 && buildingDefinitions[buildingName]) {
          const production = buildingDefinitions[buildingName][level].production || {};
          Object.entries(production).forEach(([resource, amount]) => {
            const amountPerTick = amount / 60;
            const previousAmount = newResources[resource];
            newResources[resource] = Math.min(
              RESOURCE_CAPS[resource],
              newResources[resource] + amountPerTick
            );

            // Check if resource reached cap
            if (newResources[resource] >= RESOURCE_CAPS[resource] && previousAmount < RESOURCE_CAPS[resource]) {
              const capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
              notifications.push(`${capitalizedResource} storage is full!`);
            }

            // Check for production milestones (multiples of 50)
            const milestone = Math.floor(newResources[resource] / 50) * 50;
            const previousMilestone = Math.floor(previousAmount / 50) * 50;
            if (milestone > previousMilestone && milestone <= RESOURCE_CAPS[resource]) {
              const capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
              notifications.push(`${capitalizedResource} production milestone: ${milestone}!`);
            }
          });
        }
      });

      return { resources: newResources, notifications };
    }
    case 'DEDUCT_RESOURCES': {
      const { costs } = action.payload;
      let newResources = { ...resources };
      Object.entries(costs).forEach(([resource, cost]) => {
        const resourceKey = resource.toLowerCase();
        newResources[resourceKey] -= cost;
      });
      return { resources: newResources, notifications: [] };
    }
    case 'OFFLINE_PROGRESS': {
      const { seconds } = action.payload;
      let newResources = { ...resources };
      let notifications = [];

      // Calculate resource production over offline period
      Object.entries(buildings).forEach(([buildingName, level]) => {
        if (level > 0 && buildingDefinitions[buildingName]) {
          const production = buildingDefinitions[buildingName][level].production || {};
          Object.entries(production).forEach(([resource, amountPerMinute]) => {
            const amountPerSecond = amountPerMinute / 60;
            const totalGain = amountPerSecond * seconds;
            const previousAmount = newResources[resource];
            newResources[resource] = Math.min(
              RESOURCE_CAPS[resource],
              newResources[resource] + totalGain
            );

            // Check if resource reached cap during offline progress
            if (newResources[resource] >= RESOURCE_CAPS[resource] && previousAmount < RESOURCE_CAPS[resource]) {
              const capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
              notifications.push(`${capitalizedResource} storage is full! (Offline progress)`);
            }

            // Check for production milestones (multiples of 50) during offline progress
            const milestone = Math.floor(newResources[resource] / 50) * 50;
            const previousMilestone = Math.floor(previousAmount / 50) * 50;
            if (milestone > previousMilestone && milestone <= RESOURCE_CAPS[resource]) {
              const capitalizedResource = resource.charAt(0).toUpperCase() + resource.slice(1);
              notifications.push(`${capitalizedResource} production milestone: ${milestone}! (Offline progress)`);
            }
          });
        }
      });

      return { resources: newResources, notifications };
    }
    case 'LOAD_STATE':
      return { resources: action.payload.resources || resources, notifications: [] };
    default:
      return { resources, notifications: [] };
  }
}