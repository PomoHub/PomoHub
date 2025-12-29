import { useState, useEffect, useCallback, useRef } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';
import { 
  sendNotification, 
  requestPermission, 
  isPermissionGranted,
  createChannel,
  channels,
  Importance,
  Visibility
} from '@tauri-apps/plugin-notification';
import { convertFileSrc } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { isMobile } from '@/lib/utils';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_NOTIFICATION_ID = 1001; // Constant ID for timer updates

export interface PomodoroSettings {
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

interface UsePomodoroProps {
  initialSettings?: PomodoroSettings;
  spaceId?: string;
  onSettingsChange?: (settings: PomodoroSettings) => void;
}

export const usePomodoro = (props?: UsePomodoroProps) => {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState((props?.initialSettings?.workDuration || DEFAULT_SETTINGS.workDuration) * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>(props?.initialSettings || DEFAULT_SETTINGS);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Ref for the end time of the current timer
  const endTimeRef = useRef<number | null>(null);
  const lastNotificationUpdateRef = useRef<number>(0);

  // Restore state on mount
  useEffect(() => {
    const storageKey = props?.spaceId ? `pomodoro_state_${props.spaceId}` : 'pomodoro_state';
    const saved = localStorage.getItem(storageKey);
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
  }, [props?.spaceId]);

  // Save state when paused (including timeLeft updates like reset)
  useEffect(() => {
    const storageKey = props?.spaceId ? `pomodoro_state_${props.spaceId}` : 'pomodoro_state';
    if (!isActive) {
       localStorage.setItem(storageKey, JSON.stringify({
          mode,
          isActive: false,
          timeLeft
       }));
    }
  }, [mode, isActive, timeLeft, props?.spaceId]);

  // Request notification permission on mount and setup channel
  useEffect(() => {
    const setupNotifications = async () => {
      let permission = await isPermissionGranted();
      if (!permission) {
        const request = await requestPermission();
        permission = request === 'granted';
      }

      if (permission && isMobile()) {
        try {
          // Check if channel exists or create it
          const currentChannels = await channels();
          const channelExists = currentChannels.some(c => c.id === 'pomodoro_timer_silent');
          
          if (!channelExists) {
            await createChannel({
              id: 'pomodoro_timer_silent',
              name: 'Timer Updates',
              description: 'Silent notifications for timer progress',
              importance: Importance.Low,
              visibility: Visibility.Public,
              vibration: false,
              sound: undefined 
            });
          }
        } catch (error) {
          console.error("Failed to setup notification channel:", error);
        }
      }
    };
    setupNotifications();
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
    if (props?.initialSettings) {
      setSettings(props.initialSettings);
      return;
    }
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
  }, [props?.initialSettings]);

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
    const playBeep = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.error("Failed to play beep", e);
      }
    };

    try {
        const db = await getDB();
        const result = await db.select(
          'SELECT value FROM settings WHERE key = ?', 
          ['notification_sound']
        ) as { value: string }[];
        
        let soundPath = '/notification.mp3';
        if (result.length > 0) {
             const stored = JSON.parse(result[0].value);
             if (stored && stored !== 'default') {
                 // Check if it is a preset or file
                 if (stored.startsWith('http') || stored.startsWith('asset')) {
                    soundPath = stored;
                 } else {
                    soundPath = convertFileSrc(stored);
                 }
             }
        }
        
        const audio = new Audio(soundPath);
        audio.onerror = () => {
             console.warn("Audio load failed, using fallback beep");
             playBeep();
        };
        await audio.play().catch((e) => {
            console.warn("Audio play failed, using fallback beep", e);
            playBeep();
        });
    } catch (e) {
        playBeep();
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
          id: TIMER_NOTIFICATION_ID,
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
          
          // Update Desktop Title
          const mins = Math.floor(diff / 60);
          const secs = diff % 60;
          const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          getCurrentWindow().setTitle(`${timeStr} - ${currentState.mode === 'work' ? 'Focus' : 'Break'} | PomoHub`);

          // Update Mobile Notification (Silent & Persistent if possible)
          // To avoid spamming, we only update every 1 second, and use the same ID
          if (isMobile() && now - lastNotificationUpdateRef.current > 1000) {
             lastNotificationUpdateRef.current = now;
             // On Android/Mobile, sending a new notification with the same ID usually updates it.
             // We use a custom channel with Importance.Low for silent updates
             sendNotification({
                id: TIMER_NOTIFICATION_ID,
                title: currentState.mode === 'work' ? 'Focusing... 🍅' : 'On Break ☕',
                body: `${timeStr} remaining`,
                channelId: 'pomodoro_timer_silent',
             });
          }

        } else {
          // Timer finished
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false); 
          endTimeRef.current = null;
          setTimeLeft(0);
          getCurrentWindow().setTitle('PomoHub');
          
          // Play sound (JS)
          playNotificationSound();
          
          // Send Notification (Native) with Sound
          sendNotification({
            title: currentState.mode === 'work' ? 'Focus Session Complete! 🎉' : 'Break Over! 🚀',
            body: currentState.mode === 'work' ? 'Great job! Take a break.' : 'Time to get back to work!',
            sound: 'default' // Ensure sound plays
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
    
    if (props?.onSettingsChange) {
      props.onSettingsChange(updated);
      return;
    }

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
