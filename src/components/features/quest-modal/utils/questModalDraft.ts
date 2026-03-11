import {
  getPointsByCategory,
  type CreateTaskData,
  type Task,
  type TaskCategory,
} from '@/types/task';
import { generateNewQuestName } from '@/utils/tasks/generateNewQuestName';
import type { Draft } from '../types';

export function createDraftFromQuest(quest: Task): Draft {
  return {
    title: quest.title,
    description: quest.description ?? '',
    category: quest.category,
    points: quest.points,
    deadlineAt: quest.deadline ? quest.deadline.getTime() : null,
  };
}

export function createInitialDraft(
  existingTasks: Task[],
  initialCategory: TaskCategory = 'easy'
): Draft {
  return {
    title: generateNewQuestName(existingTasks),
    description: '',
    category: initialCategory,
    points: getPointsByCategory(initialCategory),
    deadlineAt: null,
  };
}

export function draftToCreateTaskData(draft: Draft): CreateTaskData {
  const title = draft.title.trim();
  const desc = draft.description.trim();

  return {
    title,
    description: desc ? desc : undefined,
    category: draft.category,
    deadline: draft.deadlineAt ? new Date(draft.deadlineAt) : undefined,
    points: draft.points,
  };
}
