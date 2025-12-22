import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { useAppStore } from '@/store';
import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';

export const useSettings = () => {
  const { theme, setTheme, backgroundImage, setBackgroundImage } = useAppStore();
  const [loading, setLoading] = useState(true);

  // Helper to read file as Base64
  const loadFileAsBase64 = async (path: string): Promise<string | null> => {
    try {
      const contents = await readFile(path);
      const base64 = btoa(
        new Uint8Array(contents).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      // Guess mime type based on extension
      const ext = path.split('.').pop()?.toLowerCase();
      let mime = 'image/jpeg';
      if (ext === 'png') mime = 'image/png';
      if (ext === 'webp') mime = 'image/webp';
      if (ext === 'svg') mime = 'image/svg+xml';
      
      return `data:${mime};base64,${base64}`;
    } catch (error) {
      console.error("Failed to read file:", path, error);
      return null;
    }
  };

  // Load settings from DB on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const db = await getDB();
        const result = await db.select<{ key: string, value: string }[]>('SELECT * FROM settings WHERE key IN (?, ?)', ['theme', 'background_image']);
        
        for (const row of result) {
          if (row.key === 'theme') {
            setTheme(JSON.parse(row.value));
          } else if (row.key === 'background_image') {
            const savedValue = JSON.parse(row.value);
            // If it looks like a path (not data URI), try to load it
            if (savedValue && !savedValue.startsWith('data:')) {
                 const dataUri = await loadFileAsBase64(savedValue);
                 if (dataUri) setBackgroundImage(dataUri);
            } else {
                 // Already a data URI or invalid
                 setBackgroundImage(savedValue);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [setTheme, setBackgroundImage]);

  // Sync theme with HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const updateTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    try {
      const db = await getDB();
      await db.execute(
        `INSERT INTO settings (key, value) VALUES ('theme', ?) 
         ON CONFLICT(key) DO UPDATE SET value = ?`,
        [JSON.stringify(newTheme), JSON.stringify(newTheme)]
      );
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const selectBackgroundImage = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg', 'jpeg', 'webp']
        }]
      });

      if (selected && typeof selected === 'string') {
        // Load and set immediately for UI feedback
        const dataUri = await loadFileAsBase64(selected);
        if (dataUri) {
            setBackgroundImage(dataUri);
        }

        // Save raw path to DB (so we don't bloat DB with base64, re-read on load)
        const db = await getDB();
        await db.execute(
          `INSERT INTO settings (key, value) VALUES ('background_image', ?) 
           ON CONFLICT(key) DO UPDATE SET value = ?`,
          [JSON.stringify(selected), JSON.stringify(selected)]
        );
      }
    } catch (error) {
      console.error('Failed to select image:', error);
    }
  };

  const clearBackgroundImage = async () => {
    setBackgroundImage(null);
    try {
      const db = await getDB();
      await db.execute("DELETE FROM settings WHERE key = 'background_image'");
    } catch (error) {
      console.error('Failed to clear background image:', error);
    }
  };

  return {
    theme,
    updateTheme,
    selectBackgroundImage,
    clearBackgroundImage,
    backgroundImage,
    loading
  };
};
