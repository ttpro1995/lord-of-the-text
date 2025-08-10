import { useReducer, useEffect } from 'react';
import './App.css';
import buildingDefinitions from '../data/building-definitions.json';

// Initial state
export const initialState = {
  playerName: "Lord",
  resources: {
    timber: 60,
    stone: 60,
    iron: 0,
    food: 0,
    gold: 0,
    knowledge: 0
  },
  buildings: {
    "Lumber-Camp": 0
  },
  version: "v0.2",
  _hasLogged: false
};

export const TIMBER_CAP = 200;

// Reducer function
export function gameReducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      let timberProduction = 1; // Base production
      let stoneProduction = 1; // Base production for stone
      const lumberCampLevel = state.buildings["Lumber-Camp"];
      if (lumberCampLevel > 0) {
        const productionPerMinute = buildingDefinitions["Lumber-Camp"][lumberCampLevel].production.timber;
        timberProduction += productionPerMinute / 60;
      }

      const newTimber = Math.min(TIMBER_CAP, state.resources.timber + timberProduction);
      const newStone = state.resources.stone + stoneProduction;

      // Resource changes are now logged at the dispatch level
      
      
      
      

      return {
        ...state,
        resources: {
          ...state.resources,
          timber: newTimber,
          stone: newStone
        }
      };
    }
    case 'BUILD':
    case 'UPGRADE': {
      const buildingName = action.payload;
      const currentLevel = state.buildings[buildingName] || 0;
      const nextLevel = currentLevel + 1;
      const definition = buildingDefinitions[buildingName]?.[nextLevel];

      if (!definition) return state; // Max level reached or invalid building

      const costs = definition.cost;
      const canAfford = Object.entries(costs).every(
        ([resource, cost]) => state.resources[resource.toLowerCase()] >= cost
      );

      if (canAfford) {
        console.log(`Deducting resources for ${buildingName} level ${nextLevel}:`, costs);
        const newResources = { ...state.resources };
        Object.entries(costs).forEach(([resource, cost]) => {
          const resourceKey = resource.toLowerCase();
          newResources[resourceKey] -= cost;
        });

        return {
          ...state,
          resources: newResources,
          buildings: {
            ...state.buildings,
            [buildingName]: nextLevel,
          },
        };
      }
      if (!canAfford) {
        console.log(`Cannot afford to build ${buildingName} level ${nextLevel}`);
      }
      return state;
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

function App() {
  // Try to load saved state from localStorage, or use initialState if none exists
  const savedState = localStorage.getItem('gameState');
  const initialGameState = savedState ? JSON.parse(savedState) : initialState;
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Game tick
  useEffect(() => {
    const interval = setInterval(() => {
      const action = { type: 'TICK' };
      dispatch(action);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Autosave
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('gameState', JSON.stringify(state));
      console.log("Game state autosaved:", state);
    }, 10000);
    return () => clearInterval(interval);
  }, [state]);


  // Manual Save/Load functionality
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 's' || e.key === 'S') {
        localStorage.setItem('gameState', JSON.stringify(state));
        console.log("Game state saved:", state);
      } else if (e.key === 'l' || e.key === 'L') {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          const loadedState = JSON.parse(savedState);
          console.log("Loading game state:", loadedState);
          dispatch({ type: 'LOAD_STATE', payload: loadedState });
          console.log("Game state loaded:", loadedState);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state]);

  const handleBuildUpgrade = (buildingName) => {
    const currentLevel = state.buildings[buildingName] || 0;
    if (currentLevel === 0) {
      dispatch({ type: 'BUILD', payload: buildingName });
    } else {
      dispatch({ type: 'UPGRADE', payload: buildingName });
    }
  };

  const renderBuildingCard = (buildingName) => {
    const currentLevel = state.buildings[buildingName] || 0;
    const nextLevel = currentLevel + 1;
    const definition = buildingDefinitions[buildingName]?.[nextLevel];
    const costString = definition ? Object.entries(definition.cost).map(([res, val]) => `${val} ${res.charAt(0).toUpperCase()}`).join(', ') : '';

    return (
      <div className="building-card">
        <h3>{buildingName.replace('-', ' ')} (Lv {currentLevel})</h3>
        {definition ? (
          <button onClick={() => handleBuildUpgrade(buildingName)}>
            {currentLevel === 0 ? 'Build' : 'Upgrade to Lv ' + nextLevel} ({costString})
          </button>
        ) : (
          <p>Max Level Reached</p>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <header className="top-bar">
        <h1>Lord of the Text – {state.version}</h1>
        <div className="resources">
          {Object.entries(state.resources).map(([resource, amount]) => (
            <div key={resource} className="resource">
              <span className="resource-icon">{resource.charAt(0).toUpperCase()}</span>
              <span className="resource-amount">{Math.floor(amount)}</span>
            </div>
          ))}
        </div>
      </header>
      <main className="game-content">
        <p>Welcome, {state.playerName}!</p>
        <div className="buildings">
          {renderBuildingCard("Lumber-Camp")}
        </div>
      </main>
      <footer className="version-badge">
        {state.version}
      </footer>
    </div>
  );
}

export default App;
