import { getLandingSettings } from "@/lib/services/landing-settings";
import { getGambarUrl } from "@/lib/storage";
import { LandingSettingsForm } from "./LandingSettingsForm";
import { GalleryManager } from "./GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminLandingPage() {
  const { settings, persisted } = await getLandingSettings();

  const aboutPhotoUrl = getGambarUrl(settings.aboutPhoto);
  const galleryPreviewItems = settings.galleryItems.map((item) => ({
    ...item,
    url: getGambarUrl(item.gambar),
  }));

  return (
    <div className="space-y-6">
      <LandingSettingsForm
        initialSettings={settings}
        persisted={persisted}
        aboutPhotoUrl={aboutPhotoUrl}
      />
      <GalleryManager items={galleryPreviewItems} />
    </div>
  );
}
