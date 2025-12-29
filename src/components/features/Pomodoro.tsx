import { usePomodoro, type PomodoroMode, type PomodoroSettings } from "@/hooks/usePomodoro";
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PomodoroProps {
  initialSettings?: PomodoroSettings;
  onSettingsChange?: (settings: PomodoroSettings) => void;
  spaceId?: string;
  externalState?: any;
}

export function Pomodoro({ initialSettings, onSettingsChange, spaceId, externalState }: PomodoroProps = {}) {
  // If externalState is provided, we don't pass the config to internal hook to avoid conflict/double-init
  const internalState = usePomodoro(externalState ? undefined : { initialSettings, onSettingsChange, spaceId });
  
  const { 
    mode, 
    timeLeft, 
    isActive, 
    settings,
    toggleTimer, 
    resetTimer, 
    changeMode,
    updateSettings 
  } = externalState || internalState;

  const [showSettings, setShowSettings] = useState(false);

  const handleUpdateSettings = (updates: Partial<PomodoroSettings>) => {
    const newSettings = { ...settings, ...updates };
    updateSettings(updates);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const modes: { id: PomodoroMode; label: string }[] = [
    { id: 'work', label: 'Work' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  const progress = (() => {
    const totalSeconds = (
      mode === 'work' ? settings.workDuration :
      mode === 'shortBreak' ? settings.shortBreakDuration :
      settings.longBreakDuration
    ) * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  })();

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Mode Switcher */}
      <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-8">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => changeMode(m.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              mode === m.id 
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" 
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Circular Progress */}
        <div className="w-64 h-64 rounded-full border-8 border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative">
           <svg className="absolute inset-0 transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
             <circle
               cx="50"
               cy="50"
               r="46"
               fill="transparent"
               stroke="currentColor"
               strokeWidth="8"
               className={cn(
                 "text-blue-500 transition-all duration-1000 ease-linear",
                 mode === 'work' ? "text-red-500" : mode === 'shortBreak' ? "text-green-500" : "text-blue-500"
               )}
               strokeDasharray={`${2 * Math.PI * 46}`}
               strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
               strokeLinecap="round"
             />
           </svg>
          
          <div className="text-6xl font-bold font-mono tracking-tighter z-10">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className={cn(
            "p-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-white",
            mode === 'work' ? "bg-red-500 hover:bg-red-600" : mode === 'shortBreak' ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Settings Toggle */}
      {(!spaceId || onSettingsChange) && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <Settings2 size={16} />
          <span className="text-sm">Timer Settings</span>
        </button>
      )}

      {/* Settings Panel */}
      {showSettings && (!spaceId || onSettingsChange) && (
        <div className="w-full mt-6 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500">Work</label>
              <input
                type="number"
                value={settings.workDuration}
                onChange={(e) => handleUpdateSettings({ workDuration: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500">Short Break</label>
              <input
                type="number"
                value={settings.shortBreakDuration}
                onChange={(e) => handleUpdateSettings({ shortBreakDuration: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500">Long Break</label>
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) => handleUpdateSettings({ longBreakDuration: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-600 dark:text-zinc-300">Long Break Interval</label>
              <input
                type="number"
                min="1"
                value={settings.longBreakInterval}
                onChange={(e) => handleUpdateSettings({ longBreakInterval: Number(e.target.value) })}
                className="w-16 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-600 dark:text-zinc-300">Auto-start Breaks</label>
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => handleUpdateSettings({ autoStartBreaks: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-600 dark:text-zinc-300">Auto-start Pomodoros</label>
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => handleUpdateSettings({ autoStartPomodoros: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
