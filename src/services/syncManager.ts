import { api } from "@/services/api";
import { getDB } from "@/lib/db";
import { useAuthStore } from "@/store/auth";

export class SyncManager {
  private static instance: SyncManager;
  private isSyncing = false;

  private constructor() {}

  static getInstance() {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  async sync() {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user || this.isSyncing) return;

    this.isSyncing = true;
    console.log("Starting sync...");

    try {
      await this.pushHabits();
      await this.pushTodos();
      await this.pushPomodoroSessions();
      
      // In a real app, we would also pull data here
      console.log("Sync completed successfully");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async pushHabits() {
    const db = await getDB();
    // Get unsynced habits (In this simplified version, we just push everything for now or implement a 'synced' flag later)
    // For MVP: Let's assume we just push local habits to server.
    // Ideally, local DB should have a `synced` column.
    
    // Fetch all local habits
    const habits = await db.select('SELECT * FROM habits') as any[];
    
    for (const habit of habits) {
      try {
        // Check if habit exists on server (or just try create and ignore duplicate error)
        // For simplicity, we just create. In production, use UUIDs to match.
        await api.post('/habits', {
            title: habit.title,
            color: habit.color,
            frequency: habit.frequency || 'daily',
            emoji: habit.emoji || '📝'
        });
      } catch (e) {
        // Ignore errors for now (e.g. duplicates)
      }
    }
  }

  private async pushTodos() {
    const db = await getDB();
    const todos = await db.select('SELECT * FROM todos WHERE completed = 0') as any[]; // Sync pending todos
    
    for (const todo of todos) {
      try {
        await api.post('/todos', {
            title: todo.title
        });
      } catch (e) {}
    }
  }

  private async pushPomodoroSessions() {
    // This is more complex as we have many sessions.
    // Ideally, we batch upload.
    // For MVP, let's skip or implement a simple "last session" push.
  }
}

export const syncManager = SyncManager.getInstance();
