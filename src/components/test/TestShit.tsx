import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTasks } from '@/hooks/useTask';
import TestTasksPlayground from '@/components/test/TestTasksPlayground';
const TestMyShit = () => {
  // const [value, setValue] = useLocalStorage('test-key', 'default');

  const testStyles = {
    width: 'min(90vw, 800px)', // максимум 800px, но на мобиле не больше 90% экрана
    height: 'min(90vh, 600px)', // то же самое по высоте
    maxWidth: '800px',
    maxHeight: '600px',
    background: '#265cadff',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    padding: '2rem',
    overflow: 'auto',
  };

  return (
    <div className="test-window" style={testStyles}>
      <TestTasksPlayground />
    </div>
  );
};

export default TestMyShit;
