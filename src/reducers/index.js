import { resourcesReducer, initialResources } from './resources.js';
import { buildingsReducer, initialBuildings } from './buildings.js';
import { unitsReducer, initialUnits, initialUnitQueue } from './units.js';
import { notificationsReducer, initialNotifications } from './notifications.js';

function combineReducers(reducers) {
  return (state, action) => {
    const nextState = {};
    let resourceResult = null;
    for (const key in reducers) {
      if (key === 'resources') {
        resourceResult = reducers[key](state[key], action, state);
        nextState[key] = resourceResult.resources;
      } else if (key === 'notifications') {
        const notificationResult = reducers[key](state[key], action);
        nextState[key] = resourceResult && resourceResult.notifications && resourceResult.notifications.length > 0 ? [...notificationResult, ...resourceResult.notifications] : notificationResult;
      } else {
        nextState[key] = reducers[key](state[key], action, state);
      }
    }
    return nextState;
  };
}

const reducers = {
  resources: resourcesReducer,
  buildings: buildingsReducer,
  units: unitsReducer,
  notifications: notificationsReducer,
};

export const gameReducer = combineReducers(reducers);

export const initialState = {
  resources: initialResources,
  buildings: initialBuildings,
  units: {
    units: initialUnits,
    unitQueue: initialUnitQueue,
  },
  notifications: initialNotifications,
  playerName: "Lord",
  version: "v0.3"
};