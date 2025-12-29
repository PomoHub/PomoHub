import { X, Trash2, LogOut, AlertTriangle, Timer, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useConfirm } from "@/components/providers/ConfirmProvider";
import { PomodoroSettings } from "@/hooks/usePomodoro";

interface SpaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceName: string;
  isOwner: boolean;
  onDeleteSpace: () => void;
  onLeaveSpace: () => void;
  pomodoroSettings?: PomodoroSettings;
  onUpdatePomodoroSettings?: (newSettings: PomodoroSettings) => void;
}

export function SpaceSettingsModal({
  isOpen,
  onClose,
  spaceName,
  isOwner,
  onDeleteSpace,
  onLeaveSpace,
  pomodoroSettings,
  onUpdatePomodoroSettings
}: SpaceSettingsModalProps) {
  const { confirm } = useConfirm();
  const [settings, setSettings] = useState<PomodoroSettings>(pomodoroSettings || {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  });

  const handleSaveSettings = () => {
    if (onUpdatePomodoroSettings) {
      onUpdatePomodoroSettings(settings);
      onClose();
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white">Space Settings</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6">
                
                {/* Info Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Space Name</label>
                  <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800 text-white">
                    {spaceName}
                  </div>
                </div>

                {/* Pomodoro Settings (Owner Only) */}
                {isOwner && onUpdatePomodoroSettings && (
                  <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                      <Timer size={12} />
                      Timer Settings
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Work Duration (m)</label>
                        <input 
                          type="number" 
                          min="1" max="60"
                          value={settings.workDuration}
                          onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 25})}
                          className="w-full p-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Short Break (m)</label>
                        <input 
                          type="number" 
                          min="1" max="30"
                          value={settings.shortBreakDuration}
                          onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value) || 5})}
                          className="w-full p-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Long Break (m)</label>
                        <input 
                          type="number" 
                          min="1" max="60"
                          value={settings.longBreakDuration}
                          onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 15})}
                          className="w-full p-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Rounds</label>
                        <input 
                          type="number" 
                          min="1" max="10"
                          value={settings.longBreakInterval}
                          onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value) || 4})}
                          className="w-full p-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="w-full flex items-center justify-center gap-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Save size={16} />
                      Save Timer Settings
                    </button>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                  <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={12} />
                    Danger Zone
                  </h3>
                  
                  {isOwner ? (
                    <button
                      onClick={async () => {
                        const isConfirmed = await confirm({
                          title: "Delete Space",
                          message: "Are you sure you want to delete this space? This action cannot be undone.",
                          confirmText: "Delete",
                          variant: "danger"
                        });
                        if (isConfirmed) {
                          onDeleteSpace();
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20"
                    >
                      <Trash2 size={18} />
                      Delete Space
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const isConfirmed = await confirm({
                          title: "Leave Space",
                          message: "Are you sure you want to leave this space?",
                          confirmText: "Leave",
                          variant: "danger"
                        });
                        if (isConfirmed) {
                          onLeaveSpace();
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20"
                    >
                      <LogOut size={18} />
                      Leave Space
                    </button>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
