import { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { 
  X, 
  Minus, 
  Maximize2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableWidgetProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onClose?: () => void;
  className?: string;
}

export function DraggableWidget({ 
  title, 
  icon: Icon, 
  children, 
  initialPosition = { x: 0, y: 0 },
  onClose,
  className 
}: DraggableWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      initial={initialPosition}
      className={cn(
        "absolute z-30 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col",
        isMinimized ? "w-64 h-auto" : "w-80 h-96",
        className
      )}
    >
      {/* Header / Drag Handle */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="h-10 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Icon size={16} />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
          >
            {isMinimized ? <Maximize2 size={12} /> : <Minus size={12} />}
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 rounded-md transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>
      )}
    </motion.div>
  );
}
