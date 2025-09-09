export const initialNotifications = [];

export function notificationsReducer(notifications = initialNotifications, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = Array.isArray(action.payload) ? action.payload : [action.payload];
      return [...notifications, ...newNotifications];
    case 'CLEAR_NOTIFICATIONS':
      return [];
    case 'LOAD_STATE':
      return action.payload.notifications || notifications;
    default:
      return notifications;
  }
}