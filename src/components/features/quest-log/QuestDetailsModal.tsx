import React, { useEffect } from 'react';
import { type Task } from '@/types/task';

import Stripe from '@/assets/icons/stripe-hard-2.svg?react';

type Props = {
  quest: Task | null;
  onClose: () => void;
};

export function QuestDetailsModal({ quest, onClose }: Props) {
  useEffect(() => {
    if (!quest) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quest, onClose]);

  if (!quest) return null;

  return (
    <div
      className="qmodal"
      role="dialog"
      aria-modal="true"
      aria-label={`Детали задания: ${quest.title}`}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="qmodal__panel">
        <div className="qmodal__chrome" aria-hidden="true" />
        <div className="qmodal__grid" aria-hidden="true" />
        <button className="qmodal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        <div className="qmodal__head">
          <h2 className="qmodal__title">БРИФИНГ МИССИИ</h2>
          <div className="qmodal__right">
            <span className="qmodal__xp">+{quest.points} XP</span>
          </div>
        </div>

        <div className="qmodal__divider" aria-hidden="true" />

        <div className="qmodal__content">
          <div className="qbrief__header">
            <div className={`qbrief__chevron qbrief__chevron--${quest.category}`}>
              <Stripe className="qbrief__icon" />
            </div>
          </div>
          {quest.description ? (
            <p className="qmodal__desc">{quest.description}</p>
          ) : (
            <p className="qmodal__desc qmodal__desc--muted">Описание отсутствует</p>
          )}
        </div>

        <div className="qmodal__actions">
          <button
            className="qbtn qbtn--primary"
            type="button"
            onClick={() => console.log('complete', quest.id)}
          >
            ВЫПОЛНИТЬ
          </button>
        </div>
      </div>
    </div>
  );
}
