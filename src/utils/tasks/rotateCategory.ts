import type { TaskCategory } from '@/types/common';

const TASK_CATEGORIES = ['easy', 'medium', 'hard'] as const satisfies TaskCategory[];

export function rotateCategory(current: TaskCategory, dir: 1 | -1): TaskCategory {
  const i = TASK_CATEGORIES.indexOf(current);
  const next = (i + dir + TASK_CATEGORIES.length) % TASK_CATEGORIES.length;
  return TASK_CATEGORIES[next];
}
