import { useGoals } from "@/hooks/useGoals";
import { Plus, Trash2, Target, Calendar as CalendarIcon, Minus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useConfirm } from "@/components/providers/ConfirmProvider";

export function Goals() {
  const { goals, loading, addGoal, updateProgress, deleteGoal } = useGoals();
  const { confirm } = useConfirm();
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("100");
  const [targetDate, setTargetDate] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !total) return;

    await addGoal(
      title, 
      Number(total),
      targetDate ? new Date(targetDate) : undefined
    );
    
    setTitle("");
    setTotal("100");
    setTargetDate("");
    setIsAdding(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-500">Loading goals...</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Long-term Goals</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="What is your goal?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-zinc-500">Target Value</label>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-zinc-500">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Add Goal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">No goals set. Aim high!</p>
          </div>
        )}

        {goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.progress / goal.total) * 100));
          
          return (
            <div
              key={goal.id}
              className="group p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{goal.title}</h4>
                    {goal.target_date && (
                      <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                        <CalendarIcon size={12} />
                        <span>Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={async () => {
                    const isConfirmed = await confirm({
                        title: "Delete Goal",
                        message: "Are you sure you want to delete this goal?",
                        confirmText: "Delete",
                        variant: "danger"
                    });
                    if (isConfirmed) {
                        deleteGoal(goal.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{goal.progress} / {goal.total}</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => updateProgress(goal.id, Math.max(0, goal.progress - 1))}
                  className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => updateProgress(goal.id, goal.progress + 1)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
