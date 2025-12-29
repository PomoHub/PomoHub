import { MessageSquare, Users, Hash } from "lucide-react";
import { useState } from "react";

export function RightPanel() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed right-4 bottom-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        >
            <MessageSquare size={20} className="text-indigo-500" />
        </button>
    );
  }

  return (
    <aside className="w-80 h-full bg-white/50 dark:bg-zinc-900/50 border-l border-zinc-200 dark:border-zinc-800 backdrop-blur-xl flex flex-col">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-500" />
            Social
        </h3>
        <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
        >
            <Hash size={14} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-2">
            <Users size={32} />
        </div>
        <div>
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Join Spaces</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Connect with friends, share your focus status, and chat in real-time.
            </p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors w-full">
            Coming Soon
        </button>
      </div>
    </aside>
  );
}
