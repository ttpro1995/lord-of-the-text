import { useReducer, useEffect, useState, useRef } from 'react';
import './App.css';
import buildingDefinitions from '../data/building-definitions.json';
import { initialState, RESOURCE_CAPS } from './constants/gameState.js';
import { BASE_UNIT_CAP, UNIT_CAP_PER_BARRACKS_LEVEL } from './constants/unitConstants.js';
import { gameReducer } from './constants/gameReducer.js';

function App() {
  // Try to load saved state from localStorage, or use initialState if none exists
  const savedState = localStorage.getItem('gameState');
  const lastActive = localStorage.getItem('lastActive');
  const loadedState = savedState ? JSON.parse(savedState) : null;
  // Merge loaded state with initialState to ensure all properties exist
  const initialGameState = loadedState
    ? { ...initialState, ...loadedState }
    : initialState;
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [activeTab, setActiveTab] = useState('kingdom');
  const [trainQuantity, setTrainQuantity] = useState(1);
  const stateRef = useRef(state);
  const notificationTimers = useRef(new Map()); // Track active timers by notification ID

  // Keep stateRef updated
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
      dispatch({ type: 'TICK' });

      // Autosave using current state
      const currentState = stateRef.current;
      localStorage.setItem('gameState', JSON.stringify(currentState));
      localStorage.setItem('lastActive', Date.now().toString());
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array - interval created only once

  // Auto-dismiss notifications after 5 seconds - only create timers for new notifications
  useEffect(() => {
    const activeTimers = notificationTimers.current;
    
    // Create timers for new notifications
    state.notifications.forEach(notification => {
      if (!activeTimers.has(notification.id)) {
        const timer = setTimeout(() => {
          dispatch({ type: 'DISMISS_NOTIFICATION', payload: notification.id });
          activeTimers.delete(notification.id);
        }, 5000);
        activeTimers.set(notification.id, timer);
      }
    });
    
    // Clean up timers for notifications that no longer exist
    const currentNotificationIds = new Set(state.notifications.map(n => n.id));
    Array.from(activeTimers.keys()).forEach(id => {
      if (!currentNotificationIds.has(id)) {
        clearTimeout(activeTimers.get(id));
        activeTimers.delete(id);
      }
    });
  }, [state.notifications]);

  // Cleanup timers on unmount
  useEffect(() => {
    const activeTimers = notificationTimers.current;
    return () => {
      // Clear all notification timers on unmount
      activeTimers.forEach(timer => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  // Handler for manual dismiss
  const handleDismissNotification = (notificationId) => {
    // Clear timer if exists
    const activeTimers = notificationTimers.current;
    if (activeTimers.has(notificationId)) {
      clearTimeout(activeTimers.get(notificationId));
      activeTimers.delete(notificationId);
    }
    dispatch({ type: 'DISMISS_NOTIFICATION', payload: notificationId });
  };


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

  const handleTrainUnitsBatch = (unitType, quantity) => {
    if (quantity <= 0) return;
    dispatch({ type: 'TRAIN_UNITS_BATCH', payload: { unitType, quantity } });
  };

  const handleCancelTraining = (queueIndex) => {
    dispatch({ type: 'CANCEL_TRAINING', payload: { queueIndex } });
  };

  const handleDismissUnit = (unitId) => {
    dispatch({ type: 'DISMISS_UNIT', payload: { unitId } });
  };

  const handleHardResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleHardResetConfirm = () => {
    if (resetConfirmText === 'RESET') {
      // Clear all localStorage
      localStorage.clear();
      // Dispatch reset action
      dispatch({ type: 'HARD_RESET' });
      // Reload the page
      window.location.reload();
    }
  };

  const handleHardResetCancel = () => {
    setShowResetConfirm(false);
    setResetConfirmText('');
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
        <h3>
          {buildingName.replace('-', ' ')}
          <span className="building-level">Lv {currentLevel}</span>
        </h3>
        {definition ? (
          <>
            <button
              onClick={() => handleBuildUpgrade(buildingName)}
              disabled={!hasDependencies || !canAfford}
              title={!hasDependencies ? `Requires: ${dependencyInfo}` : !canAfford ? "Not enough resources" : ""}
            >
              {currentLevel === 0 ? 'Build' : `Upgrade to Lv ${nextLevel}`} ({costString})
            </button>
            {!hasDependencies && (
              <div className="dependency-lock">
                🔒 Requires: {dependencyInfo}
              </div>
            )}
            {hasDependencies && !canAfford && (
              <div className="resource-lock">
                💰 Insufficient resources
              </div>
            )}
          </>
        ) : (
          <div className="max-level">
            ✅ Max Level Reached
          </div>
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>Lord of the Text – {state.version}</h1>
          <button className="settings-button" onClick={() => setShowSettings(true)}>
            ⚙️ Settings
          </button>
        </div>
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
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'kingdom' ? 'active' : ''}`}
            onClick={() => setActiveTab('kingdom')}
          >
            🏰 Kingdom
          </button>
          <button 
            className={`tab-button ${activeTab === 'army' ? 'active' : ''}`}
            onClick={() => setActiveTab('army')}
          >
            ⚔️ Army
          </button>
        </div>

        {/* Kingdom Tab */}
        {activeTab === 'kingdom' && (
          <>
            <div className="buildings">
              {renderBuildingCard("Lumber-Camp")}
              {renderBuildingCard("Farm")}
              {renderBuildingCard("Quarry")}
              {renderBuildingCard("Iron-Mine")}
              {renderBuildingCard("Barracks")}
              {renderBuildingCard("Warehouse")}
            </div>
          </>
        )}

        {/* Army Tab */}
        {activeTab === 'army' && (
          <>
            {/* Unit Training Section */}
            <div className="unit-training">
              <h3>Unit Training</h3>
              <div className="unit-cap-display">
                <p title={`Base cap: ${BASE_UNIT_CAP}, +${UNIT_CAP_PER_BARRACKS_LEVEL} per Barracks level`}>
                  Unit Cap: {state.units.length}/{unitCap}
                </p>
              </div>
              
              <div className="batch-training">
                <div className="unit-selector">
                  <label htmlFor="unit-type">Unit Type:</label>
                  <select 
                    id="unit-type"
                    value="Peasant-Spear"
                    onChange={() => {}}
                    className="unit-type-select"
                  >
                    <option value="Peasant-Spear">Peasant Spear (10 Food, 5 Timber)</option>
                  </select>
                </div>
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={Math.max(1, unitCap - state.units.length - state.unitQueue.length)}
                    value={trainQuantity}
                    onChange={(e) => setTrainQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="quantity-input"
                  />
                </div>
                <button
                  className="train-unit-button"
                  onClick={() => handleTrainUnitsBatch("Peasant-Spear", trainQuantity)}
                  disabled={state.units.length + state.unitQueue.length >= unitCap}
                >
                  🗡️ Train {trainQuantity} Peasant Spear
                </button>
              </div>

              {/* Training Queue */}
              <div className="training-queue">
                <h4>Training Queue ({state.unitQueue.length})</h4>
                {state.unitQueue.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No units in training</p>
                ) : (
                  state.unitQueue.map((item, index) => {
                    const progress = (item.progress / item.trainingTime) * 100;
                    return (
                      <div key={index} className="training-item">
                        <span>{item.type}</span>
                        <div className="training-progress">
                          <div 
                            className="training-progress-bar" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span>{item.progress}/{item.trainingTime}s</span>
                        <button
                          className="cancel-training-button"
                          onClick={() => handleCancelTraining(index)}
                          title="Cancel training"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Your Army Section */}
            <div className="units">
              <h3>Your Army</h3>
              <div className="unit-cap-display">
                <p>Total Units: {state.units.length}/{unitCap}</p>
              </div>
              
              {state.units.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No units trained yet</p>
              ) : (
                <div className="unit-list">
                  {state.units.map((unit) => (
                    <div key={unit.id} className="unit-item">
                      <span>🗡️ {unit.type.replace('-', ' ')}</span>
                      <button
                        className="dismiss-unit-button"
                        onClick={() => handleDismissUnit(unit.id)}
                        title="Dismiss this unit"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="version-badge">
        {state.version}
      </footer>
      {/* Toast Notifications */}
      <div className="toast-notifications">
        {state.notifications.map((notification) => (
          <div key={notification.id} className="toast">
            <span>{notification.message}</span>
            <button
              className="toast-dismiss"
              onClick={() => handleDismissNotification(notification.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <h2 id="settings-title">Settings</h2>
            <p>Game Version: {state.version}</p>
            <p>Resources are saved automatically every second.</p>
            <p>Manual Save: Press 'S' key | Manual Load: Press 'L' key</p>
            
            <div className="danger-zone">
              <h3>
                <span className="warning-icon">⚠️</span>
                Danger Zone
              </h3>
              <p>Warning: Actions in this section are irreversible and will permanently delete all your game progress.</p>
              <button className="danger-button" onClick={handleHardResetClick}>
                🗑️ Hard Reset (Delete All Data)
              </button>
            </div>

            <button 
              style={{ marginTop: '1rem', backgroundColor: '#7f8c8d' }} 
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showResetConfirm && (
        <div className="confirm-dialog-overlay" onClick={handleHardResetCancel}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
            <h3 id="confirm-title">
              <span className="warning-icon">⚠️</span>
              Confirm Hard Reset
            </h3>
            <div id="confirm-desc" className="warning-text">
              <p><strong>WARNING:</strong> This action will:</p>
              <ul>
                <li>Delete all your progress and resources</li>
                <li>Remove all buildings and units</li>
                <li>Clear all saved data from localStorage</li>
                <li>Reset the game to its initial state</li>
              </ul>
              <p><strong>This cannot be undone!</strong></p>
            </div>
            <p>Type <strong>RESET</strong> to confirm:</p>
            <input
              type="text"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="Type RESET here"
              autoFocus
              aria-label="Confirmation text input"
            />
            <div className="confirm-dialog-buttons">
              <button className="cancel-button" onClick={handleHardResetCancel}>
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={handleHardResetConfirm}
                disabled={resetConfirmText !== 'RESET'}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
