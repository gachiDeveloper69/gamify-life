import { useState } from 'react';
import { useTasks } from './hooks/useTask';
import QuestFrame from '@/components/features/QuestFrame';
import { QuestTabs } from './components/features/QuestTabs';

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
          <QuestFrame className="quest-log__frame" />
          <div className="quest-log__content">
            <header className="quest-log__header">
              <h1 className="quest-log__title">QUEST LOG</h1>
              <div className="quest-log__status">
                <span className="quest-log__statusLabel">XP</span>
                <span className="quest-log__statusValue">+35</span>
                <span className="quest-log__statusMeta">TODAY</span>
              </div>
            </header>
            <QuestTabs />
            <div className="quest-log__tabsDivider" />
            <div className="quest-log__body ">
              <ul className="quest-log__list">
                <li className="quest-log__item">Задача 1</li>
                <li className="quest-log__item">Задача 2</li>
                <li className="quest-log__item">Задача 3</li>
                <li className="quest-log__item">Задача 4</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
