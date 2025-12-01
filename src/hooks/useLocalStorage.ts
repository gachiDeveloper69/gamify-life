/**
 * Кастомный хук для работы с localStorage как с состоянием React
 *
 * @see {@link file://./../../docs/hooks/useLocalStorage.md Документация}
 *
 * @template T - тип хранимого значения
 * @param key - ключ для localStorage
 * @param initialValue - начальное значение
 * @returns кортеж [значение, функция установки]
 *
 * @example
 * const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
 *
 * @remarks
 * - Автоматически синхронизируется с localStorage
 * - Поддерживает функциональные обновления как useState
 * - Обрабатывает ошибки парсинга
 */

import { useState, useEffect } from 'react';

//Дженерик-функция для работы с любым типом данных
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  //инициализация из хранилища при монтировании
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      throw error;
    }
  }, [key]);

  //Обертка для setStoredValue которая сохраняет в localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      //позволяет value быть функцией как useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(`Error setting localStorage key "${key}}":`, error);
      throw error;
    }
  };

  return [storedValue, setValue] as const;
}
