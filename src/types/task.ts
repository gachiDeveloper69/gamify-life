/**
 * @see {@link file://./../../docs/types/TaskSystem.md Документация}
 */

export type TaskCategory = 'small' | 'medium' | 'large';

export interface Task {
  id: string; // Уникальный идентификатор
  title: string; // Название задачи
  description?: string; // Описание (необязательное)
  completed: boolean; // Выполнена ли
  category: TaskCategory; // Категория
  points: number; // Очки за выполнение
  createdAt: Date; // Дата создания
  completedAt?: Date; // Дата выполнения (необязательное)
  deadline?: Date; // Дедлайн (необязательное)
}

export interface TaskStats {
  totalPoints: number; // Всего очков за всё время
  dailyPoints: number; // Очки за сегодня
  lastReset: string; // Дата последнего сброса daily points
}

// Тип для создания новой задачи (без id и дат)
export type CreateTaskData = Omit<Task, 'id' | 'createdAt' | 'completedAt'>;

export type TaskDataToValidate = Pick<CreateTaskData, 'title' | 'category' | 'deadline'>;

// Функция для автоматического определения очков по категории
export const getPointsByCategory = (category: TaskCategory): number => {
  const pointsMap: Record<TaskCategory, number> = {
    small: 5,
    medium: 10,
    large: 50,
  };
  return pointsMap[category];
};
