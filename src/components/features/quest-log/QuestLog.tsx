import { useMemo, useState } from 'react';

import { type Task } from '@/types/task';
import { QuestBoard } from '@/components/features/quest-log/QuestBoard';
import QuestFrame from '@/components/features/quest-log/QuestFrame';
import { QuestTabs, type TabKey } from '@/components/features/quest-log/QuestTabs';
import { QuestDetailsModal } from '@/components/features/quest-log/QuestDetailsModal';

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

const MANY_MED: Task[] = Array.from({ length: 10 }, (_, i) => ({
  id: `m-${i}`,
  title: `СРЕДНЕЕ ЗАДАНИЕ ${i + 1}`,
  category: 'medium',
  points: 10,
  createdAt: new Date(),
  completed: false,
  description: i % 3 === 0 ? 'Длинное описание. '.repeat(152) : undefined,
  deadline: i % 2 ? new Date(Date.now() + 35 * 60 * 1000) : new Date(Date.now() - 5 * 60 * 1000),
}));

const MANY_HARD: Task[] = Array.from({ length: 6 }, (_, i) => ({
  id: `h-${i}`,
  title: `СЛОЖНОЕ ЗАДАНИЕ ${i + 1}`,
  category: 'hard',
  points: 20,
  createdAt: new Date(),
  completed: false,
  description: 'Окно прибытия: 30–45 минут. Не покидай сектор контроля шлюза.',
}));
const MOCK_QUESTS = [...MANY, ...MANY_MED, ...MANY_HARD];

export function QuestLog() {
  const [tab, setTab] = useState<TabKey>('active');
  const [opened, setOpened] = useState<Task | null>(null);

  const visibleQuests = useMemo(() => {
    if (tab === 'done') return MOCK_QUESTS.filter(q => q.completed);
    return MOCK_QUESTS.filter(q => !q.completed);
  }, [tab]);

  return (
    <>
      {/* Header */}
      <main className="quest-log">
        <section className="quest-log__container container">
          <QuestFrame className="quest-log__frame">
            <div className="quest-log__content">
              <header className="quest-log__header">
                <h1 className="quest-log__title">QUEST LOG</h1>
                <button className="qbtn qbtn--primary qbtn--cta" type="button">
                  НОВАЯ МИССИЯ
                </button>
              </header>
              <QuestTabs value={tab} onChange={setTab} />
              <div className="quest-log__tabsDivider" />
              <div className="quest-log__body">
                <QuestBoard quests={visibleQuests} onOpenQuest={setOpened} />
              </div>
            </div>
          </QuestFrame>
        </section>
        <QuestDetailsModal
          quest={opened}
          onClose={() => setOpened(null)}
          onComplete={() => console.log('complete', opened?.id)}
        />
      </main>
    </>
  );
}
