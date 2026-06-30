import { useEffect, useRef, useState } from 'react';

/**
 * Polls `fn` every `intervalMs`. Pauses when the tab is hidden — the cache
 * already protects the upstream, but we don't need to keep firing requests
 * for a tab the user can't see.
 */
export default function useAutoRefresh(fn, intervalMs = 30000, enabled = true) {
  const [tick, setTick] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return undefined;
    let id;
    const start = () => {
      stop();
      id = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fnRef.current?.();
          setTick((t) => t + 1);
        }
      }, intervalMs);
    };
    const stop = () => { if (id) clearInterval(id); };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fnRef.current?.();
        start();
      } else {
        stop();
      }
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, enabled]);

  return tick;
}
