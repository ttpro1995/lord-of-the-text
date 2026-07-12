import { useState, useEffect } from 'react';
import { calculateProductionRates } from '../utils/productionCalculator';

export default function ResourceDisplay({ resources, buildings, resourceCap }) {
  const [prevResources, setPrevResources] = useState(resources);
  const [animatingResources, setAnimatingResources] = useState({});
  
  const productionRates = calculateProductionRates(buildings, resources);

  useEffect(() => {
    const changedResources = {};
    Object.keys(resources).forEach(resource => {
      if (resources[resource] !== prevResources[resource]) {
        changedResources[resource] = true;
      }
    });
    
    if (Object.keys(changedResources).length > 0) {
      setAnimatingResources(changedResources);
      
      const timeout = setTimeout(() => {
        setAnimatingResources({});
      }, 1000);
      
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
    <div className="resources">
      {Object.entries(resources).map(([resource, amount]) => {
        const cap = resourceCap(resource, { buildings, resources });
        const rate = productionRates[resource] || 0;
        const isAnimating = animatingResources[resource];
        
        return (
          <div 
            key={resource} 
            className={`resource ${isAnimating ? 'resource-animating' : ''}`}
            title={`${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${Math.floor(amount)}/${cap}${rate > 0 ? ` (+${rate}/min)` : ''}`}
          >
            <span className="resource-icon">{resourceIcons[resource] || resource.charAt(0).toUpperCase()}</span>
            <span className="resource-amount">{Math.floor(amount)}</span>
            {rate > 0 && (
              <span className="resource-rate">{Math.floor(rate)}/min</span>
            )}
            {cap > 200 && (
              <span className="resource-cap">/ {cap}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}