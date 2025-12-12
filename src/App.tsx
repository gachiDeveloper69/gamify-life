import { useState } from 'react';
import { useTasks } from './hooks/useTask';
import QuestFrame from '@/assets/svg/quest-frame.svg?react';

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
        <h1 className="quest-log__title">Quest log</h1>

        <div className="quest-log__body container">
          <QuestFrame />
          <ul className="quest-log__list">
            <li className="quest-log__item">Задача 1</li>
            <li className="quest-log__item">Задача 2</li>
            <li className="quest-log__item">Задача 3</li>
            <li className="quest-log__item">Задача 4</li>
          </ul>
        </div>
      </main>
    </>
  );
}

export default App;
