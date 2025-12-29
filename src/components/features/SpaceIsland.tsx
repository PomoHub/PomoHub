import { usePomodoro } from "@/hooks/usePomodoro";
import { 
  Play, 
  Pause, 
  Users, 
  Settings, 
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpaceIslandProps {
  spaceName: string;
  memberCount: number;
  onLeave: () => void;
  onToggleMembers: () => void;
  onToggleSettings: () => void;
}

export function SpaceIsland({ 
  spaceName, 
  memberCount, 
  onLeave,
  onToggleMembers,
  onToggleSettings
}: SpaceIslandProps) {
  const { timeLeft, isActive, toggleTimer } = usePomodoro();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-1 p-1.5 bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-xl border border-zinc-700/50 rounded-full shadow-2xl text-white"
      >
        {/* Space Info */}
        <div className="px-4 flex items-center gap-2 border-r border-zinc-700/50 pr-4">
            <span className="font-bold text-sm max-w-25 truncate">{spaceName}</span>
            <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Users size={12} />
                {memberCount}
            </div>
        </div>

        {/* Timer Control */}
        <div className="px-2 flex items-center gap-3 min-w-30 justify-center">
            <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isActive ? "bg-green-500" : "bg-yellow-500"
            )}></div>
            <span className="font-mono text-lg font-medium tabular-nums tracking-wider">
                {formatTime(timeLeft)}
            </span>
            <button 
                onClick={toggleTimer}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
                {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-2 border-l border-zinc-700/50">
            <button 
                onClick={onToggleMembers}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                title="Members"
            >
                <Users size={16} />
            </button>
            <button 
                onClick={onToggleSettings}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                title="Settings"
            >
                <Settings size={16} />
            </button>
            <button 
                onClick={onLeave}
                className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-500 rounded-full transition-colors"
                title="Leave Space"
            >
                <LogOut size={16} />
            </button>
        </div>
      </motion.div>
    </div>
  );
}
