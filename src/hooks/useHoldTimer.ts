import { useCallback, useEffect, useRef, useState } from 'react';
import { TIMER_TICK_MS } from '../constants/config';

type Options = {
  onComplete?: (heldSeconds: number) => void;
};

/**
 * Countdown driven by a ref'd deadline (rule #8 — values read inside the tick
 * callback live in refs, not state). Cleans its interval up on unmount.
 */
export function useHoldTimer(options: Options = {}) {
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);

  const deadlineRef = useRef(0);
  const durationRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeRef = useRef(options.onComplete);

  completeRef.current = options.onComplete;

  const clear = useCallback(() => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
    setRemaining(0);
  }, [clear]);

  const start = useCallback(
    (seconds: number) => {
      clear();
      if (seconds <= 0) {
        setRunning(false);
        setRemaining(0);
        return;
      }
      durationRef.current = seconds;
      deadlineRef.current = Date.now() + seconds * 1000;
      setRemaining(seconds);
      setRunning(true);
      tickRef.current = setInterval(() => {
        const left = Math.ceil((deadlineRef.current - Date.now()) / 1000);
        if (left <= 0) {
          clear();
          setRunning(false);
          setRemaining(0);
          const done = completeRef.current;
          if (done) {
            done(durationRef.current);
          }
        } else {
          setRemaining(left);
        }
      }, TIMER_TICK_MS);
    },
    [clear],
  );

  /** Finish early and report however long was actually held. */
  const skip = useCallback(() => {
    const held = Math.max(
      0,
      durationRef.current - Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)),
    );
    clear();
    setRunning(false);
    setRemaining(0);
    return held;
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { remaining, running, start, stop, skip };
}

export default useHoldTimer;
