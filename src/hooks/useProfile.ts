import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  created_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const result = await db.select(
        'SELECT * FROM user_profile WHERE id = 1'
      ) as UserProfile[];
      
      if (result.length > 0) {
        setProfile(result[0]);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const createProfile = async (firstName: string, lastName: string, birthDate: string) => {
    try {
      const db = await getDB();
      await db.execute(
        'INSERT INTO user_profile (id, first_name, last_name, birth_date) VALUES (1, ?, ?, ?)',
        [firstName, lastName, birthDate]
      );
      await fetchProfile();
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  return {
    profile,
    loading,
    createProfile
  };
};
