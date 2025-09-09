import { useReducer, useEffect, useState } from 'react';
import './App.css';
import buildingDefinitions from '../data/building-definitions.json';
import gameConstants from './data/game-constants.json';

// Initial state
export const initialState = {
  playerName: "Lord",
  resources: {
    timber: 100,
    stone: 100,
    iron: 20,
    food: 20,
    gold: 20,
    knowledge: 20
  },
  buildings: {
    "Lumber-Camp": 0,
    "Farm": 0,
    "Quarry": 0,
    "Iron-Mine": 0,
    "Barracks": 0,
    "Warehouse": 0
  },
  units: [],
  unitQueue: [],
  notifications: [],
  version: "v0.3"
};

export const RESOURCE_CAPS = {
  timber: 200,
  stone: 200,
  iron: 200,
  food: 200,
  gold: 200,
  knowledge: 200
};

export const BASE_UNIT_CAP = gameConstants.baseUnitCap;
export const UNIT_CAP_PER_BARRACKS_LEVEL = gameConstants.unitCapPerBarracksLevel;

// Reducer function
export function gameReducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      let newResources = { ...state.resources };

      // Process resource production from buildings
      Object.entries(state.buildings).forEach(([buildingName, level]) => {
        if (level > 0 && buildingDefinitions[buildingName]) {
          const production = buildingDefinitions[buildingName][level].production || {};
          Object.entries(production).forEach(([resource, amount]) => {
            const amountPerTick = amount / 60;
            newResources[resource] = Math.min(
              RESOURCE_CAPS[resource],
              newResources[resource] + amountPerTick
            );
          });
        }
      });

      // Process unit training queue
      let newUnitQueue = [...state.unitQueue];
      let newUnits = [...state.units];
      let notifications = [];

      newUnitQueue = newUnitQueue.map(item => {
        const updatedItem = { ...item, progress: item.progress + 1 };
        if (updatedItem.progress >= updatedItem.trainingTime) {
          newUnits.push({
            type: updatedItem.type,
            id: Date.now() + Math.random()
          });
          notifications.push(`Unit ready: ${updatedItem.type}`);
          return null; // Remove from queue
        }
        return updatedItem;
      }).filter(Boolean);

      return {
        ...state,
        resources: newResources,
        units: newUnits,
        unitQueue: newUnitQueue,
        notifications: notifications.length > 0 ? notifications : state.notifications
      };
    }
    case 'BUILD':
    case 'UPGRADE': {
      const buildingName = action.payload;
      const currentLevel = state.buildings[buildingName] || 0;
      const nextLevel = currentLevel + 1;
      const definition = buildingDefinitions[buildingName]?.[nextLevel];

      if (!definition) return state; // Max level reached or invalid building

      // Check dependencies
      const dependencies = definition.dependencies || [];
      const hasDependencies = dependencies.every(dep => {
        const requiredBuildingLevel = state.buildings[dep.building] || 0;
        return requiredBuildingLevel >= dep.level;
      });

      if (!hasDependencies) {
        const notifications = [...state.notifications];
        notifications.push(`Missing dependencies for ${buildingName.replace('-', ' ')}`);
        return { ...state, notifications };
      }

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

        const notifications = [`${buildingName} complete`];

        return {
          ...state,
          resources: newResources,
          buildings: {
            ...state.buildings,
            [buildingName]: nextLevel,
          },
          notifications: notifications
        };
      }
      if (!canAfford) {
        const notifications = [...state.notifications];
        notifications.push(`Cannot afford ${buildingName.replace('-', ' ')} level ${nextLevel}`);
        return { ...state, notifications };
      }
    }
    case 'TRAIN_UNIT': {
      const { unitType } = action.payload;
      const unitCost = gameConstants.unitCosts[unitType];

      if (!unitCost) return state;

      const canAfford = Object.entries(unitCost).every(
        ([resource, cost]) => state.resources[resource] >= cost
      );

      if (!canAfford) return state;

      const barracksLevel = state.buildings["Barracks"] || 0;
      const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);

      if (state.units.length >= unitCap) {
        console.log("Unit cap reached");
        return state;
      }

      const newResources = { ...state.resources };
      Object.entries(unitCost).forEach(([resource, cost]) => {
        newResources[resource] -= cost;
      });

      const newUnitQueue = [
        ...state.unitQueue,
        {
          type: unitType,
          progress: 0,
          trainingTime: 30 // 30 seconds for Peasant Spear
        }
      ];

      return {
        ...state,
        resources: newResources,
        unitQueue: newUnitQueue
      };
    }
    case 'OFFLINE_PROGRESS': {
      const { seconds } = action.payload;
      let newResources = { ...state.resources };
      let newUnits = [...state.units];
      let newUnitQueue = [...state.unitQueue];
      let notifications = [...state.notifications]; // Copy any existing notifications

      // Calculate resource production over offline period
      Object.entries(state.buildings).forEach(([buildingName, level]) => {
        if (level > 0 && buildingDefinitions[buildingName]) {
          const production = buildingDefinitions[buildingName][level].production || {};
          Object.entries(production).forEach(([resource, amountPerMinute]) => {
            const amountPerSecond = amountPerMinute / 60;
            const totalGain = amountPerSecond * seconds;
            newResources[resource] = Math.min(
              RESOURCE_CAPS[resource],
              newResources[resource] + totalGain
            );
          });
        }
      });

      // Advance unit training queue over offline period
      newUnitQueue = newUnitQueue.map(item => {
        const newProgress = item.progress + seconds;
        if (newProgress >= item.trainingTime) {
          newUnits.push({
            type: item.type,
            id: Date.now() + Math.random()
          });
          notifications.push(`Unit ready: ${item.type}`);
          return null; // Remove from queue
        }
        return { ...item, progress: newProgress };
      }).filter(Boolean);

      return {
        ...state,
        resources: newResources,
        units: newUnits,
        unitQueue: newUnitQueue,
        notifications: notifications
      };
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
  const lastActive = localStorage.getItem('lastActive');
  const initialGameState = savedState ? JSON.parse(savedState) : initialState;
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Calculate offline progress
  useEffect(() => {
    if (lastActive) {
      const now = Date.now();
      const offlineSeconds = Math.floor((now - parseInt(lastActive)) / 1000);

      if (offlineSeconds > 0) {
        console.log(`Calculating offline progress for ${offlineSeconds} seconds`);

        // Apply offline progress in a single dispatch
        dispatch({ type: 'OFFLINE_PROGRESS', payload: { seconds: offlineSeconds } });
      }
    }

    // Update last active timestamp
    localStorage.setItem('lastActive', Date.now().toString());
  }, [lastActive]);

  // Combined game tick and autosave
  useEffect(() => {
    const interval = setInterval(() => {
      // Dispatch TICK action
      const action = { type: 'TICK' };
      dispatch(action);

      // Autosave
      console.log("Game state before autosaved:", state);
      localStorage.setItem('gameState', JSON.stringify(state));
      localStorage.setItem('lastActive', Date.now().toString());
      console.log("Game state autosaved:", state);
    }, 1000);
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

  const handleTrainUnit = (unitType) => {
    dispatch({ type: 'TRAIN_UNIT', payload: { unitType } });
  };

  const renderBuildingCard = (buildingName) => {
    const currentLevel = state.buildings[buildingName] || 0;
    const nextLevel = currentLevel + 1;
    const definition = buildingDefinitions[buildingName]?.[nextLevel];
    const costString = definition ? Object.entries(definition.cost).map(([res, val]) => `${val} ${res.charAt(0).toUpperCase()}`).join(', ') : '';

    // Check dependencies
    const dependencies = definition?.dependencies || [];
    const hasDependencies = dependencies.every(dep => {
      const requiredBuildingLevel = state.buildings[dep.building] || 0;
      return requiredBuildingLevel >= dep.level;
    });

    // Check if we can afford the building
    const costs = definition?.cost || {};
    const canAfford = Object.entries(costs).every(
      ([resource, cost]) => state.resources[resource.toLowerCase()] >= cost
    );

    // Get dependency info for tooltip
    const dependencyInfo = dependencies.map(dep => {
      const requiredBuildingLevel = state.buildings[dep.building] || 0;
      const buildingNameFormatted = dep.building.replace('-', ' ');
      return `${buildingNameFormatted} (Lv ${requiredBuildingLevel}/${dep.level})`;
    }).join(', ');

    return (
      <div className="building-card">
        <h3>{buildingName.replace('-', ' ')} (Lv {currentLevel})</h3>
        {definition ? (
          <button
            onClick={() => handleBuildUpgrade(buildingName)}
            disabled={!hasDependencies || !canAfford}
            title={!hasDependencies ? `Requires: ${dependencyInfo}` : !canAfford ? "Not enough resources" : ""}
          >
            {currentLevel === 0 ? 'Build' : 'Upgrade to Lv ' + nextLevel} ({costString})
            {!hasDependencies && <span className="dependency-lock"> (Locked)</span>}
            {!canAfford && <span className="resource-lock"> (Not enough resources)</span>}
          </button>
        ) : (
          <p>Max Level Reached</p>
        )}
      </div>
    );
  };

  // Calculate unit cap
  const barracksLevel = state.buildings["Barracks"] || 0;
  const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);

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
          {renderBuildingCard("Farm")}
          {renderBuildingCard("Quarry")}
          {renderBuildingCard("Iron-Mine")}
          {renderBuildingCard("Barracks")}
          {renderBuildingCard("Warehouse")}
        </div>
        <div className="unit-training">
          <h3>Unit Training</h3>
          <p title={`Base cap: ${BASE_UNIT_CAP}, +${UNIT_CAP_PER_BARRACKS_LEVEL} per Barracks level`}>
            Unit Cap: {state.units.length}/{unitCap}
          </p>
          <button
            onClick={() => handleTrainUnit("Peasant-Spear")}
            disabled={state.units.length >= unitCap}
          >
            Train Peasant Spear (10 Food, 5 Timber)
          </button>
          <div className="training-queue">
            <h4>Training Queue</h4>
            {state.unitQueue.map((item, index) => (
              <div key={index}>
                {item.type} - {item.progress}/{item.trainingTime}s
              </div>
            ))}
          </div>
        </div>
        <div className="units">
          <h3>Your Units</h3>
          <p>Total: {state.units.length}</p>
          {state.units.map(unit => (
            <div key={unit.id}>{unit.type}</div>
          ))}
        </div>
      </main>
      <footer className="version-badge">
        {state.version}
      </footer>
      {/* Toast Notifications */}
      <div className="toast-notifications">
        {state.notifications.map((notification, index) => (
          <div key={index} className="toast">
            {notification}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
