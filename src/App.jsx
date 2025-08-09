import { useReducer, useEffect } from 'react';
import './App.css';

// Initial state
const initialState = {
  playerName: "Lord",
  resources: {
    timber: 0,
    stone: 0,
    iron: 0,
    food: 0,
    gold: 0,
    knowledge: 0
  },
  version: "v0.1"
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_TIMBER':
      return {
        ...state,
        resources: {
          ...state.resources,
          timber: state.resources.timber + 1
        }
      };
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        playerName: action.payload
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Resource tick - add 1 timber every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'ADD_TIMBER' });
      console.log("+1 Timber");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save/Load functionality
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 's' || e.key === 'S') {
        localStorage.setItem('gameState', JSON.stringify(state));
        console.log("Game state saved");
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

  return (
    <div className="app">
      <header className="top-bar">
        <h1>Lord of the Text – {state.version}</h1>
        <div className="resources">
          {Object.entries(state.resources).map(([resource, amount]) => (
            <div key={resource} className="resource">
              <span className="resource-icon">{resource.charAt(0).toUpperCase()}</span>
              <span className="resource-amount">{amount}</span>
            </div>
          ))}
        </div>
      </header>
      <main className="game-content">
        <p>Welcome, {state.playerName}!</p>
        <p>Press S to save, L to load.</p>
      </main>
      <footer className="version-badge">
        {state.version}
      </footer>
    </div>
  );
}

export default App;
