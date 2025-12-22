import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const data = await db.select<Todo[]>('SELECT * FROM todos ORDER BY completed ASC, created_at DESC');
      // SQLite stores booleans as 0/1, convert them
      const parsedData = data.map(todo => ({
        ...todo,
        completed: Boolean(todo.completed)
      }));
      setTodos(parsedData);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (title: string, dueDate?: Date) => {
    try {
      const db = await getDB();
      const dueDateStr = dueDate ? format(dueDate, 'yyyy-MM-dd') : null;
      await db.execute(
        'INSERT INTO todos (title, due_date, completed, created_at) VALUES (?, ?, 0, ?)',
        [title, dueDateStr, new Date().toISOString()]
      );
      await fetchTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    try {
      const db = await getDB();
      await db.execute(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [currentStatus ? 0 : 1, id]
      );
      // Optimistic update
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ).sort((a, b) => Number(a.completed) - Number(b.completed))); // Re-sort: uncompleted first
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      await fetchTodos();
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const db = await getDB();
      await db.execute('DELETE FROM todos WHERE id = ?', [id]);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      await fetchTodos();
    }
  };

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo
  };
};
