import buildingDefinitions from '../../data/building-definitions.json';

export default function BuildingCard({
  buildingName,
  level,
  buildings,
  resources,
  onBuildUpgrade
}) {
  const nextLevel = level + 1;
  const definition = buildingDefinitions[buildingName]?.[nextLevel];
  
  if (!definition && level === 0) {
    return null;
  }
  
  const costString = definition 
    ? Object.entries(definition.cost)
        .map(([res, val]) => `${val} ${res.charAt(0).toUpperCase()}`)
        .join(', ')
    : '';

  // Check dependencies
  const dependencies = definition?.dependencies || [];
  const hasDependencies = dependencies.every(dep => {
    const requiredBuildingLevel = buildings[dep.building] || 0;
    return requiredBuildingLevel >= dep.level;
  });

  // Check if we can afford the building
  const costs = definition?.cost || {};
  const canAfford = Object.entries(costs).every(
    ([resource, cost]) => resources[resource.toLowerCase()] >= cost
  );

  // Get dependency info for tooltip
  const dependencyInfo = dependencies.map(dep => {
    const requiredBuildingLevel = buildings[dep.building] || 0;
    const buildingNameFormatted = dep.building.replace('-', ' ');
    return `${buildingNameFormatted} (Lv ${requiredBuildingLevel}/${dep.level})`;
  }).join(', ');

  const isDisabled = level === 0 ? !hasDependencies || !canAfford : !canAfford;

  return (
    <div className="building-card">
      <h3>
        {buildingName.replace('-', ' ')}
        <span className="building-level">Lv {level}</span>
      </h3>
      {definition ? (
        <>
          <button
            onClick={() => onBuildUpgrade(buildingName)}
            disabled={isDisabled}
            title={!hasDependencies ? `Requires: ${dependencyInfo}` : !canAfford ? "Not enough resources" : ""}
          >
            {level === 0 ? 'Build' : `Upgrade to Lv ${nextLevel}`} ({costString})
          </button>
          {!hasDependencies && (
            <div className="dependency-lock">
              🔒 Requires: {dependencyInfo}
            </div>
          )}
          {hasDependencies && !canAfford && (
            <div className="resource-lock">
              💰 Insufficient resources
            </div>
          )}
        </>
      ) : (
        <div className="max-level">
          ✅ Max Level Reached
        </div>
      )}
    </div>
  );
}