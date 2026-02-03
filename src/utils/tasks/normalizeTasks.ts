import type { Task } from '@/types/task';

export function normalizeTask(raw: any): Task {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    completedAt: raw.completedAt ? new Date(raw.completedAt) : undefined,
    deadline: raw.deadline ? new Date(raw.deadline) : undefined,
  };
}

export function normalizeTasks(raw: any): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeTask);
}
