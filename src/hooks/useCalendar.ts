import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export interface DayStats {
  date: string;
  completedTodos: number;
  completedHabits: number;
  pomodoroMinutes: number;
}

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<Record<string, DayStats>>({});
  const [loading, setLoading] = useState(true);

  const fetchMonthStats = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      // Fetch Habit Logs count per day
      const habitLogs = await db.select<{ date: string; count: number }[]>(
        `SELECT date, COUNT(*) as count FROM habit_logs 
         WHERE date BETWEEN ? AND ? AND completed = 1 
         GROUP BY date`,
        [start, end]
      );

      // Fetch Completed Todos count per day
      // Using created_at or due_date. Since created_at has time, we need to extract date.
      // SQLite's date() function handles ISO strings "YYYY-MM-DDTHH:MM:SS..." correctly.
      const todoCounts = await db.select<{ due_date: string; count: number }[]>(
        `SELECT date(created_at) as due_date, COUNT(*) as count FROM todos 
         WHERE completed = 1 AND date(created_at) BETWEEN ? AND ?
         GROUP BY date(created_at)`,
        [start, end]
      );

      // Fetch Pomodoro Sessions sum per day
      const pomodoroSessions = await db.select<{ date: string; minutes: number }[]>(
        `SELECT date(completed_at) as date, SUM(duration) as minutes FROM pomodoro_sessions 
         WHERE date(completed_at) BETWEEN ? AND ? 
         GROUP BY date(completed_at)`,
        [start, end]
      );

      // Merge data
      const newStats: Record<string, DayStats> = {};
      
      habitLogs.forEach(row => {
        if (!newStats[row.date]) newStats[row.date] = { date: row.date, completedTodos: 0, completedHabits: 0, pomodoroMinutes: 0 };
        newStats[row.date].completedHabits = row.count;
      });

      todoCounts.forEach(row => {
        if (!row.due_date) return;
        if (!newStats[row.due_date]) newStats[row.due_date] = { date: row.due_date, completedTodos: 0, completedHabits: 0, pomodoroMinutes: 0 };
        newStats[row.due_date].completedTodos = row.count;
      });

      pomodoroSessions.forEach(row => {
        if (!newStats[row.date]) newStats[row.date] = { date: row.date, completedTodos: 0, completedHabits: 0, pomodoroMinutes: 0 };
        newStats[row.date].pomodoroMinutes = row.minutes;
      });

      setStats(newStats);
    } catch (error) {
      console.error('Failed to fetch calendar stats:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchMonthStats();
  }, [fetchMonthStats]);

  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  return {
    currentDate,
    stats,
    loading,
    nextMonth,
    prevMonth
  };
};
