import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { TASK_RULES } from '@/config/taskRules';
import { getState } from '@/utils/deadline/getState';

import Lightning from '@/assets/icons/lightning.svg?react';

type Parts = {
  d: number;
  h: number;
  m: number;
  // s: number
};

type IconState = 'unset' | 'set';

type QuestDeadlineStepperProps = {
  value: number | null;
  onChange: (next: number | null) => void;
  disabled?: boolean;
  defaultDurationMs?: number;
};

// const MIN = 60;
const H = 60; // минут в часе
const D = 24 * H; // минут в дне = 1440

function partsToTotalMinutes(p: Parts) {
  return p.d * D + p.h * H + p.m;
}

function totalMinutesToParts(total: number): Parts {
  const safe = Math.max(0, total);

  const d = Math.floor(safe / D);
  const h = Math.floor((safe % D) / H);
  const m = Math.floor((safe % D) % H);

  return { d, h, m };
}

function msToTotalMinutes(ms: number) {
  return Math.round(Math.max(0, ms) / 60_000);
}

function normalizeParts(p: Parts): Parts {
  const maxTotal = TASK_RULES.deadlineMaxDays * D + 23 * H + 59; // мин
  const total = clamp(partsToTotalMinutes(p), 0, maxTotal);
  return totalMinutesToParts(total);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type Unit = keyof Parts;

const UNIT_META: Record<Unit, { label: string; max: number }> = {
  d: { label: 'д', max: TASK_RULES.deadlineMaxDays },
  h: { label: 'ч', max: 23 },
  m: { label: 'м', max: 59 },
  // s: { label: 'с', max: 59 },
};

export function QuestDeadlineStepper({
  value,
  onChange,
  disabled,
  defaultDurationMs = 0,
}: QuestDeadlineStepperProps) {
  const baseNowRef = useRef<number>(Date.now());
  const lastNonZeroRef = useRef<Parts>({ d: 0, h: 1, m: 0 }); // дефолт 1 час
  const initialMinutes = useMemo(() => {
    const ms = value ? Math.max(0, value - baseNowRef.current) : defaultDurationMs;
    return msToTotalMinutes(ms);
  }, [value, defaultDurationMs]);

  const [enabled, setEnabled] = useState<boolean>(() => Boolean(value) || defaultDurationMs > 0);
  const [parts, setParts] = useState<Parts>(() =>
    normalizeParts(totalMinutesToParts(initialMinutes))
  );
  const [focusedUnit, setFocusedUnit] = useState<Unit | null>(null);
  const [text, setText] = useState<Record<Unit, string>>({
    d: '',
    h: '',
    m: '',
  });

  const iconState: IconState = enabled && partsToTotalMinutes(parts) > 0 ? 'set' : 'unset';
  const selfUpdateRef = useRef(false);

  // pulse
  const [pulse, setPulse] = useState<{ unit: Unit; dir: 'up' | 'down' } | null>(null);
  const pulseTimer = useRef<number | null>(null);

  const pulseUnit = (unit: Unit, dir: 'up' | 'down') => {
    setPulse({ unit, dir });
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setPulse(null), 160);
  };

  // hold-to-repeat
  const hold = useRef<{ t0: number | null; id: number | null }>({ t0: null, id: null });

  const stopHold = () => {
    if (hold.current.t0) window.clearTimeout(hold.current.t0);
    if (hold.current.id) window.clearInterval(hold.current.id);
    hold.current.t0 = null;
    hold.current.id = null;
  };

  const startHold = (action: () => void) => {
    action(); // первый тик сразу
    stopHold();
    hold.current.t0 = window.setTimeout(() => {
      hold.current.id = window.setInterval(action, 55);
    }, 240);
  };

  function commit(nextParts: Parts, nextEnabled = enabled) {
    const normalized = normalizeParts(nextParts);
    setParts(normalized);

    const totalMin = partsToTotalMinutes(normalized);

    if (totalMin > 0) lastNonZeroRef.current = normalized;
    if (!nextEnabled || totalMin <= 0) {
      selfUpdateRef.current = true;
      onChange(baseNowRef.current + totalMin * 60_000);
      onChange(null);
      return;
    }

    onChange(baseNowRef.current + totalMin * 60_000);
  }

  const setUnit = (unit: Unit, raw: number) => {
    const meta = UNIT_META[unit];
    const next = { ...parts, [unit]: clamp(Number.isFinite(raw) ? raw : 0, 0, meta.max) } as Parts;
    commit(next);
  };

  const bumpUnit = (unit: Unit, delta: number) => {
    const meta = UNIT_META[unit];
    const nextVal = clamp(parts[unit] + delta, 0, meta.max);
    const next = { ...parts, [unit]: nextVal } as Parts;
    commit(next);
    pulseUnit(unit, delta >= 0 ? 'up' : 'down');
  };

  const onWheelUnit: React.WheelEventHandler<HTMLInputElement> = e => {
    e.preventDefault();
    const unit = (e.currentTarget.dataset.unit as Unit) || 'm';
    const dir = e.deltaY < 0 ? 1 : -1;
    bumpUnit(unit, dir);
  };

  const toggleEnabled = () => {
    if (disabled) return;

    const next = !enabled;
    setEnabled(next);

    if (!next) {
      // закрываем — дедлайн OFF, но parts НЕ трогаем (чтобы не сбросить UI мгновенно)
      onChange(null);
      return;
    }

    // открываем — если сейчас нули, восстанавливаем последнее нормальное значение
    const totalMin = partsToTotalMinutes(parts);
    if (totalMin <= 0) {
      const restored = normalizeParts(lastNonZeroRef.current);
      setParts(restored);
      onChange(baseNowRef.current + partsToTotalMinutes(restored) * 60_000);
    } else {
      onChange(baseNowRef.current + totalMin * 60_000);
    }
  };

  useEffect(() => {
    return () => {
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    };
  }, []);

  useEffect(() => stopHold, []);

  // sync when value changes from outside (open another quest etc.)
  useEffect(() => {
    if (selfUpdateRef.current) {
      selfUpdateRef.current = false;
      return;
    }

    baseNowRef.current = Date.now();
    const ms = value ? Math.max(0, value - baseNowRef.current) : defaultDurationMs;

    setEnabled(Boolean(value) || defaultDurationMs > 0);
    setParts(normalizeParts(totalMinutesToParts(msToTotalMinutes(ms))));
  }, [value]);

  useEffect(() => {
    setText(prev => {
      const next = { ...prev };
      (Object.keys(UNIT_META) as Unit[]).forEach(u => {
        if (focusedUnit !== u) next[u] = String(parts[u]);
      });
      return next;
    });
  }, [parts, focusedUnit]);

  const panelOpen = enabled && !disabled;

  return (
    <div className="bmeta">
      <div className={clsx('bmeta__deadlineWrap', panelOpen && 'bmeta__deadlineWrap--open')}>
        {/* всегда видно только ⏱ */}
        <button
          type="button"
          className={clsx('bmeta__deadlineToggle', panelOpen && 'is-open')}
          onClick={toggleEnabled}
          disabled={disabled}
          aria-expanded={panelOpen}
          aria-label={panelOpen ? 'Отключить дедлайн' : 'Включить дедлайн'}
          title={panelOpen ? 'Отключить дедлайн' : 'Включить дедлайн'}
        >
          <Lightning className={`bmeta__dlIcon bmeta__dlIcon--${iconState}`} />
        </button>

        {/* панель “выезжает” */}
        <div className={clsx('bmeta__deadlinePanel', panelOpen && 'is-open')}>
          {(Object.keys(UNIT_META) as Unit[]).map(unit => {
            const meta = UNIT_META[unit];
            const val = parts[unit];

            const pulsing =
              pulse?.unit === unit ? (pulse.dir === 'up' ? 'is-pulse-up' : 'is-pulse-down') : null;

            return (
              <div key={unit} className="bmeta__dlUnit">
                <button
                  type="button"
                  className="bmeta__dlBtn bmeta__dlBtn--up"
                  disabled={disabled || !enabled}
                  aria-label={`Увеличить ${meta.label}`}
                  onPointerDown={e => {
                    e.preventDefault();
                    startHold(() => bumpUnit(unit, 1));
                  }}
                  onPointerUp={stopHold}
                  onPointerCancel={stopHold}
                  onPointerLeave={stopHold}
                >
                  ▲
                </button>

                <div className={clsx('bmeta__dlField', pulsing)}>
                  <input
                    className="bmeta__dlInput"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={focusedUnit === unit ? text[unit] : String(parts[unit])}
                    disabled={disabled || !enabled}
                    data-unit={unit}
                    onWheel={onWheelUnit}
                    onChange={e => {
                      const onlyDigits = e.target.value.replace(/[^\d]/g, '');
                      setText(prev => ({ ...prev, [unit]: onlyDigits }));
                    }}
                    onFocus={() => {
                      setFocusedUnit(unit);
                      setText(prev => ({
                        ...prev,
                        [unit]: parts[unit] === 0 ? '' : String(parts[unit]),
                      }));
                    }}
                    onBlur={() => {
                      setFocusedUnit(null);

                      const raw = text[unit].trim();
                      const n = raw === '' ? 0 : Number(raw);

                      setUnit(unit, Number.isFinite(n) ? n : 0);
                    }}
                    aria-label={meta.label}
                  />
                  <span className="bmeta__dlLabel" aria-hidden="true">
                    {meta.label}
                  </span>
                </div>

                <button
                  type="button"
                  className="bmeta__dlBtn bmeta__dlBtn--down"
                  disabled={disabled || !enabled}
                  aria-label={`Уменьшить ${meta.label}`}
                  onPointerDown={e => {
                    e.preventDefault();
                    startHold(() => bumpUnit(unit, -1));
                  }}
                  onPointerUp={stopHold}
                  onPointerCancel={stopHold}
                  onPointerLeave={stopHold}
                >
                  ▼
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
