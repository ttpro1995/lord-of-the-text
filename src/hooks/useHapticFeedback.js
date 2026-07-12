/**
 * Hook for providing haptic feedback on mobile devices
 * Uses the Vibration API when available
 */
export function useHapticFeedback() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = (pattern = 10) => {
    if (!isSupported) return;
    navigator.vibrate(pattern);
  };

  const impactLight = () => {
    vibrate(10);
  };

  const impactMedium = () => {
    vibrate(20);
  };

  const impactHeavy = () => {
    vibrate(30);
  };

  const notificationSuccess = () => {
    vibrate([0, 10, 20, 10]);
  };

  const notificationError = () => {
    vibrate([0, 30, 10, 30]);
  };

  const selection = () => {
    vibrate(5);
  };

  return {
    isSupported,
    vibrate,
    impactLight,
    impactMedium,
    impactHeavy,
    notificationSuccess,
    notificationError,
    selection
  };
}