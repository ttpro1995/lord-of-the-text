import { useCallback, useMemo } from 'react';
import buildingDefinitions from '../../data/building-definitions.json';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { getBuildBlockers, formatBlockers } from '../utils/blockers.js';

export default function BuildingCard({
  buildingName,
  level,
  buildings,
  resources,
  onBuildUpgrade
}) {
  const { impactLight } = useHapticFeedback();

  const blockers = useMemo(() => 
    getBuildBlockers(buildingName, buildings, resources, buildingDefinitions),
    [buildingName, buildings, resources]
  );

  const hasBlockers = blockers.length > 0;
  const isMaxLevel = blockers.some(b => b.code === 'MAX_LEVEL');
  const blockerMessages = blockers.filter(b => b.code !== 'MAX_LEVEL');
  
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

  const tooltip = formatBlockers(blockers);
  const ariaLabel = `${buildingName.replace('-', ' ')}, level ${level}. ${tooltip || 'Ready to build'}`;

  const handleBuildUpgrade = useCallback(() => {
    impactLight();
    onBuildUpgrade(buildingName);
  }, [onBuildUpgrade, buildingName, impactLight]);

  return (
    <div className="building-card" role="region" aria-label={buildingName.replace('-', ' ')}>
      <h3>
        {buildingName.replace('-', ' ')}
        <span className="building-level">Lv {level}</span>
      </h3>
      {isMaxLevel ? (
        <div className="max-level" role="status">
          Max Level Reached
        </div>
      ) : definition ? (
        <>
          <button
            onClick={handleBuildUpgrade}
            disabled={hasBlockers}
            title={tooltip}
            aria-label={ariaLabel}
          >
            {level === 0 ? 'Build' : `Upgrade to Lv ${nextLevel}`} ({costString})
          </button>
          {blockerMessages.length > 0 && (
            <div className="blocker-messages" aria-live="polite">
              {blockerMessages.map((blocker, index) => (
                <div key={index} className={`blocker-message ${blocker.code.toLowerCase()}`}>
                  {blocker.message}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-level" role="status">
          Max Level Reached
        </div>
      )}
    </div>
  );
}