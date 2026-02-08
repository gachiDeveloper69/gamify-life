import type { TaskCategory } from '@/types/common';

export const TASK_RULES = {
  title: {
    min: 1,
    max: 48,
  },
  description: {
    max: 600,
  },
  pointsPerTask: {
    min: 1,
    max: 300,
  },
  defaultPointsByCategory: {
    easy: 5,
    medium: 10,
    hard: 50,
  } satisfies Record<TaskCategory, number>,
} as const;

export type TaskRules = typeof TASK_RULES;
