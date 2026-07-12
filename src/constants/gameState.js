import buildingDefinitions from '../../data/building-definitions.json';

export const initialState = {
  playerName: "Lord",
  resources: {
    timber: 100,
    stone: 100,
    iron: 20,
    food: 20,
    gold: 20,
    knowledge: 20
  },
  buildings: {
    "Lumber-Camp": 0,
    "Farm": 0,
    "Quarry": 0,
    "Iron-Mine": 0,
    "Barracks": 0,
    "Warehouse": 0,
    "Granary": 0
  },
  units: [],
  unitQueue: [],
  notifications: [],
  version: "v0.3"
};

export const BASE_RESOURCE_CAPS = {
  timber: 200,
  stone: 200,
  iron: 200,
  food: 200,
  gold: 200,
  knowledge: 200
};

export function calculateResourceCap(baseResource, state) {
  const baseCap = BASE_RESOURCE_CAPS[baseResource] || 200;
  
  if (baseResource === 'food') {
    const granaryLevel = state.buildings["Granary"] || 0;
    if (granaryLevel > 0) {
      const granaryBonus = buildingDefinitions["Granary"][granaryLevel]?.storageBonus?.["food"] || 0;
      return baseCap + granaryBonus;
    }
  }
  
  return baseCap;
}

export const RESOURCE_CAPS = BASE_RESOURCE_CAPS;