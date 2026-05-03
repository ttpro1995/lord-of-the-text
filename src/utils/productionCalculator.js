import buildingDefinitions from '../../data/building-definitions.json';

export function calculateProductionRates(buildings) {
  const rates = {};
  
  Object.entries(buildings).forEach(([buildingName, level]) => {
    if (level <= 0) return;
    
    const def = buildingDefinitions[buildingName];
    if (!def || !def[level]) return;
    
    const production = def[level].production || {};
    Object.entries(production).forEach(([resource, amount]) => {
      rates[resource] = (rates[resource] || 0) + amount;
    });
  });

  // Convert per-second to per-minute
  const ratesPerMinute = {};
  Object.entries(rates).forEach(([resource, amountPerSecond]) => {
    ratesPerMinute[resource] = amountPerSecond * 60;
  });

  return ratesPerMinute;
}