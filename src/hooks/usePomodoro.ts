import { useState, useEffect, useCallback, useRef } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';
import { sendNotification, requestPermission, isPermissionGranted } from '@tauri-apps/plugin-notification';
import { convertFileSrc } from '@tauri-apps/api/core';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';


interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // Number of work sessions before long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const usePomodoro = () => {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Ref for the end time of the current timer
  const endTimeRef = useRef<number | null>(null);

  // Restore state on mount
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro_state');
    if (saved) {
      try {
        const { mode: savedMode, endTime, isActive: savedIsActive, timeLeft: savedTimeLeft } = JSON.parse(saved);
        if (savedMode) setMode(savedMode);
        
        if (savedIsActive && endTime) {
           const now = Date.now();
           const diff = Math.ceil((endTime - now) / 1000);
           if (diff > 0) {
             setTimeLeft(diff);
             setIsActive(true);
             endTimeRef.current = endTime;
           } else {
             // Timer finished while closed
             setTimeLeft(0);
             setIsActive(false);
           }
        } else if (!savedIsActive && savedTimeLeft) {
           setTimeLeft(savedTimeLeft);
           setIsActive(false);
        }
      } catch (e) {
        console.error("Failed to restore state", e);
      }
    }
  }, []);

  // Save state when paused (including timeLeft updates like reset)
  useEffect(() => {
    if (!isActive) {
       localStorage.setItem('pomodoro_state', JSON.stringify({
          mode,
          isActive: false,
          timeLeft
       }));
    }
  }, [mode, isActive, timeLeft]);

  // Request notification permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      let permission = await isPermissionGranted();
      if (!permission) {
        const request = await requestPermission();
        permission = request === 'granted';
      }
    };
    checkPermission();
  }, []);

  // Use refs to access latest state inside interval/timeouts without dependency issues
  const stateRef = useRef({
    mode,
    timeLeft,
    isActive,
    settings,
    sessionsCompleted
  });

  // Keep refs updated
  useEffect(() => {
    stateRef.current = { mode, timeLeft, isActive, settings, sessionsCompleted };
  }, [mode, timeLeft, isActive, settings, sessionsCompleted]);

  // Use a ref for the timer interval to clear it properly
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load settings from DB on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const db = await getDB();
        const result = await db.select(
          'SELECT value FROM settings WHERE key = ?', 
          ['pomodoro_settings']
        ) as { value: string }[];
        
        if (result.length > 0) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(result[0].value) });
        }
      } catch (error) {
        console.error('Failed to load pomodoro settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Update timeLeft when mode or settings change (only if not active)
  useEffect(() => {
    if (!isActive) {
      const duration = 
        mode === 'work' ? settings.workDuration :
        mode === 'shortBreak' ? settings.shortBreakDuration :
        settings.longBreakDuration;
      setTimeLeft(duration * 60);
      endTimeRef.current = null;
    }
  }, [mode, settings, isActive]);

  const saveSession = useCallback(async (duration: number) => {
    try {
      const db = await getDB();
      // Store local time for created_at to avoid timezone shifts
      const createdAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      
      await db.execute(
        'INSERT INTO pomodoro_sessions (duration, label, completed_at) VALUES (?, ?, ?)',
        [duration, 'Work Session', createdAt]
      );
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

  const switchMode = useCallback((newMode: PomodoroMode) => {
    setMode(newMode);
    // timeLeft will be updated by the useEffect listening to 'mode'
  }, []);

  const playNotificationSound = useCallback(async () => {
    // Check if there is a custom sound in settings
    try {
        const db = await getDB();
        const result = await db.select(
          'SELECT value FROM settings WHERE key = ?', 
          ['notification_sound']
        ) as { value: string }[];
        
        let soundPath = '/notification.mp3';
        if (result.length > 0) {
             const stored = JSON.parse(result[0].value);
             // Presets
             if (stored === 'bell') soundPath = '/sounds/bell.mp3'; // Example mapping if we had files
             else if (stored === 'digital') soundPath = '/sounds/digital.mp3';
             else if (stored === 'nature') soundPath = '/sounds/nature.mp3';
             else if (stored !== 'default') {
                 // It's a custom path
                 soundPath = convertFileSrc(stored);
             }
        }
        const audio = new Audio(soundPath);
        audio.play().catch(() => {});
    } catch (e) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      // If we don't have an endTime yet (just started or resumed), calculate it
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
        
        // Calculate end time string
        const endDate = new Date(endTimeRef.current);
        const endStr = endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Send notification on start
        sendNotification({
          title: stateRef.current.mode === 'work' ? 'Focus Started 🍅' : 'Break Started ☕',
          body: `Timer set for ${Math.floor(timeLeft / 60)} minutes. Ends at ${endStr}.`,
          sound: 'default'
        });

        // Persist active state
        localStorage.setItem('pomodoro_state', JSON.stringify({
          mode: stateRef.current.mode,
          isActive: true,
          endTime: endTimeRef.current
        }));
      }

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const currentState = stateRef.current;
        const now = Date.now();
        const target = endTimeRef.current!;
        const diff = Math.ceil((target - now) / 1000);
        
        if (diff > 0) {
          setTimeLeft(diff);
          // Optional: Update notification periodically? (Maybe every minute)
          // Doing it every second is too heavy for JS -> Native bridge usually
        } else {
          // Timer finished
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false); 
          endTimeRef.current = null;
          setTimeLeft(0);
          
          // Play sound
          playNotificationSound();
          
          // Send Notification
          sendNotification({
            title: currentState.mode === 'work' ? 'Focus Session Complete! 🎉' : 'Break Over! 🚀',
            body: currentState.mode === 'work' ? 'Great job! Take a break.' : 'Time to get back to work!',
          });

          const { mode, settings, sessionsCompleted } = currentState;

          if (mode === 'work') {
            saveSession(settings.workDuration);
            const newSessionsCompleted = sessionsCompleted + 1;
            setSessionsCompleted(newSessionsCompleted);

            // Decide next mode
            let nextMode: PomodoroMode = 'shortBreak';
            if (newSessionsCompleted % settings.longBreakInterval === 0) {
              nextMode = 'longBreak';
            }

            switchMode(nextMode);
            if (settings.autoStartBreaks) {
               // Small delay to allow state updates to settle
               setTimeout(() => setIsActive(true), 100);
            }
          } else {
            // Break finished
            switchMode('work');
            if (settings.autoStartPomodoros) {
               setTimeout(() => setIsActive(true), 100);
            }
          }
        }
      }, 200); // Check more frequently than 1s to be accurate, but update state based on diff
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // If paused, we keep endTimeRef null so when resumed it recalculates based on current timeLeft
      endTimeRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, saveSession, switchMode, playNotificationSound]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    endTimeRef.current = null;
    const duration = 
      mode === 'work' ? settings.workDuration :
      mode === 'shortBreak' ? settings.shortBreakDuration :
      settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const changeMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsActive(false);
    endTimeRef.current = null;
  };

  const updateSettings = async (newSettings: Partial<PomodoroSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Save to DB
    try {
      const db = await getDB();
      await db.execute(
        `INSERT INTO settings (key, value) VALUES ('pomodoro_settings', ?) 
         ON CONFLICT(key) DO UPDATE SET value = ?`,
        [JSON.stringify(updated), JSON.stringify(updated)]
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return {
    mode,
    timeLeft,
    isActive,
    settings,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    changeMode,
    updateSettings
  };
};
