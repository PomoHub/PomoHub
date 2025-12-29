import { PageContainer } from "@/components/layout/PageContainer";
import { useStats } from "@/hooks/useStats";
import { useTodos } from "@/hooks/useTodos";
import { usePomodoro } from "@/hooks/usePomodoro";
import { 
  Timer, 
  CheckSquare, 
  Flame, 
  TrendingUp, 
  ArrowRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";

export function Dashboard() {
  const { stats } = useStats();
  const { todos } = useTodos();
  const { timeLeft, isActive, mode, toggleTimer } = usePomodoro();
  const { setCurrentView } = useAppStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingTodos = todos.filter(t => !t.completed).slice(0, 3);

  return (
    <PageContainer 
        title="Dashboard" 
        description="Welcome back! Here's your daily overview."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Main Hero: Active Timer */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/20 hidden md:block"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex items-center gap-3 mb-2 md:mb-6">
                    <div className={cn("p-2 rounded-xl", isActive ? "bg-green-100 text-green-600" : "bg-zinc-100 text-zinc-500")}>
                        <Timer size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Current Session</h3>
                        <p className="text-sm text-zinc-500">{mode === 'work' ? 'Focus Time' : 'Break Time'}</p>
                    </div>
                </div>

                <div className="text-center py-2 md:py-4">
                    <div className="text-6xl md:text-7xl font-bold font-mono tracking-tighter tabular-nums mb-4 md:mb-6">
                        {formatTime(timeLeft)}
                    </div>
                    <button 
                        onClick={toggleTimer}
                        className={cn(
                            "w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95",
                            isActive 
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                        )}
                    >
                        {isActive ? 'Pause Timer' : 'Start Focus'}
                    </button>
                </div>
            </div>
        </div>

        {/* Stats Card: Streak */}
        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/20 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl">
                    <Flame size={24} />
                </div>
                <span className="text-4xl font-bold text-orange-600 dark:text-orange-500">{stats.currentStreak}</span>
            </div>
            <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Day Streak</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300/70">Keep the fire burning!</p>
            </div>
        </div>

        {/* Quick Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <CheckSquare size={18} className="text-emerald-500" />
                    Up Next
                </h3>
                <button onClick={() => setCurrentView('tasks')} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <ArrowRight size={16} className="text-zinc-400" />
                </button>
            </div>
            <div className="flex-1 space-y-2">
                {pendingTodos.length > 0 ? pendingTodos.map(todo => (
                    <div key={todo.id} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium truncate flex-1">{todo.title}</span>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-sm">
                        <p>No pending tasks</p>
                    </div>
                )}
            </div>
        </div>

        {/* Stats: Total Focus */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-start justify-between">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                    <Clock size={24} />
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{Math.floor(stats.totalPomodoroMinutes / 60)}h</span>
                    <span className="text-sm text-zinc-500 ml-1">{stats.totalPomodoroMinutes % 60}m</span>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Total Focus</h3>
                <p className="text-sm text-zinc-500">Lifetime productivity</p>
            </div>
        </div>

        {/* Quick Note */}
        <div 
            onClick={() => setCurrentView('notes')}
            className="cursor-pointer group bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl p-6 border border-yellow-100 dark:border-yellow-900/20 flex flex-col justify-between transition-all hover:shadow-md hover:scale-[1.02]"
        >
             <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl w-fit mb-4">
                <TrendingUp size={24} />
            </div>
            <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Quick Note</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300/70">Capture thoughts instantly</p>
            </div>
        </div>

      </div>
    </PageContainer>
  );
}
