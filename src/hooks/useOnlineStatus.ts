import { useEffect, useState } from 'react';

export function useOnlineStatus(simulatedOffline: boolean = false) {
  const [isNavigatorOnline, setIsNavigatorOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsNavigatorOnline(true);
    const handleOffline = () => setIsNavigatorOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If user simulated offline or real browser is offline, effective status is offline
  const isOnline = !simulatedOffline && isNavigatorOnline;

  return {
    isOnline,
    isRealOffline: !isNavigatorOnline,
    isSimulatedOffline: simulatedOffline
  };
}
