import { useSettings } from "@/hooks/useSettings";
import { Moon, Sun, Monitor, Image as ImageIcon, Trash2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Settings() {
  const { 
    theme, 
    updateTheme, 
    selectBackgroundImage, 
    clearBackgroundImage, 
    backgroundImage, 
    resetDatabase,
    notificationSound,
    updateNotificationSound,
    selectNotificationSound
  } = useSettings();

  const sounds = [
    { id: 'default', label: 'Default Beep' },
    { id: 'bell', label: 'Soft Bell' },
    { id: 'digital', label: 'Digital' },
    { id: 'nature', label: 'Nature' },
  ];

  const handleReset = async () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      await resetDatabase();
      alert("Database has been reset. Please restart the application.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Theme Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Appearance</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => updateTheme('light')}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
              theme === 'light'
                ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            )}
          >
            <Sun size={24} />
            <span className="text-sm font-medium">Light</span>
          </button>
          
          <button
            onClick={() => updateTheme('dark')}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
              theme === 'dark'
                ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            )}
          >
            <Moon size={24} />
            <span className="text-sm font-medium">Dark</span>
          </button>

          <button
            onClick={() => updateTheme('system')}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
              theme === 'system'
                ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            )}
          >
            <Monitor size={24} />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </section>

      {/* Background Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Background</h3>
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
              {backgroundImage ? (
                <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Custom Wallpaper
              </p>
              <p className="text-xs text-zinc-500 mb-3">
                Select an image from your device to use as the background.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={selectBackgroundImage}
                  className="px-3 py-1.5 text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Choose Image
                </button>
                {backgroundImage && (
                  <button
                    onClick={clearBackgroundImage}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove background"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sound Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Sound</h3>
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Notification Sound
              </p>
              <p className="text-xs text-zinc-500">
                Choose the sound to play when a timer finishes.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => updateNotificationSound(sound.id)}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg border transition-all text-left",
                  notificationSound === sound.id
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                )}
              >
                {sound.label}
              </button>
            ))}
            
            <button
                onClick={selectNotificationSound}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg border transition-all text-left col-span-2 flex items-center justify-between",
                  !sounds.some(s => s.id === notificationSound)
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                )}
              >
                <span>
                    {!sounds.some(s => s.id === notificationSound) && notificationSound ? 'Custom Sound Selected' : 'Custom Sound...'}
                </span>
                {!sounds.some(s => s.id === notificationSound) && notificationSound && <span className="text-xs opacity-70 truncate max-w-37.5">{notificationSound}</span>}
            </button>
          </div>
        </div>
      </section>

      {/* Reset Data Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Data Management</h3>
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Reset Application Data
              </p>
              <p className="text-xs text-zinc-500">
                Delete all habits, todos, goals, and settings.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </section>

      <div className="pt-8 text-center">
        <p className="text-xs text-zinc-400">
          PomoHub v0.1.3 • Built with Tauri & React
        </p>
      </div>
    </div>
  );
}
