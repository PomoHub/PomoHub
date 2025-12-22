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
      const todayStr = format(new Date(), 'yyyy-MM-dd');

      // Fetch all habits
      const habitsData = await db.select<Habit[]>('SELECT * FROM habits ORDER BY created_at DESC');

      // Fetch logs for today to check completion
      const logsData = await db.select<{ habit_id: number }[]>(
        'SELECT habit_id FROM habit_logs WHERE date = ? AND completed = 1',
        [todayStr]
      );

      const completedHabitIds = new Set(logsData.map(l => l.habit_id));

      const habitsWithStatus = habitsData.map(habit => ({
        ...habit,
        completedToday: completedHabitIds.has(habit.id)
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

  const addHabit = async (title: string, color: string = '#3b82f6', frequency: 'daily' | 'weekly' = 'daily') => {
    try {
      const db = await getDB();
      // Use local date for display consistency, ISO for storage if needed, but here created_at is metadata
      const now = new Date();
      // Use toISOString() but handle local timezone offset manually if strict local time is needed, 
      // OR rely on the fact that UI displays relative time or just dates.
      // However, the issue described is "1 day before". 
      // new Date().toISOString() returns UTC. If user is in UTC+3, 23:00 becomes 20:00 previous day in UTC.
      // SQLite queries often use string comparison.
      // Best approach for simple local app: Store dates as 'YYYY-MM-DD HH:mm:ss' in local time 
      // OR adjust display logic. 
      // Let's format date as local ISO-like string for created_at to avoid UTC confusion in simple apps.
      const createdAt = format(now, "yyyy-MM-dd'T'HH:mm:ss");
      
      await db.execute(
        'INSERT INTO habits (title, color, frequency, created_at) VALUES (?, ?, ?, ?)',
        [title, color, frequency, createdAt]
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
