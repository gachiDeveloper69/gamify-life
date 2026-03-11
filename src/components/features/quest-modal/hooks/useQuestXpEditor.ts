import { useEffect, useRef, useState } from 'react';

type UseQuestXpEditorParams = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  onTouch: () => void;
};

type XpPulse = 'up' | 'down' | null;

export function useQuestXpEditor({
  value,
  min,
  max,
  step,
  onChange,
  onTouch,
}: UseQuestXpEditorParams) {
  const [xpEditing, setXpEditing] = useState(false);
  const [xpPulse, setXpPulse] = useState<XpPulse>(null);
  const xpInputRef = useRef<HTMLInputElement | null>(null);

  const repeatRef = useRef<number | null>(null);
  const repeatTimeoutRef = useRef<number | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clampPoints = (n: number) => Math.max(min, Math.min(max, n));

  const setPoints = (next: number) => {
    onTouch();
    onChange(clampPoints(next));
  };

  const pulseXp = (dir: 'up' | 'down') => {
    setXpPulse(dir);
    window.setTimeout(() => setXpPulse(null), 160);
  };

  const bumpPoints = (delta: number) => {
    const next = valueRef.current + delta;
    setPoints(next);
    pulseXp(delta >= 0 ? 'up' : 'down');
  };

  const stopRepeat = () => {
    if (repeatTimeoutRef.current) {
      window.clearTimeout(repeatTimeoutRef.current);
      repeatTimeoutRef.current = null;
    }

    if (repeatRef.current) {
      window.clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  };

  const startRepeat = (delta: number) => {
    bumpPoints(delta);

    repeatTimeoutRef.current = window.setTimeout(() => {
      repeatRef.current = window.setInterval(() => {
        const current = valueRef.current;
        const next = clampPoints(current + delta);

        if (next === current) {
          stopRepeat();
          return;
        }

        onTouch();
        onChange(next);
      }, 60);
    }, 250);
  };

  useEffect(() => {
    if (!xpEditing) return;
    xpInputRef.current?.focus();
    xpInputRef.current?.select();
  }, [xpEditing]);

  useEffect(() => stopRepeat, []);

  return {
    xpStep: step,
    xpEditing,
    xpPulse,
    xpInputRef,
    setXpEditing,
    setPoints,
    startRepeat,
    stopRepeat,
  };
}
