import React, { useEffect, useRef, useState } from 'react';
import { type Task } from '@/types/task';
import { QButton } from '@/components/ui/QButton';

import StripeLight from '@/assets/icons/stripe-2.svg?react';
import StripeMedium from '@/assets/icons/stripe-medium.svg?react';
import StripeHard from '@/assets/icons/stripe-hard-2.svg?react';
import { QuestModalActions } from './QuestModalActions';
import { QuestDeadline } from '@/components/features/quest-log/QuestDeadline';
import { useScrollFade } from '@/hooks/useScrollFade';

type Props = {
  quest: Task | null;
  onClose: () => void;
  onComplete: () => void;
};

const STRIPE_BY_DIFFICULTY = {
  easy: StripeLight,
  medium: StripeMedium,
  hard: StripeHard,
} as const;

export function QuestDetailsModal({ quest, onClose, onComplete }: Props) {
  const StripeIcon = STRIPE_BY_DIFFICULTY[quest?.category || 'easy'];
  const [actionsOpen, setActionsOpen] = useState(false);

  const fadeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useScrollFade(fadeRef, scrollRef, { offset: 10 }, [quest?.id]);

  const onBtnclick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    onComplete();
  };

  useEffect(() => {
    if (!quest) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quest, onClose]);

  useEffect(() => {
    if (!quest) return;
    // при смене квеста закрываем панель, чтобы не было "протекания"
    setActionsOpen(false);
  }, [quest?.id]);

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
        </div>

        <div className="qmodal__divider" aria-hidden="true" />

        <div className="qmodal__content">
          <div className="briefing">
            <div className="briefing__header">
              <div className="briefing__difficulty">
                <div className={`qchev__chevron qchev__chevron--${quest.category}`}>
                  <span className="qchev__frame" aria-hidden="true" />
                  <StripeIcon className="qchev__icon" />
                </div>
              </div>

              <div className="briefing__details">
                {/* ЛЕЙБЛЫ */}
                <div className={`briefing__line briefing__line--${quest.category}`}>
                  <span className={`briefing__label briefing__label--${quest.category}`}>
                    {quest.category.toUpperCase()}
                  </span>
                </div>

                {/* НАЗВАНИЕ МИССИИ */}
                <h3 className="briefing__mission-title" title={quest.title}>
                  {quest.title}
                </h3>

                {/* МЕТАДАННЫЕ */}
                <div className="briefing__meta">
                  {quest.deadline && (
                    <div className="bmeta__item">
                      <QuestDeadline deadline={quest.deadline} />
                    </div>
                  )}
                  <div className="bmeta__item bmeta__item--xp">
                    <span className="bmeta__label">XP</span>
                    <span className="bmeta__value">+{quest.points}</span>
                  </div>
                </div>
              </div>
            </div>

            {quest.description ? (
              <div className="briefing__body" ref={fadeRef}>
                <div className="briefing__scroll" ref={scrollRef}>
                  <p className="briefing__desc">{quest.description}</p>
                </div>
              </div>
            ) : (
              <div className="briefing__body briefing__body--empty">
                <p className="briefing__desc briefing__desc--muted">Описание отсутствует</p>
              </div>
            )}
          </div>
        </div>

        <div className="qmodal__actions">
          {/* LEFT: sliding actions */}
          <QuestModalActions
            isOpen={actionsOpen}
            onToggle={() => setActionsOpen}
            onEdit={() => console.log('edit')}
            onPinToggle={() => console.log('pin')}
            onClone={() => console.log('clone')}
            onArchiveToggle={() => console.log('archive')}
            onDelete={() => console.log('delete')}
            isPinned={false}
            isArchived={false}
          />
          <QButton className="qbtn--primary qbtn--complete" onClick={onBtnclick}>
            <span className="qcard__complete">ВЫПОЛНИТЬ</span>
          </QButton>
        </div>
      </div>
    </div>
  );
}
