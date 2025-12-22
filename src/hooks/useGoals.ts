import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';

export interface Goal {
  id: number;
  title: string;
  target_date: string | null;
  progress: number;
  total: number;
  created_at: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const data = await db.select<Goal[]>('SELECT * FROM goals ORDER BY created_at DESC');
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (title: string, total: number, targetDate?: Date) => {
    try {
      const db = await getDB();
      const targetDateStr = targetDate ? format(targetDate, 'yyyy-MM-dd') : null;
      await db.execute(
        'INSERT INTO goals (title, total, target_date, progress, created_at) VALUES (?, ?, ?, 0, ?)',
        [title, total, targetDateStr, new Date().toISOString()]
      );
      await fetchGoals();
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  const updateProgress = async (id: number, newProgress: number) => {
    try {
      const db = await getDB();
      await db.execute(
        'UPDATE goals SET progress = ? WHERE id = ?',
        [newProgress, id]
      );
      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, progress: newProgress } : g
      ));
    } catch (error) {
      console.error('Failed to update goal progress:', error);
      await fetchGoals();
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      const db = await getDB();
      await db.execute('DELETE FROM goals WHERE id = ?', [id]);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error('Failed to delete goal:', error);
      await fetchGoals();
    }
  };

  return {
    goals,
    loading,
    addGoal,
    updateProgress,
    deleteGoal
  };
};
