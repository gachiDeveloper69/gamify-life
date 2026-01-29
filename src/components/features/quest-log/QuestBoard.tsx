import { useMemo, useRef } from 'react';
import { type Task } from '@/types/task';
import { type TaskCategory } from '@/types/task';
import { QuestCard } from './QuestCard';
import { useScrollFade } from '@/hooks/useScrollFade';

type QuestBoardProps = {
  quests: Task[];
  onOpenQuest: (q: Task) => void;
};

export function QuestBoard({ quests, onOpenQuest }: QuestBoardProps) {
  const easyRef = useRef<HTMLDivElement | null>(null);
  const mediumRef = useRef<HTMLDivElement | null>(null);
  const hardRef = useRef<HTMLDivElement | null>(null);

  useScrollFade(easyRef, { offset: 60 });
  useScrollFade(mediumRef, { offset: 60 });
  useScrollFade(hardRef, { offset: 60 });

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
          <div className="quest-col__list" ref={easyRef}>
            <div className="quest-col__inner">
              {grouped.easy.map(q => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onOpen={() => onOpenQuest(q)}
                  onComplete={() => console.log('complete', q.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="quest-col quest-col--medium">
          <header className="quest-col__header">СРЕДНЕ</header>
          <div className="quest-col__list" ref={mediumRef}>
            <div className="quest-col__inner">
              {grouped.medium.map(q => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onOpen={() => onOpenQuest(q)}
                  onComplete={() => console.log('complete', q.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="quest-col quest-col--hard">
          <header className="quest-col__header">СЛОЖНО</header>
          <div className="quest-col__list" ref={hardRef}>
            <div className="quest-col__inner">
              {grouped.hard.map(q => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onOpen={() => onOpenQuest(q)}
                  onComplete={() => console.log('complete', q.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
