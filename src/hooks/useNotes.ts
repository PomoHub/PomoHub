import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { format } from 'date-fns';

export interface Note {
  id: number;
  title: string;
  content: string;
  drawing: string | null; // JSON string from canvas
  attachments: string | null; // JSON string array of paths
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const data = await db.select(
        'SELECT * FROM notes ORDER BY updated_at DESC'
      ) as Note[];
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (title: string, content: string, drawing?: string, attachments?: string[]) => {
    try {
      const db = await getDB();
      const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      
      await db.execute(
        'INSERT INTO notes (title, content, drawing, attachments, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [title, content, drawing || null, JSON.stringify(attachments || []), now, now]
      );
      await fetchNotes();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const updateNote = async (id: number, title: string, content: string, drawing?: string, attachments?: string[]) => {
    try {
      const db = await getDB();
      const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      
      await db.execute(
        'UPDATE notes SET title = ?, content = ?, drawing = ?, attachments = ?, updated_at = ? WHERE id = ?',
        [title, content, drawing || null, JSON.stringify(attachments || []), now, id]
      );
      await fetchNotes();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const db = await getDB();
      await db.execute('DELETE FROM notes WHERE id = ?', [id]);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    fetchNotes
  };
};
