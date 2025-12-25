import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { ACHIEVEMENTS, AchievementDef } from '@/lib/achievements';
import { useStats } from './useStats';

export interface UnlockedAchievement {
  id: string;
  unlocked_at: string;
}

export const useAchievements = () => {
  const { stats, loading: statsLoading } = useStats();
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<AchievementDef[]>([]);

  const fetchUnlocked = useCallback(async () => {
    try {
      const db = await getDB();
      const result = await db.select(
        'SELECT * FROM achievements'
      ) as UnlockedAchievement[];
      setUnlocked(result);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  }, []);

  const checkAchievements = useCallback(async () => {
    if (statsLoading) return;

    const db = await getDB();
    const newlyUnlocked: AchievementDef[] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Check if already unlocked
      const isUnlocked = unlocked.some(u => u.id === achievement.id);
      if (isUnlocked) continue;

      // Check condition
      if (achievement.condition(stats)) {
        try {
          // Unlock it
          await db.execute(
            'INSERT INTO achievements (id, title, description, icon, unlocked_at) VALUES (?, ?, ?, ?, ?)',
            [achievement.id, achievement.title, achievement.description, achievement.iconName, new Date().toISOString()]
          );
          newlyUnlocked.push(achievement);
        } catch (error) {
          console.error(`Failed to unlock achievement ${achievement.id}:`, error);
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      setNewUnlocks(newlyUnlocked);
      await fetchUnlocked();
    }
  }, [stats, statsLoading, unlocked]);

  useEffect(() => {
    fetchUnlocked();
  }, [fetchUnlocked]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const clearNewUnlocks = () => setNewUnlocks([]);

  return {
    unlocked,
    newUnlocks,
    clearNewUnlocks,
    allAchievements: ACHIEVEMENTS
  };
};
