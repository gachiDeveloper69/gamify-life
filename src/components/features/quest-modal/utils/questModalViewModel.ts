import type { Task } from '@/types/task';
import type { Draft, QuestModalMode, QuestModalProps } from '../types';

type QuestModalViewModel =
  | Task
  | (Draft & { id: string; completed: boolean; createdAt: Date; deadline?: Date });

export function buildQuestModalViewModel(
  props: QuestModalProps,
  draft: Draft
): QuestModalViewModel {
  if (props.mode === 'view') {
    return props.quest;
  }

  return {
    id: props.mode === 'edit' ? props.quest.id : 'draft',
    title: draft.title,
    description: draft.description,
    category: draft.category,
    points: draft.points,
    deadline: draft.deadlineAt ? new Date(draft.deadlineAt) : undefined,
    completed: props.mode === 'edit' ? props.quest.completed : false,
    createdAt: props.mode === 'edit' ? props.quest.createdAt : new Date(),
  };
}

export function getQuestModalPrimaryLabel(mode: QuestModalMode) {
  if (mode === 'view') return 'ВЫПОЛНИТЬ';
  if (mode === 'edit') return 'СОХРАНИТЬ';
  return 'ПРИНЯТЬ';
}
