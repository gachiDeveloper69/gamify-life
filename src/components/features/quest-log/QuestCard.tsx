import React from 'react';
import { useRef } from 'react';
import { type Task } from '@/types/task';
import { type TaskCategory } from '@/types/task';
import { getPointsByCategory } from '@/types/task';
import { QButton } from '@/components/ui/QButton';
import { QuestDeadline } from '@/components/features/quest-log/QuestDeadline';
import { useScrollFade } from '@/hooks/useScrollFade';

type QuestCardProps = {
  quest: Task;
  onOpen: () => void;
  onComplete: () => void;
};

const DIFF_LABEL: Record<TaskCategory, string> = {
  easy: 'ЛЕГКО',
  medium: 'СРЕДНЕ',
  hard: 'СЛОЖНО',
};

export function QuestCard({ quest, onOpen, onComplete }: QuestCardProps) {
  const descRef = useRef<HTMLDivElement | null>(null);
  useScrollFade(descRef, { offset: 5 });
  const hasDesc = Boolean(quest.description?.trim());

  const onCardClick = () => onOpen();

  const onBtnclick: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    onComplete();
  };

  return (
    <article
      className={[
        'qcard',
        `qcard--${quest.category}`,
        hasDesc ? 'qcard--with-desc' : 'qcard--no-desc',
      ].join(' ')}
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onCardClick();
      }}
      aria-label={`Открыть задание: ${quest.title}`}
    >
      <div className="qcard__indicator" aria-hidden="true">
        <span className="qcard__dot" />
      </div>
      <div className="qcard__main">
        <div className="qcard__body">
          <div className="qcard__top">
            <h3 className="qcard__title" title={quest.title}>
              {quest.title}
            </h3>
            <div className="qcard__tag-line">
              <span className="qcard__tag">{DIFF_LABEL[quest.category]}</span>
            </div>
          </div>
        </div>

        <div className="qcard__meta">
          <span className="qcard__xp">+{quest.points} XP</span>
          {quest.deadline && (
            <>
              <span className="qcard__metaSep" aria-hidden="true" />
              <QuestDeadline deadline={quest.deadline} />
            </>
          )}
          <QButton className="qbtn--primary qbtn--complete" onClick={onBtnclick}>
            <span className="qcard__complete">ВЫПОЛНИТЬ</span>
          </QButton>
        </div>
      </div>

      {hasDesc && (
        <div className="qcard__secondary">
          <div className="qcard__divider" aria-hidden="true"></div>
          <div className="qcard__descWrap">
            <p className="qcard__desc" ref={descRef}>
              {quest.description}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
