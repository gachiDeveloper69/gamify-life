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

export function QuestLog() {
  const { tasks, createTask, markCompleted, updateTask } = useTasks();
  const [tab, setTab] = useState<TabKey>('active');
  const [modal, setModal] = useState<ModalState>(null);

  const visibleQuests = useMemo(() => {
    if (tab === 'done') return tasks.filter(q => q.completed);
    return tasks.filter(q => !q.completed);
  }, [tab, tasks]);

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
