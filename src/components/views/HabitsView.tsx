import { PageContainer } from "@/components/layout/PageContainer";
import { HabitTracker } from "@/components/features/HabitTracker";

export function HabitsView() {
  return (
    <PageContainer title="Habit Tracker" description="Build consistency and track your streaks.">
      <HabitTracker />
    </PageContainer>
  );
}
