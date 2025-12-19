import { useState } from 'react';
import { useTasks } from './hooks/useTask';
import QuestFrame from '@/components/features/QusetFrame';

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
            {/* <header className="quest-log__header">
              <h1 className="quest-log__title">Quest log</h1>
            </header>
            <div className="tabs" role="tablist">
              <div className="tabs__frame">
                <div className="tabs__glow">
                  <button type="button" role="tab" className="tab tab--active">
                    Активные
                  </button>
                  <button type="button" role="tab" className="tab">
                    Регулярные
                  </button>
                  <button type="button" role="tab" className="tab">
                    Завершенные
                  </button>
                </div>
              </div>
            </div>
            <div className="quest-log__body ">
              <ul className="quest-log__list">
                <li className="quest-log__item">Задача 1</li>
                <li className="quest-log__item">Задача 2</li>
                <li className="quest-log__item">Задача 3</li>
                <li className="quest-log__item">Задача 4</li>
              </ul>
            </div> */}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
