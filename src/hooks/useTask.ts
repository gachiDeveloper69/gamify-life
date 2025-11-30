/**
 * Кастомный хук для работы с задачами (создание, удаление, изменение статуса)
 *
 * @see {@link file://./../../docs/hooks/useTasks.md Документация}
 *
 * @template - todo
 * @param - todo
 * @param - todo
 * @returns todo
 *
 * @example
 * todo
 *
 * @remarks
 * - todo
 */

import { v4 as uuidv4 } from 'uuid';

import { useLocalStorage } from './useLocalStorage';
import type {
  Task,
  CreateTaskData,
  TaskDataToValidate,
  TaskStats,
  TaskCategory,
} from '../types/task';
import { getPointsByCategory } from '../types/task';
import { useEffect, useState } from 'react';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [stats, setStats] = useLocalStorage<TaskStats>('task-stats', {
    totalPoints: 0,
    dailyPoints: 0,
    lastReset: new Date().toISOString().split('T')[0], // Дата последнего сброса daily points
  });

  const validate = ({
    title,
    category,
    deadline,
  }: TaskDataToValidate): { isValid: boolean; error?: string } => {
    const validInfo = {
      isValid: true,
    };
    function isTaskCategory(category: any): category is TaskCategory {
      return ['small', 'medium', 'large'].includes(category);
    }
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

  useEffect(() => {
    const checkDateAndReset = () => {
      const today = new Date().toISOString().split('T')[0];

      if (today !== stats.lastReset) {
        setStats(prevStats => ({
          ...prevStats,
          dailyPoints: 0,
          lastReset: today,
        }));
      }
    };
    checkDateAndReset();
    // Запускаем проверку каждую минуту
    const interval = setInterval(checkDateAndReset, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [stats.lastReset]);

  const createTask = ({ title, description, category, deadline, points }: CreateTaskData) => {
    try {
      //минимальная валидация
      const validation = validate({ title, category, deadline });
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      //создание задачки
      const newTask: Task = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        category,
        points: points ?? getPointsByCategory(category),
        createdAt: new Date(),
        deadline: deadline,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.log(`Error adding task "${title}":`, error);
      throw error;
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const updateScore = (points: number, decrease = false) => {
    try {
      const setScore = (current: number) => {
        if (decrease) {
          if (current < points) {
            return 0;
          }
          return current - points;
        }
        return current + points;
      };
      setStats(prevStats => ({
        ...prevStats,
        totalPoints: setScore(prevStats.totalPoints),
        dailyPoints: setScore(prevStats.dailyPoints),
      }));
    } catch (error) {
      console.log(`Scoring error!:`, error);
    }
  };

  return {
    createTask,
    deleteTask,
    updateScore,
  };
}
