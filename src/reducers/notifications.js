export const initialNotifications = [];

export function notificationsReducer(notifications = initialNotifications, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const newNotifications = Array.isArray(action.payload) ? action.payload : [action.payload];
      // Add new notifications at the top (unshift behavior)
      return [...newNotifications, ...notifications];
    }
    case 'DISMISS_NOTIFICATION':
      return notifications.filter(n => n.id !== action.payload);
    case 'CLEAR_NOTIFICATIONS':
      return [];
    case 'LOAD_STATE':
      return action.payload.notifications || notifications;
    default:
      return notifications;
  }
}