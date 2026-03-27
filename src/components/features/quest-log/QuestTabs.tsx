import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import clsx from 'clsx';

import { BREAKPOINTS } from '@/config/windowBreakpoints';
import ChevronDoubleArrow from '@/assets/icons/chevron-double-right.svg?react';

export type TabKey = 'active' | 'daily' | 'done' | 'archive';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'АКТИВНЫЕ' },
  { key: 'daily', label: 'РЕГУЛЯРНЫЕ' },
  { key: 'done', label: 'ЗАВЕРШЕННЫЕ' },
  { key: 'archive', label: 'АРХИВ' },
];

type Props = {
  value: TabKey;
  onChange: (next: TabKey) => void;
};

const PADDING = 10;
const WIDTH_COEF = 0.9;

const COMPACT_SWITCH_MS = 260;
const HOLD_START_DELAY_MS = 340;
const HOLD_REPEAT_MS = 170;
const SWIPE_TRIGGER_PX = 56;
const SWIPE_LOCK_RATIO = 1.2;

type SwitchDirection = 'left' | 'right';
type PressedSwitch = SwitchDirection | null;
type CompactPhase = 'idle' | 'dragging' | 'settling';

function getTabIndex(key: TabKey) {
  return TABS.findIndex(t => t.key === key);
}

function getAdjacentTab(key: TabKey, direction: SwitchDirection): TabKey | null {
  const index = getTabIndex(key);

  if (index < 0) return null;

  if (direction === 'left') {
    return TABS[index - 1]?.key ?? null;
  }

  return TABS[index + 1]?.key ?? null;
}

function getTabLabel(key: TabKey | null): string {
  if (!key) return '';
  return TABS.find(t => t.key === key)?.label ?? '';
}

