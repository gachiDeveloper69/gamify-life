// src/components/test/TestTasksPlayground.tsx
import { useState } from 'react';
import { useTasks } from '@/hooks/useTask';
import type { CreateTaskData, Task, TaskCategory } from '@/types/task';

export default function TestTasksPlayground() {
  const { tasks, stats, createTask, deleteTask, markCompleted, markIncomplete } = useTasks();

  type TaskFormData = Omit<CreateTaskData, 'deadline'> & {
    deadline: string; // Для input[type="datetime-local"]
  };

  // Форма создания задачи
  const [form, setForm] = useState<TaskFormData>({
    title: '',
    description: '',
    completed: false,
    category: 'medium' as TaskCategory,
    deadline: '', // строка для input
    points: 0,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Заголовок обязателен!');
      return;
    }

    createTask({
      ...form,
      deadline: form.deadline ? new Date(form.deadline) : undefined,
    });

    setForm({
      title: '',
      description: '',
      completed: false,
      category: 'medium',
      deadline: '',
      points: 0,
    });
  };

  const getTagClass = (category: TaskCategory) => {
    switch (category) {
      case 'small':
        return 'testTasks__tag--small';
      case 'medium':
        return 'testTasks__tag--medium';
      case 'large':
        return 'testTasks__tag--large';
      default:
        return '';
    }
  };

  const isDeadlineOverdue = (deadline: Date | undefined, completed: boolean) => {
    if (!deadline || completed) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="testTasks__overlay">
      <div className="testTasks__modal">
        {/* Левая панель — создание задачи */}
        <div className="testTasks__leftPanel">
          <h2 className="testTasks__title">Создать задачу</h2>

          <form onSubmit={handleCreate} className="testTasks__form">
            <div className="testTasks__inputGroup">
              <input
                type="text"
                placeholder="Название задачи"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="testTasks__input"
                required
              />
            </div>

            <div className="testTasks__inputGroup">
              <textarea
                placeholder="Описание (необязательно)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="testTasks__textarea"
              />
            </div>

            <div className="testTasks__inputGroup">
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as TaskCategory })}
                className="testTasks__select"
              >
                <option value="small">Маленькая (5 XP)</option>
                <option value="medium">Средняя (10 XP)</option>
                <option value="large">Большая (50 XP)</option>
              </select>
            </div>

            <div className="testTasks__inputGroup">
              <input
                type="datetime-local"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="testTasks__input"
              />
            </div>

            <button type="submit" className="testTasks__button testTasks__button--primary">
              + Добавить задачу
            </button>
          </form>

          {/* Статистика */}
          <div className="testTasks__stats">
            <div>
              <p className="testTasks__statValue">{stats.totalPoints} XP</p>
              <p className="testTasks__statLabel">Всего заработано</p>
            </div>
            <div className="testTasks__dailyStat">
              {stats.dailyPoints} XP
              <p className="testTasks__statLabel">За сегодня</p>
            </div>
          </div>
        </div>

        {/* Правая панель — список задач */}
        <div className="testTasks__rightPanel">
          <h2 className="testTasks__subtitle">Список задач ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <p className="testTasks__emptyState">Пока задач нет. Создай первую!</p>
          ) : (
            <div className="testTasks__taskList">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`testTasks__task ${task.completed ? 'testTasks__task--completed' : ''}`}
                >
                  <div className="testTasks__taskHeader">
                    <div className="testTasks__taskContent">
                      <h3
                        className={`testTasks__taskTitle ${task.completed ? 'testTasks__taskTitle--completed' : ''}`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="testTasks__taskDescription">{task.description}</p>
                      )}

                      <div className="testTasks__taskMeta">
                        <span className={`testTasks__tag ${getTagClass(task.category)}`}>
                          {task.category === 'small' && 'Маленькая'}
                          {task.category === 'medium' && 'Средняя'}
                          {task.category === 'large' && 'Большая'}
                          {' • '}
                          {task.points} XP
                        </span>

                        {task.deadline && (
                          <span
                            className={`testTasks__tag testTasks__tag--deadline ${
                              isDeadlineOverdue(task.deadline, task.completed)
                                ? 'testTasks__tag--deadline--overdue'
                                : ''
                            }`}
                          >
                            До {new Date(task.deadline).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="testTasks__taskActions">
                      {!task.completed ? (
                        <button
                          onClick={() => markCompleted(task.id)}
                          className="testTasks__button testTasks__button--success"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          onClick={() => markIncomplete(task.id)}
                          className="testTasks__button testTasks__button--warning"
                        >
                          Undo
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="testTasks__button testTasks__button--danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {task.completed && task.completedAt && (
                    <p className="testTasks__completionDate">
                      Выполнено: {new Date(task.completedAt).toLocaleString('ru-RU')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* JSON вывод для отладки */}
          <textarea
            readOnly
            value={JSON.stringify(tasks, null, 2)}
            className="testTasks__jsonOutput"
          />
        </div>
      </div>
    </div>
  );
}
