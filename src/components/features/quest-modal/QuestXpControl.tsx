import clsx from 'clsx';
import React from 'react';
import Plus from '@/assets/icons/plus.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import { TASK_RULES } from '@/config/taskRules';

type QuestXpControlProps = {
  canEdit: boolean;
  xpEditing: boolean;
  xpPulse: 'up' | 'down' | null;
  value: number;
  xpStep: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onChange: (next: number) => void;
  onDecreaseStart: () => void;
  onIncreaseStart: () => void;
  onRepeatStop: () => void;
};

export function QuestXpControl({
  canEdit,
  xpEditing,
  xpPulse,
  value,
  xpStep,
  inputRef,
  onStartEdit,
  onStopEdit,
  onChange,
  onDecreaseStart,
  onIncreaseStart,
  onRepeatStop,
}: QuestXpControlProps) {
  if (!canEdit) {
    return (
      <div className="bmeta__item bmeta__item--xp">
        <span className="bmeta__label">XP</span>
        <span className="bmeta__value">+{value}</span>
      </div>
    );
  }

  return (
    <div className="bmeta__item bmeta__item--xp bmeta__xp">
      {!xpEditing && (
        <button
          type="button"
          className="bmeta__xpBtn"
          onPointerDown={onDecreaseStart}
          onPointerUp={onRepeatStop}
          onPointerCancel={onRepeatStop}
          onPointerLeave={onRepeatStop}
          aria-label={`Уменьшить XP на ${xpStep}`}
        >
          <Minus />
        </button>
      )}

      <span className="bmeta__label">XP</span>

      {xpEditing ? (
        <input
          ref={inputRef}
          className="bmeta__xpInput"
          type="number"
          inputMode="numeric"
          min={TASK_RULES.pointsPerTask.min}
          max={TASK_RULES.pointsPerTask.max}
          value={value}
          onChange={e => {
            const raw = e.target.value;
            const next = raw === '' ? TASK_RULES.pointsPerTask.min : Number(raw);
            if (Number.isFinite(next)) onChange(next);
          }}
          onBlur={onStopEdit}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              (e.currentTarget as HTMLInputElement).blur();
            }
          }}
          aria-label="XP за выполнение"
        />
      ) : (
        <button
          type="button"
          className="bmeta__xpValue"
          onClick={onStartEdit}
          aria-label="Изменить XP"
          title="Клик — изменить XP"
        >
          <span className="bmeta__xpBox">
            <span
              className={clsx(
                'bmeta__xpNum',
                xpPulse === 'up' && 'bmeta__xpNum--up',
                xpPulse === 'down' && 'bmeta__xpNum--down'
              )}
            >
              +{value}
            </span>
          </span>
        </button>
      )}

      {!xpEditing && (
        <button
          type="button"
          className="bmeta__xpBtn"
          onPointerDown={onIncreaseStart}
          onPointerUp={onRepeatStop}
          onPointerCancel={onRepeatStop}
          onPointerLeave={onRepeatStop}
          aria-label={`Увеличить XP на ${xpStep}`}
        >
          <Plus />
        </button>
      )}
    </div>
  );
}
