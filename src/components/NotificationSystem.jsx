import { useEffect, useRef } from 'react';

export default function NotificationSystem({ notifications, onDismiss }) {
  const notificationTimers = useRef(new Map());

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notificationTimers.current.has(notification.id)) {
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, 5000);
        notificationTimers.current.set(notification.id, timer);
      }
    });
    
    const currentIds = new Set(notifications.map(n => n.id));
    Array.from(notificationTimers.current.keys()).forEach(id => {
      if (!currentIds.has(id)) {
        clearTimeout(notificationTimers.current.get(id));
        notificationTimers.current.delete(id);
      }
    });
  }, [notifications, onDismiss]);

  useEffect(() => {
    const timers = notificationTimers.current;
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div 
      className="toast-notifications" 
      role="region" 
      aria-live="polite"
      aria-label="Game notifications"
    >
      {notifications.map(n => (
        <div 
          key={n.id} 
          className="toast"
          role="alert"
          aria-live="assertive"
        >
          <span>{n.message}</span>
          <button 
            className="toast-dismiss" 
            onClick={() => onDismiss(n.id)} 
            aria-label={`Dismiss notification: ${n.message}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}