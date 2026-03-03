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

import { useCallback, useEffect, useRef, useState } from 'react';

type Reviver<T> = (value: unknown) => T;

export function useLocalStorage<T>(key: string, initialValue: T, revive?: Reviver<T>) {
  const reviveRef = useRef(revive);
  reviveRef.current = revive;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);
      return reviveRef.current ? reviveRef.current(parsed) : parsed;
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // если key поменялся — перечитать
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        setStoredValue(initialValue);
        return;
      }
      const parsed = JSON.parse(item);
      setStoredValue(reviveRef.current ? reviveRef.current(parsed) : parsed);
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key]);

  // запись при изменении значения
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => (value instanceof Function ? value(prev) : value));
  }, []);

  return [storedValue, setValue] as const;
}
