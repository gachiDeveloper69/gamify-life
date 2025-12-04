import { useState } from 'react';
import { useTasks } from './hooks/useTask';

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
          <ul className="quest-log__list">
            <li className="quest-log__item">Задача 1</li>
            <li className="quest-log__item">Задача 2</li>
            <li className="quest-log__item">Задача 3</li>
            <li className="quest-log__item">Задача 4</li>
          </ul>
        </div>
      </main>
    </>

    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    // </>
  );
}

export default App;
