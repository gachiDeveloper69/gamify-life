import type { TaskCategory, Task } from '@/types/task';
import { QuestCard } from './QuestCard';
import { useScrollFade } from '@/hooks/useScrollFade';
import { useRef } from 'react';
import Plus from '@/assets/icons/plus.svg?react';

// Базовые общие пропсы
type BaseQuestColumnProps = {
  quests: Task[];
  onOpenQuest: (id: string) => void;
  onToggleCompleteQuest: (questId: string) => void;
  onCreateQuest?: (category: TaskCategory) => void;
};

// Вариант с category
type CategoryColumnProps = BaseQuestColumnProps & {
  category: TaskCategory;
  title?: never;
};

// Вариант с title
type TitleColumnProps = BaseQuestColumnProps & {
  category?: never;
  title: string;
};

// Объединяем
type QuestColumnProps = CategoryColumnProps | TitleColumnProps;

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
  onToggleCompleteQuest,
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
              onClick={() => onCreateQuest(category)}
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
              onOpen={() => onOpenQuest(q.id)}
              onToggleCompleteQuest={onToggleCompleteQuest}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
