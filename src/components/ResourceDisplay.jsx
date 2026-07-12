import { useState, useEffect } from 'react';
import { calculateProductionRates } from '../utils/productionCalculator';

export default function ResourceDisplay({ resources, buildings, resourceCap }) {
  const [prevResources, setPrevResources] = useState(resources);
  const [resourceChanges, setResourceChanges] = useState({}); // { resource: { amount, type } }

  const productionRates = calculateProductionRates(buildings);

  useEffect(() => {
    const newChanges = {};
    Object.keys(resources).forEach(resource => {
      if (!prevResources) return;
      const change = resources[resource] - (prevResources[resource] || 0);
      if (change !== 0) {
        newChanges[resource] = {
          amount: Math.abs(Math.floor(change)),
          type: change > 0 ? 'gain' : 'loss'
        };
      }
    });

    if (Object.keys(newChanges).length > 0) {
      setResourceChanges(newChanges);

      // Clear changes after animation
      const timeout = setTimeout(() => {
        setResourceChanges({});
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [resources, prevResources]);

  useEffect(() => {
    setPrevResources(resources);
  }, [resources]);

  const resourceIcons = {
    timber: '🌲',
    stone: '🪨',
    iron: '⛏️',
    food: '🍖',
    gold: '💰',
    knowledge: '📚',
    faith: '🙏'
  };

  return (
    <div className="resources" role="region" aria-label="Resource display">
      {Object.entries(resources).map(([resource, amount]) => {
        const cap = resourceCap(resource, { buildings, resources });
        const rate = productionRates[resource] || 0;
        const change = resourceChanges[resource];

        return (
          <div
            key={resource}
            className={`resource ${change ? 'resource-animating' : ''}`}
            title={`${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${Math.floor(amount)}/${cap}${rate > 0 ? ` (+${rate}/tick)` : ''}`}
            aria-label={`${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${Math.floor(amount)}${rate > 0 ? `, producing ${rate} per tick` : ''}${cap > 200 ? `, capacity ${cap}` : ''}`}
            role="status"
          >
            <span className="resource-icon" aria-hidden="true">{resourceIcons[resource] || resource.charAt(0).toUpperCase()}</span>
            <span className="resource-amount">{Math.floor(amount)}</span>
            {change && (
              <span className={`resource-change ${change.type}`} key={`${resource}-${change.amount}`} aria-live="polite">
                {change.type === 'gain' ? '+' : '-'}{change.amount}
              </span>
            )}
            {rate > 0 && (
              <span className="resource-rate" aria-label={`Production rate: ${Math.floor(rate)} per tick`}>{Math.floor(rate)}/tick</span>
            )}
            {cap > 200 && (
              <span className="resource-cap" aria-label={`Capacity: ${cap}`}>/ {cap}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}