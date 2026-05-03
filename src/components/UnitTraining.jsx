import { useState, useMemo } from 'react';
import gameConstants from '../data/game-constants.json';

const UNIT_COST = gameConstants.unitCosts["Peasant-Spear"] || { food: 10, timber: 5 };

export default function UnitTraining({
  unitCap,
  unitsCount,
  unitQueue,
  resources,
  onTrainUnits,
  onTrainMax,
  onCancelTraining
}) {
  const [trainQuantity, setTrainQuantity] = useState(1);
  const unitType = 'Peasant-Spear';

  const unitQueueCount = unitQueue.length;

  // Calculate why training is disabled
  const affordabilityInfo = useMemo(() => {
    const missingResources = [];
    
    Object.entries(UNIT_COST).forEach(([resource, cost]) => {
      const available = resources[resource] || 0;
      if (available < cost) {
        missingResources.push({ resource, needed: cost - available });
      }
    });
    
    const atCap = unitsCount + unitQueueCount >= unitCap;
    
    return {
      canAfford: missingResources.length === 0,
      missingResources,
      atCap,
      reason: atCap 
        ? 'At unit cap' 
        : missingResources.length > 0 
          ? `Need: ${missingResources.map(m => `${m.needed} ${m.resource}`).join(', ')}`
          : null
    };
  }, [resources, unitsCount, unitQueueCount, unitCap]);

  const maxAffordable = useMemo(() => {
    let maxByResources = Infinity;
    
    Object.entries(UNIT_COST).forEach(([resource, cost]) => {
      const available = resources[resource] || 0;
      const affordable = Math.floor(available / cost);
      maxByResources = Math.min(maxByResources, affordable);
    });
    
    const maxByCap = Math.max(0, unitCap - unitsCount - unitQueueCount);
    return Math.min(maxByResources, maxByCap);
  }, [resources, unitCap, unitsCount, unitQueueCount]);

  const handleTrainMax = () => {
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

  const trainDisabled = trainQuantity <= 0 || !affordabilityInfo.canAfford || affordabilityInfo.atCap;

return (
    <div className="unit-training">
      <h3>Unit Training</h3>
      <div className="unit-cap-display">
        <p title={`Training queue counts toward cap`}>
          Unit Cap: {unitsCount}/{unitCap}
        </p>
        <p className="food-cost-display">
          Food Cost: {UNIT_COST.food} (have {resources.food || 0})
        </p>
        {maxAffordable <= 0 && !affordabilityInfo.atCap && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
            Not enough resources to train
          </p>
        )}
      </div>
      
      <div className="batch-training">
        <div className="unit-selector">
          <label htmlFor="unit-type">Unit Type:</label>
          <select 
            id="unit-type"
            value={unitType}
            disabled
            className="unit-type-select"
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
            onChange={(e) => setTrainQuantity(Math.max(1, Math.min(maxAffordable, parseInt(e.target.value) || 1)))}
            className="quantity-input"
          />
        </div>
        <div className="training-buttons">
          <button
            className="train-unit-button"
            onClick={handleTrain}
            disabled={trainDisabled}
            title={affordabilityInfo.reason || "Train selected units"}
          >
            🗡️ Train {trainQuantity} Peasant Spear
          </button>
          <button
            className="train-max-button"
            onClick={handleTrainMax}
            disabled={maxAffordable <= 0}
            title={maxAffordable <= 0 ? affordabilityInfo.reason || "Not enough resources" : "Train maximum affordable units"}
          >
            📊 Train Max ({maxAffordable})
          </button>
        </div>
      </div>

      {/* Training Queue */}
      <div className="training-queue">
        <h4>Training Queue ({unitQueueCount})</h4>
        {unitQueueCount === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No units in training</p>
        ) : (
          unitQueue.map((item, index) => {
            const progress = (item.progress / item.trainingTime) * 100;
            return (
              <div key={index} className="training-item">
                <span>{item.type.replace('-', ' ')}</span>
                <div className="training-progress">
                  <div 
                    className="training-progress-bar" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span>{item.progress}/{item.trainingTime}s</span>
                {onCancelTraining && (
                  <button
                    className="cancel-training-button"
                    onClick={() => onCancelTraining(index)}
                    title="Cancel training"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}