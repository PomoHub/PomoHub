import { ReactNode } from "react";
import { useAppStore, ViewType } from "@/store";
import { 
  LayoutDashboard, 
  Timer, 
  User,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MobileLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS: { id: ViewType; icon: any; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'pomodoro', icon: Timer, label: 'Focus' },
  { id: 'spaces', icon: Users, label: 'Spaces' },
  { id: 'social', icon: MessageSquare, label: 'Social' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function MobileLayout({ children }: MobileLayoutProps) {
  const { currentView, setCurrentView, isSpaceDetailOpen } = useAppStore();

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden">
      
      {/* Content Area */}
      <main className="flex-1 relative overflow-hidden bg-zinc-50 dark:bg-black">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      {!isSpaceDetailOpen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-around px-2 z-50 safe-area-pb pb-1 pt-1">
            {NAV_ITEMS.map((item) => {
                const isActive = currentView === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={cn(
                        "relative p-2 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 w-16",
                        isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        )}
                    >
                        <div className="relative">
                            <item.icon 
                                size={24} 
                                strokeWidth={isActive ? 2.5 : 2} 
                                className={cn("transition-transform duration-300", isActive && "scale-110")}
                            />
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full"
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </div>
                        <span className="text-[10px] font-medium tracking-tight">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
      )}
    </div>
  );
}
