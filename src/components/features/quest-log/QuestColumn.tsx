import type { TaskCategory, Task } from '@/types/task';
import { QuestCard } from './QuestCard';
import { useScrollFade } from '@/hooks/useScrollFade';
import { useRef } from 'react';
import Plus from '@/assets/icons/plus.svg?react';

type QuestColumnProps = {
  category?: TaskCategory;
  title?: string;
  quests: Task[];
  onOpenQuest: (q: Task) => void;
  onCompleteQuest: (id: string) => void;
  onCreateQuest?: (category: TaskCategory) => void;
};

const HEADER_BY_DIFFICULTY = {
  easy: 'ЛЕГКО',
  medium: 'СРЕДНЕ',
  hard: 'СЛОЖНО',
} satisfies Record<TaskCategory, string>;

export default function QuestColumn({
  category,
  title,
  quests,
  onOpenQuest,
  onCompleteQuest,
  onCreateQuest,
}: QuestColumnProps) {
  const colRef = useRef<HTMLDivElement | null>(null);
  useScrollFade(colRef, { offset: 60 });
  const headerText = category ? HEADER_BY_DIFFICULTY[category] : title;
  return (
    <div className={`quest-col ${category ? `quest-col--${category}` : ''}`}>
      {(category || title) && (
        <header className="quest-col__header">
          {headerText}

          {category && onCreateQuest && (
            <button
              className="quest-col__add"
              type="button"
              onClick={() => onCreateQuest?.(category)}
              aria-label="Добавить миссию"
              title="Новая миссия"
            >
              <Plus />
            </button>
          )}
        </header>
      )}
      <div className="quest-col__list" ref={colRef}>
        <div className="quest-col__inner">
          {quests.map(q => (
            <QuestCard
              key={q.id}
              quest={q}
              onOpen={() => onOpenQuest(q)}
              onComplete={() => onCompleteQuest(q.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
