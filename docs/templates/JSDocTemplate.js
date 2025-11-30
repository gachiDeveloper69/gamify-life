/**
 * Просто шаблоны для JSDoc комментов
 */

//Основной шаблон
/**
 * Краткое описание что делает функция/компонент
 *
 * Подробное описание с деталями реализации,
 * особенностями и т.д.
 *
 * @param paramName - описание параметра
 * @returns описание возвращаемого значения
 * @throws тип ошибки и когда выбрасывается
 * @example пример использования
 */

//Основные
/**
 * Управляет задачами пользователя
 *
 * @important Что-то очень важное!
 * @warning Нужно иметь в виду!
 *
 * @param userId - ID пользователя
 * @param filters - фильтры для задач
 * @returns промис с массивом задач
 * @throws {Error} когда пользователь не найден
 * @throws {ValidationError} при невалидных фильтрах
 * @example
 * const tasks = await getUserTasks(123, { completed: true });
 * console.log(tasks); // [{...}, {...}]
 *
 * @see https://api.example.com/tasks - API документация
 * @since v1.2.0 - добавлена пагинация
 * @deprecated используйте вместо этого getTasksV2
 */
// implementation

//Хуки
/**
 * Кастомный хук для управления формой
 *
 * @template T - тип данных формы
 * @param initialValues - начальные значения
 * @returns кортеж [values, handleChange, handleSubmit]
 *
 * @example
 * const [values, handleChange, handleSubmit] = useForm({ name: '', email: '' });
 */

//Компоненты
/**
 * Кнопка с загрузкой и разными вариантами
 *
 * @param props - свойства кнопки
 * @param props.children - содержимое кнопки
 * @param props.loading - состояние загрузки
 * @param props.variant - вариант стиля
 *
 * @example
 * <Button loading variant="primary">
 *   Сохранить
 * </Button>
 */

//Типы и интерфейсы
/**
 * Представляет задачу в системе
 *
 * @property id - уникальный идентификатор
 * @property title - название задачи (обязательно)
 * @property description - описание (опционально)
 * @property completed - статус выполнения
 *
 * @example
 * const task: Task = {
 *   id: '1',
 *   title: 'Изучить JSDoc',
 *   completed: false
 * };
 */
