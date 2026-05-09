import { useState, useMemo } from 'react';
import gameConstants from '../data/game-constants.json';

const UNIT_COST = gameConstants.unitCosts["Peasant-Spear"] || { food: 10, timber: 5 };

export default function UnitTraining({
  unitCap,
  unitsCount,
  unitQueueCount,
  resources,
  onTrainUnits,
  onTrainMax
}) {
  const [trainQuantity, setTrainQuantity] = useState(1);
  const unitType = 'Peasant-Spear';

  const maxAffordable = useMemo(() => {
    let maxByResources = Infinity;
    
    Object.entries(UNIT_COST).forEach(([resource, cost]) => {
      const resourceKey = resource.toLowerCase();
      const available = resources[resourceKey] || 0;
      const affordable = Math.floor(available / cost);
      maxByResources = Math.min(maxByResources, affordable);
    });
    
    const maxByCap = Math.max(0, unitCap - unitsCount - unitQueueCount);
    return Math.min(maxByResources, maxByCap);
  }, [resources, unitCap, unitsCount, unitQueueCount]);

  const handleTrainMaxClick = () => {
    if (maxAffordable > 0) {
      setTrainQuantity(maxAffordable);
      onTrainMax(unitType, maxAffordable);
    }
  };

  const handleTrain = () => {
    if (trainQuantity > 0) {
      onTrainUnits(unitType, trainQuantity);
    }
  };

  return (
    <div className="unit-training" role="region" aria-label="Unit Training">
      <h3>Unit Training</h3>
      <div className="unit-cap-display">
        <p title={`Base cap: ${unitCap}, training queue counts toward cap`} aria-label={`Unit Cap: ${unitsCount} of ${unitCap}`}>
          Unit Cap: {unitsCount}/{unitCap}
        </p>
      </div>
      
      <div className="batch-training">
        <div className="unit-selector">
          <label htmlFor="unit-type">Unit Type:</label>
          <select 
            id="unit-type"
            value={unitType}
            disabled
            className="unit-type-select"
            aria-label="Unit type selector"
          >
<option value="Peasant-Spear">
               Peasant Spear ({Object.entries(UNIT_COST).map(([r, v]) => `${v} ${r.charAt(0).toUpperCase()}`).join(', ')})
            </option>
          </select>
        </div>
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={maxAffordable}
            value={trainQuantity}
            onChange={(e) => setTrainQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="quantity-input"
            aria-label="Number of units to train"
          />
        </div>
        <div className="training-buttons">
          <button
            className="train-unit-button"
            onClick={handleTrain}
            disabled={trainQuantity <= 0 || unitsCount + unitQueueCount >= unitCap}
            aria-label={`Train ${trainQuantity} ${unitType.replace('-', ' ')} units`}
          >
            🗡️ Train {trainQuantity} Peasant Spear
          </button>
          <button
            className="train-max-button"
            onClick={handleTrainMaxClick}
            disabled={maxAffordable <= 0 || unitsCount + unitQueueCount >= unitCap}
            title="Train maximum affordable units"
            aria-label={`Train maximum affordable units: ${maxAffordable}`}
          >
            📊 Train Max ({maxAffordable})
          </button>
        </div>
      </div>

      {/* Training Queue */}
      <div className="training-queue" role="status" aria-live="polite">
        <h4>Training Queue ({unitQueueCount})</h4>
        {unitQueueCount === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No units in training</p>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Units are training...</p>
        )}
      </div>
    </div>
  );
}