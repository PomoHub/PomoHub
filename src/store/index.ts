import { create } from 'zustand';

type FeatureType = 'pomodoro' | 'habit' | 'calendar' | 'todo' | 'goals' | 'settings' | 'profile' | 'notes' | null;

export type ViewType = 'dashboard' | 'pomodoro' | 'habits' | 'tasks' | 'calendar' | 'notes' | 'spaces' | 'settings' | 'profile';

interface AppState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  activeModal: FeatureType;
  openModal: (feature: FeatureType) => void;
  closeModal: () => void;
  
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;

  notificationSound: string;
  setNotificationSound: (sound: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  activeModal: null,
  openModal: (feature) => set({ activeModal: feature }),
  closeModal: () => set({ activeModal: null }),
  
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  
  backgroundImage: null,
  setBackgroundImage: (url) => set({ backgroundImage: url }),

  notificationSound: 'default',
  setNotificationSound: (sound) => set({ notificationSound: sound }),
}));
