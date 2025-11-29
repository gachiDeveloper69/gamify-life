import { useLocalStorage } from './useLocalStorage';
import type { Task, CreateTaskData, TaskStats } from '../types/task';
import { getPointsByCategory } from '../types/task';
import { useEffect, useState } from 'react';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
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
}
