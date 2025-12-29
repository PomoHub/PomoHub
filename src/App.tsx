import { useEffect, useState } from "react";
import { useAppStore } from "./store";
import { useAuthStore } from "./store/auth";
import { initDB } from "./lib/db";
import { MainLayout } from "@/components/layout/MainLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { isMobile } from "@/lib/utils";

// Views
import { AuthView } from "@/components/views/AuthView";
import { Dashboard } from "@/components/views/Dashboard";
import { MobileDashboard } from "@/components/views/MobileDashboard";
import { PomodoroView } from "@/components/views/PomodoroView";
import { HabitsView } from "@/components/views/HabitsView";
import { TasksView } from "@/components/views/TasksView";
import { CalendarView } from "@/components/views/CalendarView";
import { NotesView } from "@/components/views/NotesView";
import { SpacesView } from "@/components/views/SpacesView";
import { SettingsView } from "@/components/views/SettingsView";
import { ProfileView } from "@/components/views/ProfileView";
import { MobileSocialView } from "@/components/views/MobileSocialView";

// Features & Effects
import { SeasonalSnowfall } from "@/components/features/SeasonalSnowfall";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { BirthdayCelebration } from "@/components/onboarding/BirthdayCelebration";
import { AchievementToast } from "@/components/features/AchievementToast";
import { ReminderManager } from "@/components/features/ReminderManager";

import { syncManager } from "@/services/syncManager";

function App() {
  const { currentView, theme } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    initDB();
    // Initialize theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Auto Sync on Auth
  useEffect(() => {
    if (isAuthenticated) {
      syncManager.sync();
    }
  }, [isAuthenticated]);

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // Auth Guard
  if (!isAuthenticated) {
    return <AuthView />;
  }

  const renderView = () => {
    // Mobile specific overrides
    if (isMobileDevice) {
        if (currentView === 'dashboard') return <MobileDashboard />;
        if (currentView === 'social') return <MobileSocialView />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'pomodoro': return <PomodoroView />;
      case 'habits': return <HabitsView />;
      case 'tasks': return <TasksView />;
      case 'calendar': return <CalendarView />;
      case 'notes':
        return <NotesView />;
      case 'spaces':
        return <SpacesView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {isMobileDevice ? (
        <MobileLayout>
            {renderView()}
        </MobileLayout>
      ) : (
        <MainLayout>
            {renderView()}
        </MainLayout>
      )}

      {/* Global Overlays */}
      <SeasonalSnowfall />
      <OnboardingModal />
      <BirthdayCelebration />
      <AchievementToast />
      <ReminderManager />
    </>
  );
}

export default App;
