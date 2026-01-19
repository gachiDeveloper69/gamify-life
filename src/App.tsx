import { useState } from 'react';
import { useTasks } from './hooks/useTask';
import { type Task } from '@/types/task';
import { QuestBoard } from '@/components/features/quest-log/QuestBoard';
import QuestFrame from '@/components/features/quest-log/QuestFrame';
import { QuestTabs } from './components/features/quest-log/QuestTabs';

/*
const MOCK_QUESTS: Task[] = [
  {
    id: 'q1',
    title: 'ОЧИСТИТЬ СКЛАДСКОЙ ОТСЕК И ОЧИСТИТЬ СКЛАДСКОЙ ОТСЕК',
    category: 'easy',
    points: 5,
    description:
      'Техник уже выдвинулся. Подготовь точку доступа и проверь маяк. Окно прибытия: 30–45 минут. Не покидай сектор контроля шлюза. Окно прибытия: 30–45 минут. Не покидай сектор контроля шлюза.',
    createdAt: new Date('2025-01-01T08:00:00'),
    completed: false,
  },
  {
    id: 'q2',
    title: 'ОБНОВИТЬ ПРОТОКОЛЫ СВЯЗИ',
    category: 'easy',
    points: 5,
    createdAt: new Date('2025-01-01T08:10:00'),
    completed: false,
  },
  {
    id: 'q3',
    title: 'ДОЖДАТЬСЯ ТЕХНИКА',
    category: 'medium',
    points: 10,
    createdAt: new Date('2025-01-01T08:10:00'),
    completed: false,
    description: 'Окно прибытия: 30–45 минут. Не покидай сектор контроля шлюза.',
  },
  {
    id: 'q4',
    title: 'ЭКСТРАКТИРОВАТЬ ЧЁРНЫЙ ЯЩИК',
    category: 'hard',
    points: 20,
    createdAt: new Date('2025-01-01T08:10:00'),
    completed: false,
    description: 'Окно прибытия: 30–45 минут. Не покидай сектор контроля шлюза.',
  },
];
*/
const MANY: Task[] = Array.from({ length: 18 }, (_, i) => ({
  id: `e-${i}`,
  title: i % 2 ? `ЛЕГКОЕ ЗАДАНИЕ ${i + 1}` : `ЛЕГКОЕ ЗАДАНИЕ ${i + 1} `.repeat(5),
  category: 'easy',
  points: 5,
  createdAt: new Date(),
  completed: false,
  description: i % 2 ? 'Короткое описание.' : undefined,
  deadline:
    i % 2
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 6 * 60 * 60 * 1000),
}));

const MANY_MED: Task[] = Array.from({ length: 10 }, (_, i) => ({
  id: `m-${i}`,
  title: `СРЕДНЕЕ ЗАДАНИЕ ${i + 1}`,
  category: 'medium',
  points: 10,
  createdAt: new Date(),
  completed: false,
  description: i % 3 === 0 ? 'Длинное описание. '.repeat(12) : undefined,
  deadline: i % 2 ? new Date(Date.now() + 35 * 60 * 1000) : new Date(Date.now() - 5 * 60 * 1000),
}));

const MANY_HARD: Task[] = Array.from({ length: 6 }, (_, i) => ({
  id: `h-${i}`,
  title: `СЛОЖНОЕ ЗАДАНИЕ ${i + 1}`,
  category: 'hard',
  points: 20,
  createdAt: new Date(),
  completed: false,
  description: 'Окно прибытия: 30–45 минут. Не покидай сектор контроля шлюза.',
}));
const MOCK_QUESTS = [...MANY, ...MANY_MED, ...MANY_HARD];

function App() {
  // const {
  //   tasks,
  //   stats,
  //   createTask,
  //   deleteTask,
  //   updateScore,
  //   markCompleted,
  //   markIncomplete,
  //   updateTask,
  // } = useTasks();

  return (
    <>
      {/* Header */}
      <main className="quest-log">
        <section className="quest-log__container container">
          <QuestFrame className="quest-log__frame">
            <div className="quest-log__content">
              <header className="quest-log__header">
                <h1 className="quest-log__title">QUEST LOG</h1>
                <button className="qbtn qbtn--primary qbtn--cta" type="button">
                  НОВАЯ МИССИЯ
                </button>
              </header>
              <QuestTabs />
              <div className="quest-log__tabsDivider" />
              <div className="quest-log__body ">
                <QuestBoard quests={MOCK_QUESTS} />
              </div>
            </div>
          </QuestFrame>
        </section>
      </main>
    </>
  );
}

export default App;
