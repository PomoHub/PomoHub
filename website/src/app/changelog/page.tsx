import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Changelog - PomoHub",
  description: "Release notes and updates for PomoHub.",
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-50 dark:selection:text-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <ArrowLeft size={20} className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors" />
            <BrandLogo width={120} height={32} />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="https://github.com/PomoHub/PomoHub" 
              target="_blank"
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Github size={20} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Changelog</h1>
          <p className="text-zinc-600 dark:text-zinc-400">All the latest updates, improvements, and fixes.</p>
        </div>

        <div className="space-y-12">
          {/* v0.1.4 */}
          <div className="relative pl-8 border-l border-zinc-200 dark:border-zinc-800">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100 border-2 border-white dark:border-zinc-950 ring-4 ring-zinc-50 dark:ring-zinc-950"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.4</h2>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">Latest</span>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">December 29, 2025</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Major productivity boost with Notes, Macros, and better Notifications!
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">✨ New Features</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Notes & Sketches:</strong> Comprehensive note-taking with support for rich text, freehand drawings, and file attachments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Smart Macros:</strong> Type <code>@create-todo[Buy Milk]</code> inside any note to instantly create a task without leaving the editor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Window Title Timer:</strong> Track your focus time directly from the window title bar on Desktop.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">🚀 Improvements</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Mobile Lock Screen:</strong> Persistent silent notifications keep your timer visible on the lock screen (Android).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Notification Sounds:</strong> Added a fallback mechanism to ensure notification sounds always play, even if files are missing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Desktop Experience:</strong> Eliminated notification spam by optimizing update frequency for desktop environments.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* v0.1.3 */}
          <div className="relative pl-8 border-l border-zinc-200 dark:border-zinc-800">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 border-2 border-white dark:border-zinc-950"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.3</h2>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">December 25, 2025</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Focusing on mobile reliability, notifications, and task management improvements.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">✨ New Features</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Task Reminders:</strong> Set specific date and time reminders for your tasks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Custom Sounds:</strong> Upload your own custom notification sounds (.mp3, .wav).</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">🚀 Improvements</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Background Timer:</strong> Pomodoro timer now works reliably in the background on Android.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0"></span>
                    <span><strong>Native Notifications:</strong> Better integration with system notification centers on Windows and Android.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* v0.1.2 */}
          <div className="relative pl-8 border-l border-zinc-200 dark:border-zinc-800">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 border-2 border-white dark:border-zinc-950"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.2</h2>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">December 23, 2025</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Introducing personalization, gamification, and mobile support!
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">✨ New Features</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>User Profiles:</strong> Create a personalized profile with your name and birthday.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Birthday Celebration:</strong> A special confetti surprise on your birthday! 🎉</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Profile Page:</strong> View detailed statistics including total focus time, habits completed, and current streak.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Achievements System:</strong> Unlock badges for milestones like &quot;100 Hours of Focus&quot; or &quot;50 Day Streak&quot;.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Seasonal Effects:</strong> Enjoy a cozy winter atmosphere with a subtle snowfall effect (active Dec-Feb).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Custom Sounds:</strong> Choose from multiple notification sounds (Soft Bell, Digital, Nature, etc.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Android Support:</strong> Initial support for Android devices via Tauri Mobile.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* v0.1.1 */}
          <div className="relative pl-8 border-l border-zinc-200 dark:border-zinc-800">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 border-2 border-white dark:border-zinc-950"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.1</h2>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">December 23, 2025</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                A significant update focusing on stability, database reliability, and user experience improvements.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">✨ New Features</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Auto-transition:</strong> Pomodoro timer now automatically switches between Work, Short Break, and Long Break modes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Configurable Long Break:</strong> Added setting to customize how many work sessions trigger a long break (default: 4).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Sound Notifications:</strong> Added a gentle notification sound when the timer completes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Reset Data:</strong> Added a &quot;Reset All Data&quot; option in Settings to clear the database and start fresh.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">🐛 Bug Fixes</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Database Connection:</strong> Fixed a critical race condition that prevented creating new Habits, Todos, and Goals on startup.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Timezone Issues:</strong> Fixed a bug where activities were logged to the previous day due to UTC/Local time mismatches.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Calendar Stats:</strong> Resolved an issue where daily statistics (completed habits, focus time) were not appearing in the calendar view.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Theme Switching:</strong> Fixed dark mode not applying correctly to all UI elements.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* v0.1.0 */}
          <div className="relative pl-8 border-l border-zinc-200 dark:border-zinc-800">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 border-2 border-white dark:border-zinc-950"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.0</h2>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">December 22, 2025</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Initial public release.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">🚀 Initial Release</h3>
                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Pomodoro Timer:</strong> Customizable work/break intervals with circular progress visualization.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Habit Tracker:</strong> Daily habit tracking with streak visualization and color coding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Calendar:</strong> Monthly view of productivity with daily activity insights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Todo List:</strong> Simple task management with due dates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Goals:</strong> Long-term goal tracking with progress bars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Customization:</strong> Light/Dark mode and custom background image support.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
