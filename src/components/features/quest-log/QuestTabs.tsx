import React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

type TabKey = 'active' | 'daily' | 'done';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'АКТИВНЫЕ' },
  { key: 'daily', label: 'РЕГУЛЯРНЫЕ' },
  { key: 'done', label: 'ЗАВЕРШЕННЫЕ' },
];

const PADDING = 10; // “запас” по краям glow относительно кнопки
const WIDTH_COEF = 0.9;

export function QuestTabs() {
  const [active, setActive] = useState<TabKey>('active');

  const listRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    active: null,
    daily: null,
    done: null,
  });

  const [glow, setGlow] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
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
  }, [active]);

  return (
    <div className="tabs">
      <div className="tabs__frame" aria-hidden="true"></div>

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
            <React.Fragment key={t.key}>
              {index > 0 && <div className="tabs__separator" aria-hidden="true" />}

              <button
                key={t.key}
                ref={el => {
                  btnRefs.current[t.key] = el;
                }}
                type="button"
                role="tab"
                className={`tab ${isActive ? 'tab--active' : ''}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(t.key)}
              >
                {t.label}
              </button>
            </React.Fragment>
          );
        })}
        {/* {TABS.map(t => {
          const isActive = t.key === active;
          return (

            <button
              key={t.key}
              ref={el => {
                btnRefs.current[t.key] = el;
              }}
              type="button"
              role="tab"
              className={`tab ${isActive ? 'tab--active' : ''}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          );
        })} */}
      </div>
    </div>
  );
}
