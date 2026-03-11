import { useCallback, useEffect, useRef, useState } from 'react';
import type { QuestModalAnimPhase } from '../types';

const CLOSE_ANIMATION_MS = 360;

export function useQuestModalClose(onClose: () => void) {
  const [phase, setPhase] = useState<QuestModalAnimPhase>('enter');
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    setPhase('exit');

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setPhase('idle');
    });

    return () => {
      window.cancelAnimationFrame(rafId);

      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [requestClose]);

  return {
    phase,
    requestClose,
  };
}
