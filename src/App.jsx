import { useReducer, useEffect, useState, useRef, useMemo } from 'react';
import './App.css';
import { initialState, calculateResourceCap } from './constants/gameState.js';
import { BASE_UNIT_CAP, UNIT_CAP_PER_BARRACKS_LEVEL } from './constants/unitConstants.js';
import { gameReducer } from './constants/gameReducer.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { toTicksFromSeconds } from './utils/timeConversion.js';
import ResourceDisplay from './components/ResourceDisplay.jsx';
import BuildingCard from './components/BuildingCard.jsx';
import UnitTraining from './components/UnitTraining.jsx';
import ArmyDisplay from './components/ArmyDisplay.jsx';
import TabNavigation from './components/TabNavigation.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';
import gameConstants from './data/game-constants.json';

function App() {
  // Migration for legacy second-based queue items
  const migrateState = (loadedState) => {
    if (!loadedState) return null;

    // Check if unitQueue has second-based trainingTime values (legacy)
    // Legacy values are >= 30, tick-native values are <= 2
    const needsMigration = loadedState.unitQueue &&
      loadedState.unitQueue.some(item => item.trainingTime >= 30);

    if (needsMigration) {
      const migratedState = { ...loadedState };
      migratedState.unitQueue = loadedState.unitQueue.map(item => ({
        ...item,
        trainingTime: toTicksFromSeconds(item.trainingTime),
        progress: toTicksFromSeconds(item.progress || 0)
      }));
      return migratedState;
    }

    return loadedState;
  };

  // Try to load saved state from localStorage, or use initialState if none exists
  const savedState = localStorage.getItem('gameState');
  const lastActive = localStorage.getItem('lastActive');
  const loadedState = savedState ? JSON.parse(savedState) : null;
  const migratedState = migrateState(loadedState);
  const initialGameState = migratedState ? { ...initialState, ...migratedState } : initialState;
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [activeTab, setActiveTab] = useState('kingdom');
  const stateRef = useRef(state);

  useEffect(() => { stateRef.current = state; }, [state]);

  // Calculate unit cap and train max quantity
  const barracksLevel = state.buildings["Barracks"] || 0;
  const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);

  const maxAffordable = useMemo(() => {
    const unitType = 'Peasant-Spear';
    const unitCost = gameConstants.unitCosts[unitType] || { food: 10, timber: 5 };
    let maxByResources = Infinity;

    Object.entries(unitCost).forEach(([resource, cost]) => {
      const available = state.resources[resource] || 0;
      maxByResources = Math.min(maxByResources, Math.floor(available / cost));
    });

    return Math.max(0, Math.min(maxByResources, unitCap - state.units.length - state.unitQueue.length));
  }, [state.resources, state.units.length, state.unitQueue.length, unitCap]);

  // Keyboard shortcuts
  const handleManualTick = () => {
    dispatch({ type: 'TICK' });
    localStorage.setItem('gameState', JSON.stringify(stateRef.current));
    localStorage.setItem('lastActive', Date.now().toString());
  };

  const handleTrainMax = () => {
    if (maxAffordable > 0) {
      dispatch({ type: 'TRAIN_UNITS_BATCH', payload: { unitType: 'Peasant-Spear', quantity: maxAffordable } });
    }
  };

  useKeyboardShortcuts({
    'b': () => setActiveTab('kingdom'),
    'u': () => setActiveTab('army'),
    'm': handleTrainMax,
    ' ': handleManualTick,
    'escape': () => { setShowSettings(false); setShowResetConfirm(false); },
  });

  // Offline progress effect
  useEffect(() => {
    if (!lastActive) return;
    const offlineSeconds = Math.floor((Date.now() - parseInt(lastActive)) / 1000);
    if (offlineSeconds > 0) {
      dispatch({ type: 'OFFLINE_PROGRESS', payload: { seconds: offlineSeconds } });
    }
    localStorage.setItem('lastActive', Date.now().toString());
  }, [lastActive]);

  // Game tick and autosave
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
      localStorage.setItem('gameState', JSON.stringify(stateRef.current));
      localStorage.setItem('lastActive', Date.now().toString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save/Load
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.key === 's' || e.key === 'S') && !(e.target.tagName === 'INPUT')) {
        localStorage.setItem('gameState', JSON.stringify(state));
      } else if ((e.key === 'l' || e.key === 'L') && !(e.target.tagName === 'INPUT')) {
        const saved = localStorage.getItem('gameState');
        if (saved) dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state]);

  // Handlers
  const handleBuildUpgrade = (buildingName) => {
    const level = state.buildings[buildingName] || 0;
    dispatch({ type: level === 0 ? 'BUILD' : 'UPGRADE', payload: buildingName });
  };

  const handleTrainUnits = (unitType, quantity) => {
    if (quantity > 0) dispatch({ type: 'TRAIN_UNITS_BATCH', payload: { unitType, quantity } });
  };

  const handleCancelTraining = (queueIndex) => dispatch({ type: 'CANCEL_TRAINING', payload: { queueIndex } });
  const handleDismissUnit = (unitId) => dispatch({ type: 'DISMISS_UNIT', payload: { unitId } });
  const handleBulkDismiss = (unitIds) => dispatch({ type: 'BULK_DISMISS_UNITS', payload: { unitIds } });

  const handleHardResetConfirm = () => {
    if (resetConfirmText === 'RESET') {
      localStorage.clear();
      dispatch({ type: 'HARD_RESET' });
      window.location.reload();
    }
  };

  const dismissNotification = (id) => {
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
  };

  const buildings = ["Lumber-Camp", "Farm", "Quarry", "Iron-Mine", "Barracks", "Warehouse", "Granary"];

  return (
    <div className="app">
      <header className="top-bar" role="banner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>Lord of the Text – {state.version}</h1>
          <button className="settings-button" onClick={() => setShowSettings(true)} aria-label="Open settings">⚙️ Settings</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="tick-button" onClick={handleManualTick} title="Advance turn (Space)">Tick (+1)</button>
          <ResourceDisplay resources={state.resources} buildings={state.buildings} resourceCap={calculateResourceCap} />
        </div>
      </header>

      <main className="game-content" role="main">
        <p>Welcome, {state.playerName}!</p>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'kingdom' && (
          <div className="buildings" role="region" aria-label="Kingdom Buildings">
            {buildings.map(name => (
              <BuildingCard
                key={name}
                buildingName={name}
                level={state.buildings[name] || 0}
                buildings={state.buildings}
                resources={state.resources}
                onBuildUpgrade={handleBuildUpgrade}
                resourceCap={calculateResourceCap}
              />
            ))}
          </div>
        )}

        {activeTab === 'army' && (
          <>
            <UnitTraining
              unitCap={unitCap}
              unitsCount={state.units.length}
              unitQueueCount={state.unitQueue.length}
              resources={state.resources}
              onTrainUnits={handleTrainUnits}
              onCancelTraining={handleCancelTraining}
              onTrainMax={handleTrainMax}
            />
            <ArmyDisplay
              units={state.units}
              unitCap={unitCap}
              onDismissUnit={handleDismissUnit}
              onBulkDismiss={handleBulkDismiss}
            />
          </>
        )}
      </main>

      <footer className="version-badge">{state.version}</footer>

      <NotificationSystem 
        notifications={state.notifications} 
        onDismiss={dismissNotification} 
      />

      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <h2 id="settings-title">Settings</h2>
            <p>Game Version: {state.version}</p>
            <p>Resources saved automatically. Manual Save: 'S' key, Load: 'L' key</p>
            <p>Keyboard shortcuts: B=Kingdom, U=Army, M=Train Max, Space=Tick</p>
            <div className="danger-zone">
              <h3><span className="warning-icon" aria-hidden="true">⚠️</span> Danger Zone</h3>
              <button className="danger-button" onClick={() => setShowResetConfirm(true)} aria-label="Hard reset game - Dangerous action">🗑️ Hard Reset</button>
            </div>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="confirm-dialog-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-labelledby="confirm-title">
            <h3 id="confirm-title">Confirm Hard Reset</h3>
            <p>Type <strong>RESET</strong> to confirm:</p>
            <input value={resetConfirmText} onChange={e => setResetConfirmText(e.target.value)} placeholder="Type RESET" autoFocus aria-label="Type RESET to confirm" />
            <div className="confirm-dialog-buttons">
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button onClick={handleHardResetConfirm} disabled={resetConfirmText !== 'RESET'}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;