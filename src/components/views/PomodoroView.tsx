import { PageContainer } from "@/components/layout/PageContainer";
import { Pomodoro } from "@/components/features/Pomodoro";

export function PomodoroView() {
  return (
    <PageContainer title="Focus Timer" description="Stay productive with the Pomodoro technique.">
      <div className="max-w-xl mx-auto">
        <Pomodoro />
      </div>
    </PageContainer>
  );
}
