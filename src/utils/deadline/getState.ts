import type { DeadlineState } from '@/components/features/quest-log/QuestDeadline';

export function getState(ms: number): DeadlineState {
  if (ms <= 0) return 'overdue';
  if (ms <= 60 * 60 * 1000) return 'danger'; //<1h
  if (ms <= 24 * 60 * 60 * 1000) return 'warn'; //<1d
  return 'ok';
}
