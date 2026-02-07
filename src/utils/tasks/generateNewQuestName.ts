import type { Task } from '@/types/task';

export const generateNewQuestName = (tasks: Task[], language: 'ru' | 'en' = 'ru'): string => {
  const literals = {
    ru: 'Новое задание',
    en: 'New task',
  };
  //отбираем только названия "новое задание <номер>"
  const pattern = /^(новое задание|new task)\s*\d+$/iu;
  const currentLiteral = literals[language];

  // Фильтруем задачи ТОЛЬКО с префиксом текущего языка
  const newQuests = tasks.filter(task => {
    if (!pattern.test(task.title.toLowerCase())) return false;

    // Проверяем, начинается ли с нужного префикса (без учета регистра)
    const lowerTitle = task.title.toLowerCase();
    const lowerLiteral = currentLiteral.toLowerCase();
    return lowerTitle.startsWith(lowerLiteral);
  });

  // Извлекаем номера
  const numbers = newQuests
    .map(quest => {
      const match = quest.title.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .sort((a, b) => a - b); // Сортируем по возрастанию

  // Если массив пустой - возвращаем 1
  if (numbers.length === 0) {
    return `${currentLiteral} 1`;
  }

  // Если первый элемент не 1 - возвращаем 1
  if (numbers[0] > 1) {
    return `${currentLiteral} 1`;
  }

  // Ищем дыру в массиве
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i + 1] - numbers[i] > 1) {
      return `${currentLiteral} ${numbers[i] + 1}`;
    }
  }

  // Если дыр нет - берем последний + 1
  const last = numbers[numbers.length - 1];
  return `${currentLiteral} ${last + 1}`;
};
