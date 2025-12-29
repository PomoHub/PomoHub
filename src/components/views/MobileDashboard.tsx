import { useStats } from "@/hooks/useStats";
import { useTodos } from "@/hooks/useTodos";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useHabits } from "@/hooks/useHabits";
import { useAppStore } from "@/store";
import { useAuthStore } from "@/store/auth";
import { 
  Timer, 
  Play, 
  Pause, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight,
  User,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function MobileDashboard() {
  const { stats } = useStats();
  const { todos, toggleTodo } = useTodos();
  const { habits, toggleHabit } = useHabits();
  const { timeLeft, isActive, mode, toggleTimer } = usePomodoro();
  const { setCurrentView } = useAppStore();
  const { user } = useAuthStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingTodos = todos.filter(t => !t.completed).slice(0, 3);
  const todaysHabits = habits.slice(0, 3); 

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden safe-area-pt pb-24 p-4 flex flex-col gap-6 scroll-smooth no-scrollbar">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Hello, {user?.first_name || user?.username || 'Guest'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('settings')}
            className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 active:scale-95 transition-transform"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setCurrentView('profile')}
            className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden active:scale-95 transition-transform"
          >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                   {user?.username ? user.username[0].toUpperCase() : <User size={20} />}
                </span>
              )}
          </button>
        </div>
      </div>

      {/* Hero Timer Card */}
      <div className="relative overflow-hidden bg-zinc-900 dark:bg-black rounded-4xl p-6 text-white shadow-xl shadow-indigo-500/10 transition-transform active:scale-[0.99]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center py-4">
          <div className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/5">
            <Timer size={14} className="text-indigo-300" />
            <span className="text-xs font-medium text-indigo-100">
              {mode === 'work' ? 'Focus Session' : 'Break Time'}
            </span>
          </div>

          <div className="text-6xl font-bold font-mono tracking-tighter tabular-nums mb-6">
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={toggleTimer}
            className={cn(
              "w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-semibold text-lg transition-all active:scale-95",
              isActive 
                ? "bg-red-500/10 text-red-200 border border-red-500/20 hover:bg-red-500/20" 
                : "bg-white text-zinc-900 hover:bg-zinc-100"
            )}
          >
            {isActive ? (
              <>
                <Pause size={20} fill="currentColor" />
                Pause
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" />
                Start Focus
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <TrendingUp size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Streak</span>
          </div>
          <span className="text-2xl font-bold">{stats.currentStreak} <span className="text-sm font-normal text-zinc-400">days</span></span>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Timer size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Today</span>
          </div>
          <span className="text-2xl font-bold">{Math.floor(stats.totalPomodoroMinutes / 60)} <span className="text-sm font-normal text-zinc-400">hrs</span></span>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Up Next</h2>
          <button 
            onClick={() => setCurrentView('tasks')}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 active:opacity-70"
          >
            See All <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="space-y-3">
          {pendingTodos.length > 0 ? pendingTodos.map(todo => (
            <div 
              key={todo.id}
              onClick={() => toggleTodo(todo.id, todo.completed)}
              className="group bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                todo.completed 
                  ? "bg-emerald-500 border-emerald-500" 
                  : "border-zinc-300 dark:border-zinc-600 group-hover:border-indigo-500"
              )}>
                {todo.completed && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <span className={cn(
                "flex-1 font-medium text-zinc-700 dark:text-zinc-200",
                todo.completed && "line-through text-zinc-400"
              )}>
                {todo.title}
              </span>
            </div>
          )) : (
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 text-sm mb-3">No pending tasks</p>
              <button 
                onClick={() => setCurrentView('tasks')}
                className="text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-2 rounded-lg font-medium"
              >
                Add Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Habits Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Daily Habits</h2>
          <button 
            onClick={() => setCurrentView('habits')}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 active:opacity-70"
          >
            Manage <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {todaysHabits.length > 0 ? todaysHabits.map(habit => {
            const isCompleted = habit.completedToday;
            return (
              <div 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className="bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.emoji || '📝'}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{habit.title}</span>
                    <span className="text-xs text-zinc-500">{habit.streak || 0} day streak</span>
                  </div>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isCompleted 
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" 
                    : "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                )}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
            );
          }) : (
             <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 text-sm mb-3">No habits tracked</p>
              <button 
                onClick={() => setCurrentView('habits')}
                className="text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-2 rounded-lg font-medium"
              >
                Add Habit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
