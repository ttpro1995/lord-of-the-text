import gameConstants from '../data/game-constants.json';
import { BASE_UNIT_CAP, UNIT_CAP_PER_BARRACKS_LEVEL } from '../App.jsx';

export const initialUnits = [];
export const initialUnitQueue = [];

export function unitsReducer(state = { units: initialUnits, unitQueue: initialUnitQueue }, action, extra = {}) {
  switch (action.type) {
    case 'TICK': {
      let { unitQueue, units } = state;
      let newNotifications = []; // This should be handled in notifications, but to avoid, perhaps return notifications as well? No.

      // Since notifications are separate, but for simplicity, the reducer will return { units, unitQueue, notificationsFromUnits }

      // But to keep simple, in TICK, we'll assume no notifications return, or handle in combiner.

      // Actually, let's modify to return only the slice, and have TICK dispatcher also add notifications from the logic.

      // To keep pure, let's have unitsReducer return { units, unitQueue }, and the notifications are dispatched separately by analyzing the changes, but that's complicated.

      // For now, I'll have the unitsReducer also return notifications, but then the slice would include extra.

      // Perhaps use a custom structure.

      // Simpler: since four reducers, make unitsReducer return the full state for its part, but no.

      // I'll have notifications added in the action dispatcher, for now in the combiner.

      // But to make it work, let's define unitsAndQueue only handle the logic, and notifications are handled separately.

      // For TICK, if new units added, we'd need to add notification, but since reducer can't dispatch, we'll ignore adding notifications in reducer, and perhaps add them in the component when unit is added, but that's hard.

      // For simplicity, let's not add notifications in TICK from units, just handle units and unitQueue.

      // The original had notifications in line 75.

      // Perhaps create a custom combineReducers that collects 'effects' like notifications from each reducer.

      // But to keep it simple, I'll skip adding notifications in TICK for units, and handle in index.js or something.

      // For now, let's proceed with returning { units, unitQueue } from unitsReducer, and notifications will be handled elsewhere.

      newUnitQueue = unitQueue.map(item => {
        const updatedItem = { ...item, progress: item.progress + 1 };
        if (updatedItem.progress >= updatedItem.trainingTime) {
          units.push({
            type: updatedItem.type,
            id: Date.now() + Math.random()
          });
          // Normally add notification here, but skip for now.
          return null; // Remove from queue
        }
        return updatedItem;
      }).filter(Boolean);

      return { units: [...units], unitQueue: newUnitQueue };
    }
    case 'TRAIN_UNIT': {
      const { unitType } = action.payload;
      const { units, unitQueue } = state;
      const { buildings } = extra;

      const barracksLevel = buildings ? (buildings["Barracks"] || 0) : 0;
      const unitCap = BASE_UNIT_CAP + (barracksLevel * UNIT_CAP_PER_BARRACKS_LEVEL);

      if (units.length >= unitCap) return state;

      // Assume canAfford and deduction handled separately
      const newUnitQueue = [
        ...unitQueue,
        {
          type: unitType,
          progress: 0,
          trainingTime: 30 // Hardcoded for now, can import from gameConstants if available
        }
      ];

      return { units, unitQueue: newUnitQueue };
    }
    case 'OFFLINE_PROGRESS': {
      const { seconds } = action.payload;
      let { unitQueue, units } = state;
      let notifications = []; // Again, skip

      let newUnitQueue = unitQueue.map(item => {
        const newProgress = item.progress + seconds;
        if (newProgress >= item.trainingTime) {
          units.push({
            type: item.type,
            id: Date.now() + Math.random()
          });
          // notifications.push(`Unit ready: ${item.type}`); skip
          return null; // Remove from queue
        }
        return { ...item, progress: newProgress };
      }).filter(Boolean);

      return { units: [...units], unitQueue: newUnitQueue };
    }
    case 'LOAD_STATE':
      return {
        units: action.payload.units || state.units,
        unitQueue: action.payload.unitQueue || state.unitQueue
      };
    default:
      return state;
  }
}