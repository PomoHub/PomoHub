import { PageContainer } from "@/components/layout/PageContainer";
import { Notes } from "@/components/features/Notes";

export function NotesView() {
  return (
    <PageContainer title="Notes & Sketches" description="Capture ideas, draw diagrams, and attach files.">
      <Notes />
    </PageContainer>
  );
}
