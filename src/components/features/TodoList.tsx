import { useTodos } from "@/hooks/useTodos";
import { Plus, Trash2, Calendar as CalendarIcon, Check, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useConfirm } from "@/components/providers/ConfirmProvider";

export function TodoList() {
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { confirm } = useConfirm();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>(""); // YYYY-MM-DD
  const [reminderTime, setReminderTime] = useState<string>(""); // YYYY-MM-DDTHH:mm
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    await addTodo(
      newTodoTitle, 
      dueDate ? new Date(dueDate) : undefined,
      reminderTime ? new Date(reminderTime) : undefined
    );
    setNewTodoTitle("");
    setDueDate("");
    setReminderTime("");
    setIsAdding(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-500">Loading tasks...</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">My Tasks</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 mr-2">Due Date:</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="p-1.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 mr-2">Reminder:</span>
                <input
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="p-1.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {todos.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">No tasks yet. Stay productive!</p>
          </div>
        )}

        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              "group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm transition-all hover:shadow-md",
              todo.completed 
                ? "border-zinc-100 dark:border-zinc-800 opacity-60" 
                : "border-zinc-200 dark:border-zinc-700"
            )}
          >
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border",
                  todo.completed
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-transparent border-zinc-300 dark:border-zinc-600 hover:border-orange-500"
                )}
              >
                {todo.completed && <Check size={14} strokeWidth={3} />}
              </button>
              
              <div className="flex flex-col">
                <span 
                  className={cn(
                    "font-medium text-zinc-800 dark:text-zinc-200 transition-all",
                    todo.completed && "text-zinc-400 line-through decoration-zinc-400"
                  )}
                >
                  {todo.title}
                </span>
                {todo.due_date && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                    <CalendarIcon size={12} />
                    <span>{format(new Date(todo.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {todo.reminder_time && (
                  <div className="flex items-center gap-1 text-xs text-blue-500 mt-0.5">
                    <Bell size={12} />
                    <span>{format(new Date(todo.reminder_time), 'MMM d, HH:mm')}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={async () => {
                const isConfirmed = await confirm({
                    title: "Delete Task",
                    message: "Are you sure you want to delete this task?",
                    confirmText: "Delete",
                    variant: "danger"
                });
                if (isConfirmed) {
                    deleteTodo(todo.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
