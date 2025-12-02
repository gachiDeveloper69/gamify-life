import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('должен вернуть initialValue, если в хранилище пусто', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('должен загрузить значение из localStorage при монтировании', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('saved-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('saved-value');
  });

  it('должен сохранить значение в localStorage при вызове setValue', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('должен поддерживать функциональные обновления как useState', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 0));

    act(() => {
      result.current[1](prev => prev + 5);
    });

    expect(result.current[0]).toBe(5);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('counter', '5');
  });

  it('должен обработать битые данные в localStorage и упасть с ошибкой', () => {
    localStorageMock.getItem.mockReturnValueOnce('это не JSON {{{');

    expect(() => {
      renderHook(() => useLocalStorage('broken', 'default'));
    }).toThrow();
  });

  it('должен работать с объектами', () => {
    const initial = { name: 'John', level: 42 };
    const { result } = renderHook(() => useLocalStorage('user', initial));

    act(() => {
      result.current[1]({ ...result.current[0], level: 43 });
    });

    expect(result.current[0]).toEqual({ name: 'John', level: 43 });
    expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toEqual({
      name: 'John',
      level: 43,
    });
  });
});
