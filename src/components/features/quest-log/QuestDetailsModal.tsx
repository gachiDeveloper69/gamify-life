import React, { useEffect } from 'react';
import { type Task } from '@/types/task';

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
        <button className="qmodal__close" type="button" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        <div className="qmodal__head">
          <h2 className="qmodal__title">{quest.title}</h2>
          <div className="qmodal__right">
            <span className="qmodal__xp">+{quest.points} XP</span>
          </div>
        </div>

        <div className="qmodal__divider" aria-hidden="true" />

        <div className="qmodal__content">
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
