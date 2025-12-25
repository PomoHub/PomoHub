import { useEffect, useRef } from 'react';
import { getDB } from '@/lib/db';
import { sendNotification } from '@tauri-apps/plugin-notification';

export function ReminderManager() {
  const sentRemindersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = async () => {
      try {
        const db = await getDB();
        const todos = await db.select<{id: number, title: string, reminder_time: string}[]>(
          "SELECT id, title, reminder_time FROM todos WHERE completed = 0 AND reminder_time IS NOT NULL"
        );

        const now = new Date();
        
        todos.forEach(async (todo) => {
          const reminderTime = new Date(todo.reminder_time);
          const timeKey = `${todo.id}-${reminderTime.getTime()}`;

          // Check if reminder is due (within the current minute)
          if (
             reminderTime.getFullYear() === now.getFullYear() &&
             reminderTime.getMonth() === now.getMonth() &&
             reminderTime.getDate() === now.getDate() &&
             reminderTime.getHours() === now.getHours() &&
             reminderTime.getMinutes() === now.getMinutes()
          ) {
             if (!sentRemindersRef.current.has(timeKey)) {
                // Send notification
                await sendNotification({
                    title: "Task Reminder 🔔",
                    body: todo.title
                });
                
                sentRemindersRef.current.add(timeKey);
                
                // Optional: Play sound
                const audio = new Audio('/notification.mp3');
                audio.play().catch(() => {});
             }
          }
        });
        
        // Cleanup old keys from ref to prevent memory leak (optional, but good practice)
        // For simplicity, we can clear the set if it gets too large or just leave it as session cache
      } catch (e) {
        console.error("Reminder check failed", e);
      }
    };

    // Align check to the start of the minute to be more precise? 
    // Just checking every 10 seconds is safer to catch the minute transition.
    const interval = setInterval(checkReminders, 10000); 
    
    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, []);

  return null;
}
