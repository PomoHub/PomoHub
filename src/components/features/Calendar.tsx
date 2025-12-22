import { useCalendar } from "@/hooks/useCalendar";
import { ChevronLeft, ChevronRight, CheckSquare, Timer, ListTodo } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Calendar() {
  const { currentDate, stats, changeMonth } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayStats = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return stats[dateStr] || { completedHabits: 0, completedTodos: 0, pomodoroMinutes: 0 };
  };

  const selectedStats = getDayStats(selectedDate);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Calendar Grid */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dayStats = getDayStats(day);
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square p-1 rounded-lg flex flex-col items-center justify-start relative transition-all",
                  !isSameMonth(day, monthStart) && "opacity-30",
                  isToday(day) && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold",
                  isSameDay(day, selectedDate) && "ring-2 ring-blue-500",
                  "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                
                {/* Activity Dots */}
                <div className="flex gap-0.5 mt-1">
                  {dayStats.completedHabits > 0 && <div className="w-1 h-1 rounded-full bg-green-500" />}
                  {dayStats.pomodoroMinutes > 0 && <div className="w-1 h-1 rounded-full bg-red-500" />}
                  {dayStats.completedTodos > 0 && <div className="w-1 h-1 rounded-full bg-orange-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side Panel (Day Details) */}
      <div className="w-full md:w-72 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 h-fit">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">
          {format(selectedDate, 'EEEE')}
        </h3>
        <p className="text-sm text-zinc-500 mb-6">{format(selectedDate, 'MMMM do, yyyy')}</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <CheckSquare size={18} />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Habits Completed</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedStats.completedHabits}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <Timer size={18} />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Focus Time</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedStats.pomodoroMinutes} min</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <ListTodo size={18} />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Tasks Finished</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedStats.completedTodos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
