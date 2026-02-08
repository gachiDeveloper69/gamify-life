import { useMemo, useRef } from 'react';
import { type Task } from '@/types/task';
import { type TaskCategory } from '@/types/task';
import { useScrollFade } from '@/hooks/useScrollFade';
import QuestColumn from './QuestColumn';

type QuestBoardProps = {
  quests: Task[];
  onOpenQuest: (q: Task) => void;
  onCompleteQuest: (id: string) => void;
  onCreateQuest?: (category: TaskCategory) => void;
};

export function QuestBoard({
  quests,
  onOpenQuest,
  onCompleteQuest,
  onCreateQuest,
}: QuestBoardProps) {
  const grouped = useMemo(() => {
    const by: Record<TaskCategory, Task[]> = { easy: [], medium: [], hard: [] };
    for (const q of quests) by[q.category].push(q);
    return by;
  }, [quests]);

  return (
    <>
      <section className="quest-board" aria-label="Доска заданий">
        <QuestColumn
          category="easy"
          quests={grouped.easy}
          onOpenQuest={onOpenQuest}
          onCompleteQuest={onCompleteQuest}
          onCreateQuest={onCreateQuest}
        />
        <QuestColumn
          category="medium"
          quests={grouped.medium}
          onOpenQuest={onOpenQuest}
          onCompleteQuest={onCompleteQuest}
          onCreateQuest={onCreateQuest}
        />

        <QuestColumn
          category="hard"
          quests={grouped.hard}
          onOpenQuest={onOpenQuest}
          onCompleteQuest={onCompleteQuest}
          onCreateQuest={onCreateQuest}
        />
      </section>
    </>
  );
}
