/**
 * Кастомный хук для работы с задачами (создание, удаление, изменение статуса)
 *
 * автоматически работает со stats (очки XP начисляемые за выполнение задач)
 * обрабатывает ошибки - логирование в консоль + проброс
 *
 * @see {@link file://./../../docs/hooks/useTasks.md Документация}
 *
 * @returns {{
 *   tasks: Task[];
 *   stats: TaskStats;
 *   createTask: (data: CreateTaskData) => void;
 *   deleteTask: (id: string) => void;
 *   markCompleted: (id: string) => void;
 *   markIncomplete: (id: string) => void;
 *   updateTask: (id: string, updates: Partial<TaskUpdate>) => void;
 *   updateScore: (points: number, decrease?: boolean) => void;
 * }}
 *
 * @example
 * const {
 *  createTask,
 *  deleteTask,
 *  updateScore,
 *  markCompleted,
 *  markIncomplete,
 *  updateTask
 * } = useTasks();
 *
 * createTask(taskData);
 * deleteTask(taskId)
 * markCompleted(taskId)
 * markIncomplete(taskId)
 * updateTask(id, taskData)
 *
 * @remarks
 * updateScore - вне хука использовать не рекомендуется. Нужна для работы с markCompleted/markIncomplete
 */

import { v4 as uuidv4 } from 'uuid';

import { useLocalStorage } from './useLocalStorage';
import type { Task, CreateTaskData, TaskStats } from '../types/task';
import { getPointsByCategory } from '../types/task';
import { useEffect } from 'react';
import { validate, setUpdates } from '../utils/tasks/tasksUtils';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  // const [filtered, setFiltered] = useState();
  const [stats, setStats] = useLocalStorage<TaskStats>('task-stats', {
    totalPoints: 0,
    dailyPoints: 0,
    lastReset: new Date().toISOString().split('T')[0], // Дата последнего сброса daily points
  });

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
      const validation = validate({ title, category, deadline, points });
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

  const markCompleted = (id: string) => {
    setTasks(prevTasks => {
      const score = prevTasks.find(task => task.id === id)?.points;
      if (score) {
        updateScore(score);
      }
      return prevTasks.map(task =>
        task.id === id ? { ...task, completed: true, completedAt: new Date() } : task
      );
    });
  };

  const markIncomplete = (id: string) => {
    setTasks(prevTasks => {
      const score = prevTasks.find(task => task.id === id)?.points;
      if (score) {
        updateScore(score, true);
      }
      return prevTasks.map(task =>
        task.id === id ? { ...task, completed: false, completedAt: undefined } : task
      );
    });
  };

  const updateTask = (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>>
  ) => {
    let validUpdates;
    const task = tasks.find(t => t.id === id);
    if (task?.completed && updates.category) {
      throw new Error('Нельзя менять категорию выполненной задачи');
    }
    try {
      validUpdates = setUpdates(updates);
    } catch (error) {
      const errorMessage = `Failed to update task with id "${id}"`;
      console.log(errorMessage, error);
      throw new Error(`${errorMessage}: ${error}`);
    }
    if (Object.keys(validUpdates).length > 0) {
      setTasks(prevTasks => {
        const currentTask = prevTasks.find(t => t.id === id);
        if (currentTask?.completed && updates.category) {
          // Дополнительная защита
          return prevTasks;
        }
        return prevTasks.map(task => {
          return task.id === id ? { ...task, ...validUpdates } : task;
        });
      });
    }
  };

  return {
    tasks,
    stats,
    createTask,
    deleteTask,
    updateScore,
    markCompleted,
    markIncomplete,
    updateTask,
  };
}
