import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { getPointsByCategory } from '@/types/task';
import { TASK_RULES } from '@/config/taskRules';
import { QButton } from '@/components/ui/QButton';

import { QuestModalActions } from './QuestModalActions';
import { QuestDeadline } from '@/components/features/quest-log/QuestDeadline';
import { QuestDeadlineStepper } from '@/components/features/quest-log/QuestDeadlineStepper';
import { useScrollFade } from '@/hooks/useScrollFade';
import { rotateCategory } from '@/utils/tasks/rotateCategory';

import type { QuestModalProps } from './types';
import { draftToCreateTaskData } from './utils/questModalDraft';
import { QuestXpControl } from './QuestXpControl';
import { useQuestXpEditor } from './hooks/useQuestXpEditor';
import { useQuestModalClose } from './hooks/useQuestModalClose';
import { useQuestDraft } from './hooks/useQuestDraft';
import { QuestDifficultyControl } from './QuestDifficultyControl';
import { QuestDescriptionSection } from './QuestDescriptionSection';

// NEW: вынесли вычисление viewModel и primaryLabel в утилиты
import { buildQuestModalViewModel, getQuestModalPrimaryLabel } from './utils/questModalViewModel';

// NEW: вынесли фокус title input в отдельный хук
import { useQuestTitleFocus } from './hooks/useQuestTitleFocus';

export function QuestModal(props: QuestModalProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { phase, requestClose } = useQuestModalClose(props.onClose);
  const { draft, setDraft, pointsTouched, setPointsTouched } = useQuestDraft(props);

  // CHANGED: titleRef теперь приходит из useQuestTitleFocus
  const { titleRef } = useQuestTitleFocus(props);

  // CHANGED: viewModel теперь собирается отдельной утилитой
  const viewModel = buildQuestModalViewModel(props, draft);

  const fadeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useScrollFade(fadeRef, scrollRef, { offset: 10 }, [viewModel.id]);

  const canEdit = props.mode !== 'view' && !viewModel.completed;

  const rotateDifficulty = (dir: 1 | -1) => {
    if (!canEdit) return;

    setAnimating(true);

    setDraft(prev => {
      const next = rotateCategory(prev.category, dir);
      return {
        ...prev,
        category: next,
        points: pointsTouched ? prev.points : getPointsByCategory(next),
      };
    });

    window.setTimeout(() => setAnimating(false), 160);
  };

  // CHANGED: primaryLabel теперь тоже приходит из утилиты
  const primaryLabel = getQuestModalPrimaryLabel(props.mode);

  const isTitleValid = draft.title.trim().length > 0;

  const onPrimaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (props.mode === 'view') {
      props.onComplete(props.quest.id);
      return;
    }

    const data = draftToCreateTaskData(draft);

    if (props.mode === 'create') {
      props.onCreate(data);
      return;
    }

    if (props.mode === 'edit') {
      props.onUpdate(props.quest.id, data);
    }
  };

  useEffect(() => {
    setActionsOpen(false);
  }, [viewModel.id]);

  /*====XP====*/
  const {
    xpStep,
    xpEditing,
    xpPulse,
    xpInputRef,
    setXpEditing,
    setPoints,
    startRepeat,
    stopRepeat,
  } = useQuestXpEditor({
    value: draft.points,
    min: TASK_RULES.pointsPerTask.min,
    max: TASK_RULES.pointsPerTask.max,
    step: 5,
    onTouch: () => setPointsTouched(true),
    onChange: next => setDraft(prev => ({ ...prev, points: next })),
  });
  /*====XP====*/

  return (
    <div
      className={clsx('qmodal', `qmodal--${phase}`)}
      role="dialog"
      aria-modal="true"
      aria-label={`Детали задания: ${viewModel.title}`}
      onMouseDown={e => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div className="qmodal__panel">
        <div className="qmodal__chrome" aria-hidden="true" />
        <div className="qmodal__grid" aria-hidden="true" />
        <div className="qmodal__scan" aria-hidden="true" />
        <button className="qmodal__close" type="button" onClick={requestClose} aria-label="Закрыть">
          ✕
        </button>
        <div className="qmodal__head">
          <h2 className="qmodal__title">БРИФИНГ МИССИИ</h2>
        </div>

        <div className="qmodal__divider" aria-hidden="true" />

        <div className="qmodal__content">
          <div className="briefing">
            <div className="briefing__header">
              <QuestDifficultyControl
                category={viewModel.category}
                canEdit={canEdit}
                animating={animating}
                onRotate={rotateDifficulty}
              />

              <div className="briefing__details">
                <div className={`briefing__line briefing__line--${viewModel.category}`}>
                  <span className={`briefing__label briefing__label--${viewModel.category}`}>
                    {viewModel.category.toUpperCase()}
                  </span>
                </div>

                {props.mode === 'view' ? (
                  <h3 className="briefing__mission-title" title={viewModel.title}>
                    {viewModel.title}
                  </h3>
                ) : (
                  <input
                    className="briefing__mission-title briefing__mission-title--input"
                    value={draft.title}
                    onChange={e => setDraft(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Название миссии"
                    aria-label="Название миссии"
                    ref={titleRef}
                    maxLength={TASK_RULES.title.max}
                  />
                )}

                <div className="briefing__meta">
                  {props.mode === 'view' ? (
                    viewModel.deadline && (
                      <div className="bmeta__item">
                        <QuestDeadline deadline={viewModel.deadline} />
                      </div>
                    )
                  ) : (
                    <QuestDeadlineStepper
                      value={draft.deadlineAt}
                      onChange={next => setDraft(prev => ({ ...prev, deadlineAt: next }))}
                      disabled={!canEdit}
                      defaultDurationMs={0}
                    />
                  )}

                  <QuestXpControl
                    canEdit={canEdit}
                    xpEditing={xpEditing}
                    xpPulse={xpPulse}
                    value={canEdit ? draft.points : viewModel.points}
                    xpStep={xpStep}
                    inputRef={xpInputRef}
                    onStartEdit={() => setXpEditing(true)}
                    onStopEdit={() => setXpEditing(false)}
                    onChange={setPoints}
                    onDecreaseStart={() => startRepeat(-xpStep)}
                    onIncreaseStart={() => startRepeat(xpStep)}
                    onRepeatStop={stopRepeat}
                  />
                </div>
              </div>
            </div>

            <QuestDescriptionSection
              mode={props.mode}
              description={
                props.mode === 'view' ? (viewModel.description ?? '') : draft.description
              }
              fadeRef={fadeRef}
              scrollRef={scrollRef}
              onChange={value => setDraft(prev => ({ ...prev, description: value }))}
            />
          </div>
        </div>

        <div className="qmodal__actions">
          {props.mode === 'view' && (
            <QuestModalActions
              isOpen={actionsOpen}
              onToggle={() => setActionsOpen(v => !v)}
              onEdit={() => props.onRequestEdit(props.quest.id)}
              onPinToggle={() => console.log('pin')}
              onClone={() => console.log('clone')}
              onArchiveToggle={() => console.log('archive')}
              onDelete={() => console.log('delete')}
              isPinned={false}
              isArchived={false}
            />
          )}

          <QButton
            className="qbtn--primary qbtn--complete"
            onClick={onPrimaryClick}
            disabled={props.mode !== 'view' && !isTitleValid}
          >
            <span className="qcard__complete">{primaryLabel}</span>
          </QButton>
        </div>
      </div>
    </div>
  );
}
