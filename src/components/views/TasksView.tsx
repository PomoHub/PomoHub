import { PageContainer } from "@/components/layout/PageContainer";
import { TodoList } from "@/components/features/TodoList";

export function TasksView() {
  return (
    <PageContainer title="Tasks" description="Manage your daily todos and reminders.">
      <TodoList />
    </PageContainer>
  );
}
