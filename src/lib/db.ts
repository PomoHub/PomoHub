import Database from "@tauri-apps/plugin-sql";

const DB_NAME = "pomodoro_habit.db";
let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

export const initDB = async () => {
  if (dbInstance) return dbInstance;
  
  // If initialization is already in progress, return the existing promise
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const db = await Database.load(`sqlite:${DB_NAME}`);
      
      // Create Tables
      await db.execute(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0,
          due_date TEXT,
          reminder_time TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Migration: Add reminder_time column if it doesn't exist
      try {
        await db.execute(`ALTER TABLE todos ADD COLUMN reminder_time TEXT;`);
      } catch (e) {
        // Column likely already exists
      }

      await db.execute(`
        CREATE TABLE IF NOT EXISTS habits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          frequency TEXT DEFAULT 'daily',
          color TEXT DEFAULT '#3b82f6',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS habit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          habit_id INTEGER,
          date TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0,
          FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          duration INTEGER NOT NULL,
          completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
          label TEXT
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          target_date TEXT,
          progress INTEGER DEFAULT 0,
          total INTEGER DEFAULT 100,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          first_name TEXT,
          last_name TEXT,
          birth_date TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS achievements (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          unlocked_at TEXT
        );
      `);

      console.log("Database initialized successfully");
      dbInstance = db;
      return db;
    } catch (error) {
      console.error("Failed to initialize database:", error);
      initPromise = null; // Reset promise on failure so we can retry
      throw error;
    }
  })();

  return initPromise;
};

export const getDB = async () => {
  if (dbInstance) return dbInstance;
  return await initDB();
};
