import { useEffect, useMemo, useState } from 'react';
import type { Draft, QuestModalProps } from '../types';
import { createDraftFromQuest, createInitialDraft } from '../utils/questModalDraft';

export function useQuestDraft(props: QuestModalProps) {
  const [pointsTouched, setPointsTouched] = useState(false);

  // Считаем "ключ" источника draft, чтобы корректно пересобирать состояние
  // при смене режима / конкретного квеста.
  const draftSourceKey =
    props.mode === 'create' ? 'create:draft' : `${props.mode}:${props.quest.id}`;

  // Начальный/текущий draft вынесен в memo, чтобы одна и та же логика
  // не дублировалась в useState и useEffect.
  const resolvedDraft = useMemo<Draft>(() => {
    if (props.mode === 'edit' || props.mode === 'view') {
      return createDraftFromQuest(props.quest);
    }

    return createInitialDraft(props.existingTasks, props.initialCategory ?? 'easy');
  }, [
    draftSourceKey,
    props.mode === 'create' ? props.initialCategory : undefined,
    props.mode === 'create' ? props.existingTasks : undefined,
  ]);

  const [draft, setDraft] = useState<Draft>(resolvedDraft);

  useEffect(() => {
    setDraft(resolvedDraft);
    setPointsTouched(false);
  }, [resolvedDraft]);

  return {
    draft,
    setDraft,
    pointsTouched,
    setPointsTouched,
  };
}
