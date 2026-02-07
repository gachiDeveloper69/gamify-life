import React, { useEffect, useRef, useState } from 'react';
import {
  getPointsByCategory,
  type CreateTaskData,
  type Task,
  type TaskCategory,
} from '@/types/task';
import { generateNewQuestName } from '@/utils/tasks/generateNewQuestName';
import { QButton } from '@/components/ui/QButton';

import StripeLight from '@/assets/icons/stripe-2.svg?react';
import StripeMedium from '@/assets/icons/stripe-medium.svg?react';
import StripeHard from '@/assets/icons/stripe-hard-2.svg?react';
import { QuestModalActions } from './QuestModalActions';
import { QuestDeadline } from '@/components/features/quest-log/QuestDeadline';
import { useScrollFade } from '@/hooks/useScrollFade';

type BaseProps = {
  onClose: () => void;
};

type ViewProps = BaseProps & {
  mode: 'view';
  quest: Task;
  onComplete: (id: string) => void;
  onRequestEdit: (quest: Task) => void;
};

type EditProps = BaseProps & {
  mode: 'edit';
  quest: Task;
  onUpdate: (id: string, updates: Partial<CreateTaskData>) => void;
};

type CreateProps = BaseProps & {
  mode: 'create';
  initialCategory?: TaskCategory;
  existingTasks: Task[];
  onCreate: (data: CreateTaskData) => void;
};

type QuestModalProps = ViewProps | EditProps | CreateProps;

type Draft = {
  title: string;
  description: string;
  category: TaskCategory;
  points: number;
  deadlineAt: number | null; // timestamp (ms), null = нет дедлайна
};

type QuestModalMode = 'view' | 'edit' | 'create';

const STRIPE_BY_DIFFICULTY = {
  easy: StripeLight,
  medium: StripeMedium,
  hard: StripeHard,
} as const;

export function QuestModal(props: QuestModalProps) {
  const [actionsOpen, setActionsOpen] = useState(false);

  const [pointsTouched, setPointsTouched] = useState(false);

  const [draft, setDraft] = useState<Draft>(() => {
    if (props.mode === 'edit' || props.mode === 'view') {
      const q = props.quest;
      return {
        title: q.title,
        description: q.description ?? '',
        category: q.category,
        points: q.points,
        deadlineAt: q.deadline ? q.deadline.getTime() : null,
      };
    }

    //create mode
    const category = props.initialCategory ?? 'easy';

    return {
      title: generateNewQuestName(props.existingTasks),
      description: '',
      category,
      points: getPointsByCategory(category),
      deadlineAt: null,
    };
  });

  const viewModel =
    props.mode === 'view'
      ? props.quest
      : {
          id: props.mode === 'edit' ? props.quest.id : 'draft',
          title: draft.title,
          description: draft.description,
          category: draft.category,
          points: draft.points,
          deadline: draft.deadlineAt ? new Date(draft.deadlineAt) : undefined,
          completed: props.mode === 'edit' ? props.quest.completed : false,
          createdAt: props.mode === 'edit' ? props.quest.createdAt : new Date(),
        };

  const StripeIcon = STRIPE_BY_DIFFICULTY[viewModel.category || 'easy'];
  const fadeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useScrollFade(fadeRef, scrollRef, { offset: 10 }, [viewModel.id]);

  // const onBtnclick: React.MouseEventHandler<HTMLButtonElement> = e => {
  //   e.stopPropagation();
  //   props.onComplete(viewModel.id);
  // };

  const onPrimaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (props.mode === 'view') {
      props.onComplete(props.quest.id);
    }

    // if (props.mode === 'edit') {
    //   props.onUpdate(props.quest.id, buildCreateTaskData(draft));
    // }

    // if (props.mode === 'create') {
    //   props.onCreate(buildCreateTaskData(draft));
    // }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [props.onClose]);

  useEffect(() => {
    if (props.mode === 'edit' || props.mode === 'view') {
      const q = props.quest;
      setDraft({
        title: q.title,
        description: q.description ?? '',
        category: q.category,
        points: q.points,
        deadlineAt: q.deadline ? q.deadline.getTime() : null,
      });
      setPointsTouched(false);
    }
  }, [props.mode, props.mode === 'create' ? undefined : props.quest.id]);

  useEffect(() => {
    // при смене квеста закрываем панель, чтобы не было "протекания"
    setActionsOpen(false);
  }, [viewModel.id]);

  return (
    <div
      className="qmodal"
      role="dialog"
      aria-modal="true"
      aria-label={`Детали задания: ${viewModel.title}`}
      onMouseDown={e => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div className="qmodal__panel">
        <div className="qmodal__chrome" aria-hidden="true" />
        <div className="qmodal__grid" aria-hidden="true" />
        <button
          className="qmodal__close"
          type="button"
          onClick={props.onClose}
          aria-label="Закрыть"
        >
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
                <div className={`qchev__chevron qchev__chevron--${viewModel.category}`}>
                  <span className="qchev__frame" aria-hidden="true" />
                  <StripeIcon className="qchev__icon" />
                </div>
              </div>

              <div className="briefing__details">
                {/* ЛЕЙБЛЫ */}
                <div className={`briefing__line briefing__line--${viewModel.category}`}>
                  <span className={`briefing__label briefing__label--${viewModel.category}`}>
                    {viewModel.category.toUpperCase()}
                  </span>
                </div>

                {/* НАЗВАНИЕ МИССИИ */}
                <h3 className="briefing__mission-title" title={viewModel.title}>
                  {viewModel.title}
                </h3>

                {/* МЕТАДАННЫЕ */}
                <div className="briefing__meta">
                  {viewModel.deadline && (
                    <div className="bmeta__item">
                      <QuestDeadline deadline={viewModel.deadline} />
                    </div>
                  )}
                  <div className="bmeta__item bmeta__item--xp">
                    <span className="bmeta__label">XP</span>
                    <span className="bmeta__value">+{viewModel.points}</span>
                  </div>
                </div>
              </div>
            </div>

            {viewModel.description ? (
              <div className="briefing__body" ref={fadeRef}>
                <div className="briefing__scroll" ref={scrollRef}>
                  <p className="briefing__desc">{viewModel.description}</p>
                </div>
              </div>
            ) : (
              <div className="briefing__body briefing__body--empty">
                <p className="briefing__desc briefing__desc--muted">Описание отсутствует</p>
              </div>
            )}
          </div>
        </div>

        {props.mode === 'view' && (
          <div className="qmodal__actions">
            {/* LEFT: sliding actions */}
            <QuestModalActions
              isOpen={actionsOpen}
              onToggle={() => setActionsOpen(v => !v)}
              onEdit={() => props.onRequestEdit(props.quest)}
              onPinToggle={() => console.log('pin')}
              onClone={() => console.log('clone')}
              onArchiveToggle={() => console.log('archive')}
              onDelete={() => console.log('delete')}
              isPinned={false}
              isArchived={false}
            />
            <QButton className="qbtn--primary qbtn--complete" onClick={onPrimaryClick}>
              <span className="qcard__complete">ВЫПОЛНИТЬ</span>
            </QButton>
          </div>
        )}
      </div>
    </div>
  );
}
