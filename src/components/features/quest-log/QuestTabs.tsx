import React, { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { useLayoutEffect, useRef, useState } from 'react';

import { BREAKPOINTS } from '@/config/windowBreakpoints';
import clsx from 'clsx';

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

const PADDING = 10; // запас по краям glow относительно кнопки
const WIDTH_COEF = 0.9;

export function QuestTabs({ value, onChange }: Props) {
  const active = value;

  const listRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    active: null,
    daily: null,
    done: null,
    archive: null,
  });

  const isCompact = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`);

  const { hasPrev, hasNext, currentIndex, prevTab, nextTab } = useMemo(() => {
    const currentIndex = TABS.findIndex(t => t.key === active);
    return {
      currentIndex,
      hasPrev: currentIndex > 0,
      hasNext: currentIndex < TABS.length - 1,
      prevTab: currentIndex > 0 ? TABS[currentIndex - 1].key : TABS[currentIndex].key,
      nextTab: currentIndex < TABS.length - 1 ? TABS[currentIndex + 1].key : TABS[currentIndex].key,
    };
  }, [active]);

  const handleSwitchPrev = () => {
    if (!hasPrev) return;
    onChange(prevTab);
  };

  const handleSwitchNext = () => {
    if (!hasNext) return;
    onChange(nextTab);
  };

  const [glow, setGlow] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    if (!isCompact) {
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
    }
  }, [active, isCompact]);

  const renderTabs = (): React.ReactNode => {
    if (isCompact) {
      return (
        <div className="tabs__list--compact" ref={listRef}>
          <button
            type="button"
            className="tabs__switch tabs__switch--left"
            disabled={!hasPrev}
            aria-label={`Предыдущая вкладка`}
            onClick={handleSwitchPrev}
          >
            ◀
          </button>
          <React.Fragment>
            <div className={`tab tab--active`} aria-selected={true}>
              {TABS[currentIndex].label}
            </div>
          </React.Fragment>
          <button
            type="button"
            className="tabs__switch tabs__switch--right"
            disabled={!hasNext}
            aria-label={`Следующая вкладка`}
            onClick={handleSwitchNext}
          >
            ▶
          </button>
        </div>
      );
    }
    return (
      <div className="tabs__list" role="tablist" ref={listRef}>
        {/* glow-индикатор */}
        <div
          className="tabs__glow"
          style={{ transform: `translateX(${glow.x}px)`, width: glow.w * WIDTH_COEF }}
          aria-hidden="true"
        />
        {TABS.map((t, index) => {
          const isActive = t.key === active;
          return (
            <React.Fragment>
              {index > 0 && <div className="tabs__separator" aria-hidden="true" />}

              <button
                ref={el => {
                  btnRefs.current[t.key] = el;
                }}
                key={t.key}
                type="button"
                role="tab"
                className={`tab ${isActive ? 'tab--active' : ''}`}
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
      <div className="tabs__frame" aria-hidden="true"></div>
      {renderTabs()}
    </div>
  );
}
