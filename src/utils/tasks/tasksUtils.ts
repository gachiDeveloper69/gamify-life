import type { Task, TaskDataToValidate, TaskCategory } from '../../types/task';

/**
 * Проверяет, является ли значение валидной категорией задачи
 * @param category - проверяемое значение
 * @returns {category is TaskCategory} type guard
 */
export function isTaskCategory(category: any): category is TaskCategory {
  return ['small', 'medium', 'large'].includes(category);
}

/**
 * Валидирует данные для создания задачи
 * @param data - данные для валидации
 * @returns объект с результатом валидации
 */
export const validate = ({
  title,
  category,
  deadline,
}: TaskDataToValidate): { isValid: boolean; error?: string } => {
  const validInfo = {
    isValid: true,
  };

  if (!title || title.trim() === '') {
    return {
      isValid: false,
      error: 'Название задачи не может быть пустым',
    };
  }
  if (!category || !isTaskCategory(category)) {
    return {
      isValid: false,
      error: !category ? 'Категория задачи обязательна' : 'Неизвестная категория задачи',
    };
  }

  // Проверка дедлайна
  if (deadline && deadline < new Date()) {
    return {
      isValid: false,
      error: 'Дедлайн не может быть в прошлом',
    };
  }

  return validInfo;
};

/**
 * Валидирует и заполняет данные для обновления задачи
 * @param updates - данные для валидации
 * @returns объект с валидными свойствами
 */
export const setUpdates = (
  updates: Partial<Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>>
) => {
  let setOfUpdates = {};

  if (updates.title && updates.title.trim() !== '') {
    const title = updates.title;
    setOfUpdates = { ...setOfUpdates, title };
  }

  if (updates.description) {
    const description = updates.description;
    setOfUpdates = { ...setOfUpdates, description };
  }

  if (updates.category && isTaskCategory(updates.category)) {
    const category = updates.category;
    setOfUpdates = { ...setOfUpdates, category };
  }

  if (updates.points && updates.points > 0) {
    const points = updates.points;
    setOfUpdates = { ...setOfUpdates, points };
  }

  if ('deadline' in updates) {
    if (updates.deadline === undefined || updates.deadline > new Date()) {
      const deadline = updates.deadline;
      setOfUpdates = { ...setOfUpdates, deadline };
    }
  }
  return setOfUpdates;
};
