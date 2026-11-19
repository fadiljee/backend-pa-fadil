import { getLandingSettings } from "@/lib/services/landing-settings";
import { LandingSettingsForm } from "./LandingSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminLandingPage() {
  const { settings, persisted } = await getLandingSettings();

  return <LandingSettingsForm initialSettings={settings} persisted={persisted} />;
}
