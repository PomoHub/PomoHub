import { useSettings } from "@/hooks/useSettings";
import { Moon, Sun, Monitor, Image as ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Settings() {
  const { theme, updateTheme, selectBackgroundImage, clearBackgroundImage, backgroundImage } = useSettings();

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
            <div className="w-20 h-20 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
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
                Select an image from your computer to use as the background.
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

      <div className="pt-8 text-center">
        <p className="text-xs text-zinc-400">
          Pomodoro Habit v0.1.1 • Built with Tauri & React
        </p>
      </div>
    </div>
  );
}
