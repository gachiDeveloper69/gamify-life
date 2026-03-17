import type { CreateTaskData, Task, TaskCategory } from '@/types/task';

export type BaseProps = {
  onClose: () => void;
};

export type ViewProps = BaseProps & {
  mode: 'view';
  quest: Task;
  onComplete: (id: string) => void;
  onRequestEdit: (id: string) => void;
};

export type EditProps = BaseProps & {
  mode: 'edit';
  quest: Task;
  onUpdate: (id: string, updates: Partial<CreateTaskData>) => void;
};

export type CreateProps = BaseProps & {
  mode: 'create';
  initialCategory?: TaskCategory;
  existingTasks: Task[];
  onCreate: (data: CreateTaskData) => void;
};

export type QuestModalProps = ViewProps | EditProps | CreateProps;

export type Draft = {
  title: string;
  description: string;
  category: TaskCategory;
  points: number;
  deadlineAt: number | null; // timestamp (ms), null = нет дедлайна
};

export type QuestModalAnimPhase = 'enter' | 'idle' | 'exit';

export type QuestModalMode = 'view' | 'edit' | 'create';
