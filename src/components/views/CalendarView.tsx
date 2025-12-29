import { PageContainer } from "@/components/layout/PageContainer";
import { Calendar } from "@/components/features/Calendar";

export function CalendarView() {
  return (
    <PageContainer title="Calendar" description="Visualize your productivity history.">
      <Calendar />
    </PageContainer>
  );
}
