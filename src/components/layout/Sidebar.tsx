import { useState } from "react";
import { useAppStore, ViewType } from "@/store";
import { useAuthStore } from "@/store/auth";
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  ListTodo, 
  Calendar, 
  StickyNote, 
  Settings, 
  Users,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "../BrandLogo";

const NAV_ITEMS: { id: ViewType; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pomodoro', label: 'Focus Timer', icon: Timer },
  { id: 'habits', label: 'Habits', icon: CheckSquare },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'spaces', label: 'Spaces', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const { currentView, setCurrentView } = useAppStore();
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 relative group z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center px-2" : "")}>
        {isCollapsed ? (
             <BrandLogo iconOnly={true} width={40} height={40} />
        ) : (
          <BrandLogo width={64} height={64} />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isCollapsed ? "justify-center" : "",
              currentView === item.id
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={18} strokeWidth={2} />
            {!isCollapsed && item.label}
          </button>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
        <button
            onClick={() => setCurrentView('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isCollapsed ? "justify-center" : "",
              currentView === 'settings'
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings size={18} strokeWidth={2} />
            {!isCollapsed && "Settings"}
        </button>
        {/* User Profile */}
        <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800/50">
             <div 
               onClick={() => setCurrentView('profile')}
               className={cn(
                 "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors",
                 isCollapsed ? "justify-center" : ""
               )}
               title={isCollapsed ? "Profile" : undefined}
             >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs overflow-hidden shrink-0">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.username?.[0]?.toUpperCase() || 'G'
                    )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {user ? (user.first_name || user.username) : 'Guest User'}
                      </p>
                      <p className="text-xs text-green-500 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {user ? 'Online' : 'Offline'}
                      </p>
                  </div>
                )}
             </div>
        </div>
      </div>
    </aside>
  );
}
