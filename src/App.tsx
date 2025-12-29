import { useEffect, useState } from "react";
import { useAppStore } from "./store";
import { initDB } from "./lib/db";
import { Modal } from "./components/ui/Modal";
import { 
  Timer, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  ListTodo, 
  Target, 
  Settings as SettingsIcon,
  User,
  StickyNote
} from "lucide-react";

import { Pomodoro } from "@/components/features/Pomodoro";
import { HabitTracker } from "@/components/features/HabitTracker";
import { Calendar } from "@/components/features/Calendar";
import { TodoList } from "@/components/features/TodoList";
import { Goals } from "@/components/features/Goals";
import { Settings } from "@/components/features/Settings";
import { Profile } from "@/components/features/Profile";
import { Notes } from "@/components/features/Notes";
import { useSettings } from "@/hooks/useSettings";
import { SeasonalSnowfall } from "@/components/features/SeasonalSnowfall";

import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { BirthdayCelebration } from "@/components/onboarding/BirthdayCelebration";
import { AchievementToast } from "@/components/features/AchievementToast";
import { ReminderManager } from "@/components/features/ReminderManager";

function App() {
  const { activeModal, openModal, closeModal } = useAppStore();
  const { backgroundImage } = useSettings(); 
  const [dbStatus, setDbStatus] = useState<"loading" | "connected" | "error">("loading");

  // Disable context menu (right-click) globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    initDB()
      .then(() => setDbStatus("connected"))
      .catch((err) => {
        console.error("DB Init Error:", err);
        setDbStatus("error");
      });
  }, []);

  const features = [
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer, color: 'bg-red-500' },
    { id: 'habit', label: 'Habits', icon: CheckSquare, color: 'bg-green-500' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, color: 'bg-blue-500' },
    { id: 'todo', label: 'Todos', icon: ListTodo, color: 'bg-orange-500' },
    { id: 'goals', label: 'Goals', icon: Target, color: 'bg-purple-500' },
    { id: 'notes', label: 'Notes', icon: StickyNote, color: 'bg-yellow-500' },
    { id: 'profile', label: 'Profile', icon: User, color: 'bg-indigo-500' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, color: 'bg-zinc-500' },
  ] as const;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Background Image Layer */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay for readability if background exists */}
      {backgroundImage && <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-[2px]" />}

      <SeasonalSnowfall />
      <OnboardingModal />
      <BirthdayCelebration />
      <AchievementToast />
      <ReminderManager />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {dbStatus === "error" && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Database Connection Failed. Please restart the app or check permissions.
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center text-transparent bg-clip-text bg-linear-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 drop-shadow-sm select-none">
          Focus & Achieve
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => openModal(feature.id)}
              className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20 dark:border-zinc-800/50"
            >
              <div className={`p-4 rounded-2xl ${feature.color} text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={32} />
              </div>
              <span className="text-lg font-medium text-zinc-800 dark:text-zinc-200">{feature.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'pomodoro'} 
        onClose={closeModal} 
        title="Pomodoro Timer"
      >
        <Pomodoro />
      </Modal>

      <Modal 
        isOpen={activeModal === 'habit'} 
        onClose={closeModal} 
        title="Habit Tracker"
      >
        <HabitTracker />
      </Modal>

      <Modal 
        isOpen={activeModal === 'calendar'} 
        onClose={closeModal} 
        title="Calendar"
        className="max-w-4xl"
      >
        <Calendar />
      </Modal>

      <Modal 
        isOpen={activeModal === 'todo'} 
        onClose={closeModal} 
        title="Tasks"
      >
        <TodoList />
      </Modal>

      <Modal 
        isOpen={activeModal === 'goals'} 
        onClose={closeModal} 
        title="Goals"
      >
        <Goals />
      </Modal>

      <Modal 
        isOpen={activeModal === 'notes'} 
        onClose={closeModal} 
        title="Notes & Sketches"
        className="max-w-4xl"
      >
        <Notes />
      </Modal>

      <Modal 
        isOpen={activeModal === 'profile'} 
        onClose={closeModal} 
        title="My Profile"
        className="max-w-2xl"
      >
        <Profile />
      </Modal>

      <Modal 
        isOpen={activeModal === 'settings'} 
        onClose={closeModal} 
        title="Settings"
      >
        <Settings />
      </Modal>
    </div>
  );
}

export default App;
