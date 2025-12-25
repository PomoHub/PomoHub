import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export interface DayStats {
  date: string;
  pomodoroMinutes: number;
  completedHabits: number;
  completedTodos: number;
}

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<Record<string, DayStats>>({});
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      // Fetch Habit Logs count per day
      const habitLogs = await db.select(
        `SELECT date, COUNT(*) as count FROM habit_logs 
         WHERE date BETWEEN ? AND ? AND completed = 1 
         GROUP BY date`,
        [start, end]
      ) as { date: string; count: number }[];

      // Fetch Completed Todos count per day
      // Using created_at or due_date. Since created_at has time, we need to extract date.
      // SQLite's date() function handles ISO strings "YYYY-MM-DDTHH:MM:SS..." correctly.
      const todoCounts = await db.select(
        `SELECT date(created_at) as due_date, COUNT(*) as count FROM todos 
         WHERE completed = 1 AND date(created_at) BETWEEN ? AND ?
         GROUP BY date(created_at)`,
        [start, end]
      ) as { due_date: string; count: number }[];

      // Fetch Pomodoro Sessions sum per day
      // Using date(completed_at) which works for both 'YYYY-MM-DDTHH:mm:ss' (ISO) and 'YYYY-MM-DD HH:mm:ss' (Local)
      const pomodoroSessions = await db.select(
        `SELECT date(completed_at) as date, SUM(duration) as minutes FROM pomodoro_sessions 
         WHERE date(completed_at) BETWEEN ? AND ? 
         GROUP BY date(completed_at)`,
        [start, end]
      ) as { date: string; minutes: number }[];

      // Aggregate data
      const newStats: Record<string, DayStats> = {};

      habitLogs.forEach(log => {
        if (!newStats[log.date]) newStats[log.date] = { date: log.date, pomodoroMinutes: 0, completedHabits: 0, completedTodos: 0 };
        newStats[log.date].completedHabits = log.count;
      });

      todoCounts.forEach(todo => {
        // todo.due_date comes from date(created_at), so it's YYYY-MM-DD
        if (!newStats[todo.due_date]) newStats[todo.due_date] = { date: todo.due_date, pomodoroMinutes: 0, completedHabits: 0, completedTodos: 0 };
        newStats[todo.due_date].completedTodos = todo.count;
      });

      pomodoroSessions.forEach(session => {
        if (!newStats[session.date]) newStats[session.date] = { date: session.date, pomodoroMinutes: 0, completedHabits: 0, completedTodos: 0 };
        newStats[session.date].pomodoroMinutes = session.minutes;
      });

      setStats(newStats);
    } catch (error) {
      console.error('Failed to fetch calendar stats:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);
      return newDate;
    });
  };

  return {
    currentDate,
    stats,
    loading,
    changeMonth
  };
};
