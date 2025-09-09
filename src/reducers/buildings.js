import buildingDefinitions from '../../data/building-definitions.json';

export const initialBuildings = {
  "Lumber-Camp": 0,
  "Farm": 0,
  "Quarry": 0,
  "Iron-Mine": 0,
  "Barracks": 0,
  "Warehouse": 0
};

export function buildingsReducer(buildings = initialBuildings, action) {
  switch (action.type) {
    case 'BUILD_UPGRADE': {
      const { buildingName } = action.payload;
      const currentLevel = buildings[buildingName] || 0;
      const nextLevel = currentLevel + 1;
      const definition = buildingDefinitions[buildingName]?.[nextLevel];

      if (!definition) return buildings; // Max level or invalid

      // Check dependencies
      const dependencies = definition.dependencies || [];
      const hasDependencies = dependencies.every(dep => {
        const requiredBuildingLevel = buildings[dep.building] || 0;
        return requiredBuildingLevel >= dep.level;
      });

      if (!hasDependencies) return buildings;

      // Assume canAfford is checked elsewhere and deducted separately
      // So, just update buildings
      return {
        ...buildings,
        [buildingName]: nextLevel
      };
    }
    case 'LOAD_STATE':
      return action.payload.buildings || buildings;
    default:
      return buildings;
  }
}