import { useMemo, useState } from 'react';
import { type Task } from '@/types/task';
import { type TaskCategory } from '@/types/task';
import { QuestDetailsModal } from './QuestDetailsModal';
import { QuestCard } from './QuestCard';

type QuestBoardProps = {
  quests: Task[];
};

export function QuestBoard({ quests }: QuestBoardProps) {
  const [opened, setOpened] = useState<Task | null>(null);

  const grouped = useMemo(() => {
    const by: Record<TaskCategory, Task[]> = { easy: [], medium: [], hard: [] };
    for (const q of quests) by[q.category].push(q);
    return by;
  }, [quests]);

  return (
    <>
      <section className="quest-board" aria-label="Доска заданий">
        <div className="quest-col quest-col--easy">
          <header className="quest-col__header">ЛЕГКО</header>
          <div className="quest-col__list">
            {grouped.easy.map(q => (
              <QuestCard
                key={q.id}
                quest={q}
                onOpen={() => setOpened(q)}
                onComplete={() => console.log('complete', q.id)}
              />
            ))}
          </div>
        </div>

        <div className="quest-col quest-col--medium">
          <header className="quest-col__header">СРЕДНЕ</header>
          <div className="quest-col__list">
            {grouped.medium.map(q => (
              <QuestCard
                key={q.id}
                quest={q}
                onOpen={() => setOpened(q)}
                onComplete={() => console.log('complete', q.id)}
              />
            ))}
          </div>
        </div>

        <div className="quest-col quest-col--hard">
          <header className="quest-col__header">СЛОЖНО</header>
          <div className="quest-col__list">
            {grouped.hard.map(q => (
              <QuestCard
                key={q.id}
                quest={q}
                onOpen={() => setOpened(q)}
                onComplete={() => console.log('complete', q.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <QuestDetailsModal quest={opened} onClose={() => setOpened(null)} />
    </>
  );
}
