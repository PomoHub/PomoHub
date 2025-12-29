import { PageContainer } from "@/components/layout/PageContainer";
import { Settings } from "@/components/features/Settings";

export function SettingsView() {
  return (
    <PageContainer title="Settings" description="Customize your experience.">
      <Settings />
    </PageContainer>
  );
}
