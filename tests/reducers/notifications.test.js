import { describe, it, expect } from 'vitest';
import { notificationsReducer, initialNotifications } from '../../src/reducers/notifications';

describe('notificationsReducer', () => {
  it('should return initial state when no state is provided', () => {
    const state = notificationsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialNotifications);
  });

  it('should add a single notification with ADD_NOTIFICATION action', () => {
    const notification = {
      id: 'notif-123',
      message: 'Test notification',
      timestamp: Date.now()
    };
    const state = notificationsReducer([], {
      type: 'ADD_NOTIFICATION',
      payload: notification
    });
    expect(state).toHaveLength(1);
    expect(state[0]).toEqual(notification);
  });

  it('should add multiple notifications with ADD_NOTIFICATION action (array payload)', () => {
    const notifications = [
      { id: 'notif-1', message: 'First', timestamp: 1000 },
      { id: 'notif-2', message: 'Second', timestamp: 2000 }
    ];
    const state = notificationsReducer([], {
      type: 'ADD_NOTIFICATION',
      payload: notifications
    });
    expect(state).toHaveLength(2);
    expect(state[0]).toEqual(notifications[0]);
    expect(state[1]).toEqual(notifications[1]);
  });

  it('should add new notifications at the top (most recent first)', () => {
    const initialState = [
      { id: 'notif-old', message: 'Old notification', timestamp: 1000 }
    ];
    const newNotification = {
      id: 'notif-new',
      message: 'New notification',
      timestamp: 2000
    };
    const state = notificationsReducer(initialState, {
      type: 'ADD_NOTIFICATION',
      payload: newNotification
    });
    expect(state).toHaveLength(2);
    expect(state[0]).toEqual(newNotification);
    expect(state[1]).toEqual(initialState[0]);
  });

  it('should dismiss a notification by ID', () => {
    const initialState = [
      { id: 'notif-1', message: 'First', timestamp: 1000 },
      { id: 'notif-2', message: 'Second', timestamp: 2000 },
      { id: 'notif-3', message: 'Third', timestamp: 3000 }
    ];
    const state = notificationsReducer(initialState, {
      type: 'DISMISS_NOTIFICATION',
      payload: 'notif-2'
    });
    expect(state).toHaveLength(2);
    expect(state.map(n => n.id)).toEqual(['notif-1', 'notif-3']);
  });

  it('should handle dismiss with non-existent ID gracefully', () => {
    const initialState = [
      { id: 'notif-1', message: 'First', timestamp: 1000 }
    ];
    const state = notificationsReducer(initialState, {
      type: 'DISMISS_NOTIFICATION',
      payload: 'non-existent'
    });
    expect(state).toEqual(initialState);
  });

  it('should clear all notifications', () => {
    const initialState = [
      { id: 'notif-1', message: 'First', timestamp: 1000 },
      { id: 'notif-2', message: 'Second', timestamp: 2000 }
    ];
    const state = notificationsReducer(initialState, {
      type: 'CLEAR_NOTIFICATIONS'
    });
    expect(state).toEqual([]);
  });

  it('should load state from LOAD_STATE action', () => {
    const loadedState = [
      { id: 'notif-saved', message: 'Saved notification', timestamp: 5000 }
    ];
    const state = notificationsReducer([], {
      type: 'LOAD_STATE',
      payload: { notifications: loadedState }
    });
    expect(state).toEqual(loadedState);
  });

  it('should handle LOAD_STATE with missing notifications', () => {
    const initialState = [
      { id: 'notif-initial', message: 'Initial', timestamp: 1000 }
    ];
    const state = notificationsReducer(initialState, {
      type: 'LOAD_STATE',
      payload: {}
    });
    expect(state).toEqual(initialState);
  });

  it('should return unchanged state for unknown actions', () => {
    const initialState = [
      { id: 'notif-1', message: 'First', timestamp: 1000 }
    ];
    const state = notificationsReducer(initialState, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });
});
