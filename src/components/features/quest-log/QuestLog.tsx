import { useMemo, useState } from 'react';

import { type Task, type TaskCategory } from '@/types/task';
import { QuestBoard } from '@/components/features/quest-log/QuestBoard';
import QuestFrame from '@/components/features/quest-log/QuestFrame';
import { QuestTabs, type TabKey } from '@/components/features/quest-log/QuestTabs';
import { QuestModal } from '@/components/features/quest-log/QuestModal';
import { useTasks } from '@/hooks/useTasks';

type ModalState =
  | { mode: 'view'; quest: Task }
  | { mode: 'edit'; quest: Task }
  | { mode: 'create'; initialCategory?: TaskCategory }
  | null;

const MANY: Task[] = Array.from({ length: 18 }, (_, i) => ({
  id: `e-${i}`,
  title: i % 2 ? `ЛЕГКОЕ ЗАДАНИЕ ${i + 1}` : `ЛЕГКОЕ ЗАДАНИЕ ${i + 1} `.repeat(5),
  category: 'easy',
  points: 5,
  createdAt: new Date(),
  completed: false,
  description: i % 2 ? 'Короткое описание.' : undefined,
  deadline:
    i % 2
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 6 * 60 * 60 * 1000),
}));

export function QuestLog() {
  const { tasks, createTask, markCompleted, updateTask } = useTasks();
  const [tab, setTab] = useState<TabKey>('active');
  const [modal, setModal] = useState<ModalState>(null);

  const visibleQuests = useMemo(() => {
    if (tab === 'done') return MANY.filter(q => q.completed);
    return MANY.filter(q => !q.completed);
  }, [tab, MANY]);

  return (
    <>
      {/* Header */}
      <main className="quest-log">
        <section className="quest-log__container container">
          <QuestFrame className="quest-log__frame">
            <div className="quest-log__content">
              <header className="quest-log__header">
                <h1 className="quest-log__title">QUEST LOG</h1>
                <button
                  className="qbtn qbtn--primary qbtn--cta"
                  type="button"
                  onClick={() => setModal({ mode: 'create' })}
                >
                  НОВАЯ МИССИЯ
                </button>
              </header>
              <QuestTabs value={tab} onChange={setTab} />
              <div className="quest-log__tabsDivider" />
              <div className="quest-log__body">
                <QuestBoard
                  quests={visibleQuests}
                  onOpenQuest={q => setModal({ mode: 'view', quest: q })}
                  onCompleteQuest={markCompleted}
                  onCreateQuest={category =>
                    setModal({ mode: 'create', initialCategory: category })
                  }
                />
              </div>
            </div>
          </QuestFrame>
        </section>
        {modal && modal.mode === 'view' && (
          <QuestModal
            mode="view"
            quest={modal.quest}
            onClose={() => setModal(null)}
            onComplete={id => {
              markCompleted(id);
              setModal(null);
            }}
            onRequestEdit={quest => setModal({ mode: 'edit', quest })}
          />
        )}

        {modal && modal.mode === 'edit' && (
          <QuestModal
            mode="edit"
            quest={modal.quest}
            onClose={() => setModal(null)}
            onUpdate={(id, updates) => {
              updateTask(id, updates);
              setModal(null);
            }}
          />
        )}

        {modal && modal.mode === 'create' && (
          <QuestModal
            mode="create"
            initialCategory={modal.initialCategory}
            existingTasks={tasks}
            onClose={() => setModal(null)}
            onCreate={data => {
              createTask(data);
              setModal(null);
            }}
          />
        )}
      </main>
    </>
  );
}