export function QuestTabs({ value, onChange }: Props) {
  const active = value;

  const phaseRef = useRef<CompactPhase>('idle');
  const listRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    active: null,
    daily: null,
    done: null,
    archive: null,
  });
  const scheduleNextHoldStepRef = useRef<(() => void) | null>(null);

  const isCompact = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`);

  const [glow, setGlow] = useState({ x: 0, w: 0 });

  // compact state
  const [displayedTab, setDisplayedTab] = useState<TabKey>(value);
  const [pressedSwitch, setPressedSwitch] = useState<PressedSwitch>(null);

  const [phase, setPhase] = useState<CompactPhase>('idle');
  const [dragX, setDragX] = useState(0);
  const [settleDirection, setSettleDirection] = useState<SwitchDirection | null>(null);

  const displayedTabRef = useRef(displayedTab);
  const pressedSwitchRef = useRef<PressedSwitch>(null);

  const holdDelayRef = useRef<number | null>(null);
  const holdRepeatRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const repeatEnabledRef = useRef(false);

  const pointerStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    lockedAxis: 'x' | 'y' | null;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    lockedAxis: null,
  });

  useEffect(() => {
    displayedTabRef.current = displayedTab;
  }, [displayedTab]);

  useEffect(() => {
    pressedSwitchRef.current = pressedSwitch;
  }, [pressedSwitch]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const currentIndex = useMemo(() => getTabIndex(displayedTab), [displayedTab]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < TABS.length - 1;

  const prevTab = hasPrev ? TABS[currentIndex - 1].key : null;
  const nextTab = hasNext ? TABS[currentIndex + 1].key : null;

  const clearHoldTimers = useCallback(() => {
    if (holdDelayRef.current !== null) {
      window.clearTimeout(holdDelayRef.current);
      holdDelayRef.current = null;
    }

    if (holdRepeatRef.current !== null) {
      window.clearTimeout(holdRepeatRef.current);
      holdRepeatRef.current = null;
    }
  }, []);

  const clearSettleTimer = useCallback(() => {
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  }, []);

  const stopHoldSwitch = useCallback(() => {
    clearHoldTimers();
    repeatEnabledRef.current = false;
    pressedSwitchRef.current = null;
    setPressedSwitch(null);
  }, [clearHoldTimers]);

  const finishSwitch = useCallback(
    (next: TabKey): void => {
      displayedTabRef.current = next;
      phaseRef.current = 'idle';

      setDisplayedTab(next);
      setPhase('idle');
      setDragX(0);
      setSettleDirection(null);
      onChange(next);

      if (repeatEnabledRef.current && pressedSwitchRef.current) {
        scheduleNextHoldStepRef.current?.();
      }
    },
    [onChange]
  );

  const commitSwitch = useCallback(
    (direction: SwitchDirection): boolean => {
      if (phaseRef.current === 'settling') return false;

      const current = displayedTabRef.current;
      const next = getAdjacentTab(current, direction);

      if (!next) return false;

      phaseRef.current = 'settling';
      setPhase('settling');
      setSettleDirection(direction);

      clearSettleTimer();
      settleTimeoutRef.current = window.setTimeout(() => {
        finishSwitch(next);
      }, COMPACT_SWITCH_MS);

      return true;
    },
    [clearSettleTimer, finishSwitch]
  );

  const scheduleNextHoldStep = useCallback((): void => {
    if (!repeatEnabledRef.current || !pressedSwitchRef.current) return;

    clearHoldTimers();

    holdRepeatRef.current = window.setTimeout(() => {
      const direction = pressedSwitchRef.current;

      if (!repeatEnabledRef.current || !direction) return;

      const moved = commitSwitch(direction);

      if (!moved) {
        stopHoldSwitch();
      }
    }, HOLD_REPEAT_MS);
  }, [clearHoldTimers, commitSwitch, stopHoldSwitch]);

  useEffect(() => {
    scheduleNextHoldStepRef.current = scheduleNextHoldStep;
  }, [scheduleNextHoldStep]);

  const startHoldSwitch = useCallback(
    (direction: SwitchDirection): void => {
      if (phaseRef.current === 'settling') return;

      setPressedSwitch(direction);
      pressedSwitchRef.current = direction;

      repeatEnabledRef.current = false;
      clearHoldTimers();

      const switched = commitSwitch(direction);

      if (!switched) {
        setPressedSwitch(null);
        pressedSwitchRef.current = null;
        return;
      }

      holdDelayRef.current = window.setTimeout(() => {
        if (pressedSwitchRef.current !== direction) return;

        repeatEnabledRef.current = true;
        scheduleNextHoldStep();
      }, HOLD_START_DELAY_MS);
    },
    [clearHoldTimers, commitSwitch, scheduleNextHoldStep]
  );

  useEffect(() => {
    return () => {
      clearHoldTimers();
      clearSettleTimer();
    };
  }, [clearHoldTimers, clearSettleTimer]);

  useEffect(() => {
    if (!pressedSwitch) return;

    const handleGlobalPointerUp = () => {
      stopHoldSwitch();
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [pressedSwitch, stopHoldSwitch]);

  useEffect(() => {
    if (phaseRef.current === 'settling' || phase === 'dragging') return;
    if (displayedTab === value) return;

    displayedTabRef.current = value;
    setDisplayedTab(value);
  }, [displayedTab, phase, value]);

  useLayoutEffect(() => {
    if (isCompact) return;

    let raf = 0;

    const recalc = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const list = listRef.current;
        const btn = btnRefs.current[active];
        if (!list || !btn) return;

        const listBox = list.getBoundingClientRect();
        const btnBox = btn.getBoundingClientRect();

        setGlow({
          x: btnBox.left - listBox.left + PADDING,
          w: Math.max(0, btnBox.width - PADDING * 2),
        });
      });
    };

    recalc();
    window.addEventListener('resize', recalc);

    const list = listRef.current;
    let ro: ResizeObserver | null = null;

    if (list && 'ResizeObserver' in window) {
      ro = new ResizeObserver(recalc);
      ro.observe(list);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', recalc);
      ro?.disconnect();
    };
  }, [active, isCompact]);

  const handleCompactPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase === 'settling') return;

    pointerStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lockedAxis: null,
    };

    setPhase('dragging');
    setDragX(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleCompactPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    if (phase !== 'dragging' || state.pointerId !== e.pointerId) return;

    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;

    if (!state.lockedAxis) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < 6 && absY < 6) return;

      state.lockedAxis = absX > absY * SWIPE_LOCK_RATIO ? 'x' : 'y';
    }

    if (state.lockedAxis === 'y') {
      setPhase('idle');
      setDragX(0);
      return;
    }

    if (deltaX > 0 && !prevTab) {
      setDragX(deltaX * 0.22);
      return;
    }

    if (deltaX < 0 && !nextTab) {
      setDragX(deltaX * 0.22);
      return;
    }

    setDragX(deltaX);
  };

  const finishPointerInteraction = useCallback(
    (pointerId?: number) => {
      const state = pointerStateRef.current;

      if (pointerId !== undefined && state.pointerId !== pointerId) return;

      pointerStateRef.current = {
        pointerId: null,
        startX: 0,
        startY: 0,
        lockedAxis: null,
      };

      if (phase !== 'dragging') {
        setDragX(0);
        setPhase('idle');
        return;
      }

      const currentDrag = dragX;

      if (Math.abs(currentDrag) < SWIPE_TRIGGER_PX) {
        setPhase('idle');
        setDragX(0);
        return;
      }

      if (currentDrag < 0 && nextTab) {
        setPhase('settling');
        setSettleDirection('right');

        clearSettleTimer();
        settleTimeoutRef.current = window.setTimeout(() => {
          finishSwitch(nextTab);
        }, COMPACT_SWITCH_MS);

        return;
      }

      if (currentDrag > 0 && prevTab) {
        setPhase('settling');
        setSettleDirection('left');

        clearSettleTimer();
        settleTimeoutRef.current = window.setTimeout(() => {
          finishSwitch(prevTab);
        }, COMPACT_SWITCH_MS);

        return;
      }

      setPhase('idle');
      setDragX(0);
    },
    [clearSettleTimer, dragX, finishSwitch, nextTab, phase, prevTab]
  );

  const handleCompactPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishPointerInteraction(e.pointerId);
  };

  const handleCompactPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    finishPointerInteraction(e.pointerId);
  };

  const renderCompactViewport = () => {
    return (
      <div
        className={clsx('tabs__viewport', phase === 'dragging' && 'is-dragging')}
        onPointerDown={handleCompactPointerDown}
        onPointerMove={handleCompactPointerMove}
        onPointerUp={handleCompactPointerUp}
        onPointerCancel={handleCompactPointerCancel}
      >
        <div
          className={clsx(
            'tabs__track',
            phase === 'dragging' && 'is-dragging',
            phase === 'settling' && 'is-settling',
            settleDirection === 'left' && 'is-settling-left',
            settleDirection === 'right' && 'is-settling-right'
          )}
          style={
            {
              '--tabs-drag-x': `${dragX}px`,
              '--tabs-switch-ms': `${COMPACT_SWITCH_MS}ms`,
            } as React.CSSProperties
          }
        >
          <div className="tabs__slide tabs__slide--prev">{getTabLabel(prevTab)}</div>
          <div className="tabs__slide tabs__slide--current">{getTabLabel(displayedTab)}</div>
          <div className="tabs__slide tabs__slide--next">{getTabLabel(nextTab)}</div>
        </div>
      </div>
    );
  };

  const renderTabs = (): React.ReactNode => {
    if (isCompact) {
      return (
        <div className="tabs__list--compact" ref={listRef}>
          <button
            type="button"
            className={clsx(
              'tabs__switch',
              'tabs__switch--left',
              pressedSwitch === 'left' && 'is-pressed',
              phase === 'settling' && 'is-busy'
            )}
            disabled={!hasPrev}
            aria-label="Предыдущая вкладка"
            aria-disabled={!hasPrev || phase === 'settling'}
            onPointerDown={() => startHoldSwitch('left')}
          >
            <ChevronDoubleArrow />
          </button>

          {renderCompactViewport()}

          <button
            type="button"
            className={clsx(
              'tabs__switch',
              'tabs__switch--right',
              pressedSwitch === 'right' && 'is-pressed',
              phase === 'settling' && 'is-busy'
            )}
            disabled={!hasNext}
            aria-label="Следующая вкладка"
            aria-disabled={!hasNext || phase === 'settling'}
            onPointerDown={() => startHoldSwitch('right')}
          >
            <ChevronDoubleArrow />
          </button>
        </div>
      );
    }

    return (
      <div className="tabs__list" role="tablist" ref={listRef}>
        <div
          className="tabs__glow"
          style={{ transform: `translateX(${glow.x}px)`, width: glow.w * WIDTH_COEF }}
          aria-hidden="true"
        />
        {TABS.map((t, index) => {
          const isActive = t.key === active;

          return (
            <React.Fragment key={t.key}>
              {index > 0 && <div className="tabs__separator" aria-hidden="true" />}

              <button
                ref={el => {
                  btnRefs.current[t.key] = el;
                }}
                type="button"
                role="tab"
                className={clsx('tab', isActive && 'tab--active')}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(t.key)}
              >
                {t.label}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className={clsx('tabs', isCompact && 'tabs--compact')}>
      <div className="tabs__frame" aria-hidden="true" />
      {renderTabs()}
    </div>
  );
}
