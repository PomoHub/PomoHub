import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';

export interface Habit {
  id: number;
  title: string;
  frequency: 'daily' | 'weekly';
  color: string;
  created_at: string;
  completedToday?: boolean; // Derived state
  streak?: number; // Placeholder for future implementation
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const habitsData = await db.select('SELECT * FROM habits') as Habit[];
      const logsData = await db.select(
        'SELECT * FROM habit_logs WHERE date = ?', 
        [today]
      ) as { habit_id: number; completed: number }[];

      const habitsWithStatus = habitsData.map(habit => ({
        ...habit,
        completedToday: logsData.some(log => log.habit_id === habit.id && log.completed)
      }));

      setHabits(habitsWithStatus);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async (title: string, color: string) => {
    try {
      const db = await getDB();
      const createdAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      
      await db.execute(
        'INSERT INTO habits (title, color, created_at) VALUES (?, ?, ?)',
        [title, color, createdAt]
      );
      await fetchHabits();
    } catch (error) {
      console.error('Failed to add habit:', error);
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      const db = await getDB();
      await db.execute('DELETE FROM habits WHERE id = ?', [id]);
      await fetchHabits();
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const toggleHabit = async (id: number) => {
    try {
      const db = await getDB();
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const habit = habits.find(h => h.id === id);
      
      if (!habit) return;

      if (habit.completedToday) {
        // Remove log
        await db.execute(
          'DELETE FROM habit_logs WHERE habit_id = ? AND date = ?',
          [id, todayStr]
        );
      } else {
        // Add log
        await db.execute(
          'INSERT INTO habit_logs (habit_id, date, completed) VALUES (?, ?, 1)',
          [id, todayStr]
        );
      }

      // Optimistic update
      setHabits(prev => prev.map(h => 
        h.id === id ? { ...h, completedToday: !h.completedToday } : h
      ));
    } catch (error) {
      console.error('Failed to toggle habit:', error);
      await fetchHabits(); // Revert on error
    }
  };

  return {
    habits,
    loading,
    addHabit,
    deleteHabit,
    toggleHabit,
    refreshHabits: fetchHabits
  };
};
