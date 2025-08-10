import { useReducer, useEffect, useState } from 'react';
import './App.css';
import buildingDefinitions from '../data/building-definitions.json';

// Initial state
const initialState = {
  playerName: "Lord",
  resources: {
    timber: 50,
    stone: 30,
    iron: 0,
    food: 0,
    gold: 0,
    knowledge: 0
  },
  buildings: {
    LumberCamp: { level: 0 }
  },
  version: "v0.2"
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_RESOURCE':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.resource]: Math.min(
            state.resources[action.payload.resource] + action.payload.amount,
            action.payload.cap
          )
        }
      };
    case 'DECREMENT_RESOURCES':
      const newResources = { ...state.resources };
      for (const resourceType in action.payload) {
        newResources[resourceType] -= action.payload[resourceType];
      }
      return {
        ...state,
        resources: newResources
      };
    case 'BUILD_BUILDING':
      return {
        ...state,
        buildings: {
          ...state.buildings,
          [action.payload.buildingType]: {
            level: state.buildings[action.payload.buildingType].level + 1
          }
        }
      };
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload }; // Merge with initial state to handle new properties
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const [timberProduction, setTimberProduction] = useState(0);
  const [timberCap, setTimberCap] = useState(initialState.resources.timber);

  useEffect(() => {
    const lumberCampLevel = state.buildings.LumberCamp.level;
    if (lumberCampLevel > 0) {
      const productionRate = buildingDefinitions.LumberCamp.levels[lumberCampLevel].production.Timber;
      setTimberProduction(productionRate);
      const storageBonus = buildingDefinitions.LumberCamp.levels[lumberCampLevel].storage_bonus.Timber;
      setTimberCap(storageBonus);
    } else {
      setTimberProduction(0);
      setTimberCap(200); // Default cap if no Lumber Camp
    }
  }, [state.buildings.LumberCamp.level]);

  // Resource tick - add timber based on production
  useEffect(() => {
    const interval = setInterval(() => {
      if (timberProduction > 0) {
        dispatch({ type: 'ADD_RESOURCE', payload: { resource: 'timber', amount: timberProduction / 60, cap: timberCap } });
        console.log(`+${(timberProduction / 60).toFixed(2)} Timber`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timberProduction, timberCap]);

  // Autosave functionality
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      localStorage.setItem('gameState', JSON.stringify(state));
      console.log("Game state autosaved");
    }, 10000); // Autosave every 10 seconds

    return () => clearInterval(autosaveInterval);
  }, [state]);

  // Save/Load functionality (manual)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 's' || e.key === 'S') {
        localStorage.setItem('gameState', JSON.stringify(state));
        console.log("Game state saved manually");
      } else if (e.key === 'l' || e.key === 'L') {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
          console.log("Game state loaded");
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state]);

  const handleBuildUpgrade = (buildingType) => {
    const currentLevel = state.buildings[buildingType].level;
    const nextLevel = currentLevel + 1;
    const definition = buildingDefinitions[buildingType];

    if (!definition || !definition.levels[nextLevel]) {
      console.log(`Cannot build/upgrade ${buildingType} to level ${nextLevel}.`);
      return;
    }

    const cost = definition.levels[nextLevel].cost;
    let canAfford = true;
    for (const resourceType in cost) {
      if (state.resources[resourceType] < cost[resourceType]) {
        canAfford = false;
        console.log(`Not enough ${resourceType} to build/upgrade ${buildingType}.`);
        break;
      }
    }

    if (canAfford) {
      dispatch({ type: 'DECREMENT_RESOURCES', payload: cost });
      dispatch({ type: 'BUILD_BUILDING', payload: { buildingType } });
      console.log(`${buildingType} upgraded to level ${nextLevel}!`);
    }
  };

  const lumberCamp = state.buildings.LumberCamp;
  const nextLumberCampLevel = lumberCamp.level + 1;
  const nextLumberCampDefinition = buildingDefinitions.LumberCamp.levels[nextLumberCampLevel];
  const canBuildLumberCamp = nextLumberCampDefinition && Object.entries(nextLumberCampDefinition.cost).every(([res, amount]) => state.resources[res] >= amount);

  return (
    <div className="app">
      <header className="top-bar">
        <h1>Lord of the Text – {state.version}</h1>
        <div className="resources">
          {Object.entries(state.resources).map(([resource, amount]) => (
            <div key={resource} className="resource">
              <span className="resource-icon">{resource.charAt(0).toUpperCase()}</span>
              <span className="resource-amount">{amount.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </header>
      <main className="game-content">
        <p>Welcome, {state.playerName}!</p>
        <p>Press S to save, L to load.</p>
        <div className="building-card">
          <h2>Lumber Camp (Lv {lumberCamp.level})</h2>
          {lumberCamp.level === 0 ? (
            <>
              <p>Cost to build: {nextLumberCampDefinition.cost.Timber} Timber, {nextLumberCampDefinition.cost.Stone} Stone</p>
              <button onClick={() => handleBuildUpgrade('LumberCamp')} disabled={!canBuildLumberCamp}>
                Build Lumber Camp
              </button>
            </>
          ) : (
            <>
              <p>Production: {timberProduction} Timber/minute</p>
              <p>Storage Cap: {timberCap} Timber</p>
              {nextLumberCampDefinition ? (
                <>
                  <p>Cost to upgrade to Lv {nextLumberCampLevel}: {nextLumberCampDefinition.cost.Timber} Timber, {nextLumberCampDefinition.cost.Stone} Stone</p>
                  <button onClick={() => handleBuildUpgrade('LumberCamp')} disabled={!canBuildLumberCamp}>
                    Upgrade to Lv {nextLumberCampLevel}
                  </button>
                </>
              ) : (
                <p>Max Level Reached</p>
              )}
            </>
          )}
        </div>
      </main>
      <footer className="version-badge">
        {state.version}
      </footer>
    </div>
  );
}

export default App;
