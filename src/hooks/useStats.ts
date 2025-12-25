import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';

export interface UserStats {
  totalPomodoroMinutes: number;
  totalHabitsCompleted: number;
  totalTodosCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

// Helper function to fetch stats (extracted to avoid dependency issues)
const fetchStatsFromDB = async (db: any) => {
  // Pomodoro Minutes
  const pomodoroResult = await db.select(
    'SELECT SUM(duration) as total FROM pomodoro_sessions'
  ) as { total: number }[];
  const totalPomodoroMinutes = pomodoroResult[0]?.total || 0;

  // Habits Completed
  const habitsResult = await db.select(
    'SELECT COUNT(*) as count FROM habit_logs WHERE completed = 1'
  ) as { count: number }[];
  const totalHabitsCompleted = habitsResult[0]?.count || 0;

  // Todos Completed
  const todosResult = await db.select(
    'SELECT COUNT(*) as count FROM todos WHERE completed = 1'
  ) as { count: number }[];
  const totalTodosCompleted = todosResult[0]?.count || 0;

  return {
    totalPomodoroMinutes,
    totalHabitsCompleted,
    totalTodosCompleted,
  };
};

export const useStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalPomodoroMinutes: 0,
    totalHabitsCompleted: 0,
    totalTodosCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateStreak = async (db: any) => {
    // Get all unique dates with completed habits
    const result = await db.select(
      'SELECT DISTINCT date FROM habit_logs WHERE completed = 1 ORDER BY date DESC'
    ) as { date: string }[];
    
    if (result.length === 0) return { current: 0, longest: 0 };

    const dates = result.map((r: any) => r.date);
    let current = 0;
    let longest = 0;
    let tempStreak = 0;
    
    // Check if streak is active (today or yesterday has activity)
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    
    const hasActivityToday = dates.includes(today);
    const hasActivityYesterday = dates.includes(yesterday);

    if (!hasActivityToday && !hasActivityYesterday) {
      current = 0;
    } else {
      // Calculate current streak
      // This is a simplified logic. For strict consecutive days, we'd need to parse dates.
      // Assuming dates are sorted DESC
      current = 1;
      
      for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i + 1]);
        const diffTime = Math.abs(d1.getTime() - d2.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          current++;
        } else {
          break;
        }
      }
      
      // If today has no activity but yesterday did, streak is valid but doesn't include today yet?
      // Actually if user hasn't done anything today, streak is what it was yesterday.
      // If neither, streak is broken (handled above).
    }

    // Calculate longest streak
    tempStreak = 1;
    longest = 1;
    for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i + 1]);
        const diffTime = Math.abs(d1.getTime() - d2.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
            tempStreak++;
        } else {
            if (tempStreak > longest) longest = tempStreak;
            tempStreak = 1;
        }
    }
    if (tempStreak > longest) longest = tempStreak;

    return { current, longest };
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();

      // Streaks
      const streaks = await calculateStreak(db);
      
      // Other stats
      const otherStats = await fetchStatsFromDB(db);

      setStats({
        ...otherStats,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
      });

    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refreshStats: fetchStats };
};
