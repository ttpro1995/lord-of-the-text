import { useCallback } from 'react';
import buildingDefinitions from '../../data/building-definitions.json';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export default function BuildingCard({
  buildingName,
  level,
  buildings,
  resources,
  onBuildUpgrade
}) {
  const { impactLight } = useHapticFeedback();

  const handleBuildUpgrade = useCallback(() => {
    impactLight();
    onBuildUpgrade(buildingName);
  }, [onBuildUpgrade, buildingName, impactLight]);
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
  const actionText = level === 0 ? 'Build' : `Upgrade to Lv ${nextLevel}`;
  const ariaLabel = `${buildingName.replace('-', ' ')}, level ${level}. ${isDisabled ? 'Requires: ' + dependencyInfo : canAfford ? actionText : 'Insufficient resources'}`;

  return (
    <div className="building-card" role="region" aria-label={buildingName.replace('-', ' ')}>
      <h3>
        {buildingName.replace('-', ' ')}
        <span className="building-level">Lv {level}</span>
      </h3>
      {definition ? (
        <>
          <button
            onClick={handleBuildUpgrade}
            disabled={isDisabled}
            title={!hasDependencies ? `Requires: ${dependencyInfo}` : !canAfford ? "Not enough resources" : ""}
            aria-label={ariaLabel}
          >
            {actionText} ({costString})
          </button>
          {!hasDependencies && (
            <div className="dependency-lock" role="alert" aria-live="polite">
              🔒 Requires: {dependencyInfo}
            </div>
          )}
          {hasDependencies && !canAfford && (
            <div className="resource-lock" role="alert" aria-live="polite">
              💰 Insufficient resources
            </div>
          )}
        </>
      ) : (
        <div className="max-level" role="status">
          ✅ Max Level Reached
        </div>
      )}
    </div>
  );
}