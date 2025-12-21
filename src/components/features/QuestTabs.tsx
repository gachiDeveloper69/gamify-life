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
    const list = listRef.current;
    const btn = btnRefs.current[active];
    if (!list || !btn) return;

    const listBox = list.getBoundingClientRect();
    const btnBox = btn.getBoundingClientRect();

    setGlow({
      x: btnBox.left - listBox.left + PADDING,
      w: Math.max(0, btnBox.width - PADDING * 2),
    });
  }, [active]);

  return (
    <div className="tabs">
      <div className="tabs__frame" aria-hidden="true">
        {/* svg-контур */}
        {/* <div className="tabs__outlinne" /> */}
        {/* <svg
          className="tabs__outline"
          preserveAspectRatio="none"
          // width="47"
          // height="8"
          viewBox="0 0 47 7.15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          vectorEffect="non-scaling-stroke"
        >
          <path
            d="M0.149994 7.14999H43.15L46.15 4.14999V0.149994H5.14999L0.149994 5.14999V7.14999Z"
            stroke="#0681AB"
            strokeWidth="0.3"
          />
        </svg> */}
      </div>

      <div className="tabs__list" role="tablist" ref={listRef}>
        {/* glow-индикатор */}
        <div
          className="tabs__glow"
          style={{ transform: `translateX(${glow.x}px)`, width: glow.w * WIDTH_COEF }}
          aria-hidden="true"
        />
        {TABS.map(t => {
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
        })}
      </div>
    </div>
  );
}
