import { useHabits } from "@/hooks/useHabits";
import { Plus, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/components/providers/ConfirmProvider";

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export function HabitTracker() {
  const { habits, loading, addHabit, deleteHabit, toggleHabit } = useHabits();
  const { confirm } = useConfirm();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[5]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    
    await addHabit(newHabitTitle, selectedColor);
    setNewHabitTitle("");
    setIsAdding(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-500">Loading habits...</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header / Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Today's Habits</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Plus size={16} />
          Add Habit
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="What do you want to track?"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 mr-2">Color:</span>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform hover:scale-110",
                      selectedColor === color ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-zinc-400" : ""
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
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
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">No habits yet. Start by adding one!</p>
          </div>
        )}

        {habits.map((habit) => (
          <div
            key={habit.id}
            className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  habit.completedToday
                    ? "bg-opacity-100 text-white border-transparent scale-105"
                    : "bg-transparent text-transparent border-zinc-300 dark:border-zinc-600 hover:border-zinc-400"
                )}
                style={{ 
                  backgroundColor: habit.completedToday ? habit.color : 'transparent',
                  borderColor: habit.completedToday ? 'transparent' : undefined
                }}
              >
                <Check size={16} strokeWidth={3} />
              </button>
              
              <span 
                className={cn(
                  "font-medium text-zinc-800 dark:text-zinc-200 transition-all",
                  habit.completedToday && "text-zinc-400 line-through decoration-zinc-400"
                )}
              >
                {habit.title}
              </span>
            </div>

            <button
              onClick={async () => {
                const isConfirmed = await confirm({
                    title: "Delete Habit",
                    message: "Are you sure you want to delete this habit?",
                    confirmText: "Delete",
                    variant: "danger"
                });
                if (isConfirmed) {
                    deleteHabit(habit.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
