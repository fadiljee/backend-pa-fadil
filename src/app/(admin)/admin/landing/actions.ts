"use server";

import crypto from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSession } from "@/lib/auth/admin-session";
import {
  DEFAULT_LANDING_SETTINGS,
  getLandingSettings,
  landingSettingsSchema,
  saveLandingSettings,
} from "@/lib/services/landing-settings";
import { deleteImageFile, uploadImageFile } from "@/lib/storage";

export interface LandingFormState {
  status?: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateLandingSettingsAction(
  _prevState: LandingFormState,
  formData: FormData
): Promise<LandingFormState> {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return {
      status: "error",
      message: "Sesi admin berakhir. Silakan masuk kembali.",
    };
  }

  const { settings: currentSettings } = await getLandingSettings();

  let aboutPhotoKey = currentSettings.aboutPhoto;

  if (formData.get("hapusAboutPhoto") === "on" && aboutPhotoKey) {
    await deleteImageFile(aboutPhotoKey);
    aboutPhotoKey = "";
  }

  const aboutPhotoFile = formData.get("aboutPhotoFile");
  if (aboutPhotoFile instanceof File && aboutPhotoFile.size > 0) {
    try {
      const newKey = await uploadImageFile(aboutPhotoFile, "landing_profil");
      if (aboutPhotoKey) {
        await deleteImageFile(aboutPhotoKey);
      }
      aboutPhotoKey = newKey;
    } catch (err) {
      return {
        status: "error",
        message:
          err instanceof Error ? err.message : "Gagal mengunggah foto profil sekolah.",
      };
    }
  }

  const highlightsRaw = [
    String(formData.get("highlight1") ?? "").trim(),
    String(formData.get("highlight2") ?? "").trim(),
    String(formData.get("highlight3") ?? "").trim(),
    String(formData.get("highlight4") ?? "").trim(),
  ].filter(Boolean);

  const payload = {
    schoolName: String(formData.get("schoolName") ?? ""),
    schoolSubtitle: String(formData.get("schoolSubtitle") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroDescription: String(formData.get("heroDescription") ?? ""),
    heroPrimaryCta: String(formData.get("heroPrimaryCta") ?? ""),
    heroSecondaryCta: String(formData.get("heroSecondaryCta") ?? ""),
    showStats: formData.get("showStats") === "on",
    aboutEyebrow: String(formData.get("aboutEyebrow") ?? ""),
    aboutTitle: String(formData.get("aboutTitle") ?? ""),
    aboutParagraph1: String(formData.get("aboutParagraph1") ?? ""),
    aboutParagraph2: String(formData.get("aboutParagraph2") ?? ""),
    aboutPhoto: aboutPhotoKey,
    aboutShowStudentCount: formData.get("aboutShowStudentCount") === "on",
    aboutHighlights: highlightsRaw,
    schoolVision:
      String(formData.get("schoolVision") ?? "").trim() ||
      DEFAULT_LANDING_SETTINGS.schoolVision,
    schoolMissions: (() => {
      const raw = String(formData.get("schoolMissions") ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return raw.length > 0 ? raw : DEFAULT_LANDING_SETTINGS.schoolMissions;
    })(),
    galleryEyebrow: String(formData.get("galleryEyebrow") ?? ""),
    galleryTitle: String(formData.get("galleryTitle") ?? ""),
    galleryTagline: String(formData.get("galleryTagline") ?? ""),
    galleryItems: currentSettings.galleryItems,
    footerDescription: String(formData.get("footerDescription") ?? ""),
    contactAddress: String(formData.get("contactAddress") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    copyrightText: String(formData.get("copyrightText") ?? ""),
  };

  const parsed = landingSettingsSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Periksa kembali isian formulir.",
      fieldErrors,
    };
  }

  const saved = await saveLandingSettings(parsed.data);
  if (!saved.ok) {
    return {
      status: "error",
      message: saved.error,
    };
  }

  revalidateTag("landing-settings");
  revalidatePath("/");
  revalidatePath("/admin/landing");

  return {
    status: "success",
    message: "Pengaturan landing page berhasil disimpan dan langsung diterapkan.",
  };
}

export async function addGalleryItemAction(
  _prevState: LandingFormState,
  formData: FormData
): Promise<LandingFormState> {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return {
      status: "error",
      message: "Sesi admin berakhir. Silakan masuk kembali.",
    };
  }

  const judul = String(formData.get("judul") ?? "").trim();
  if (judul.length < 2 || judul.length > 120) {
    return {
      status: "error",
      message: "Judul foto galeri harus 2–120 karakter.",
    };
  }

  const file = formData.get("gambar");
  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      message: "Pilih file foto (JPG/PNG) terlebih dahulu.",
    };
  }

  const { settings: currentSettings } = await getLandingSettings();
  if (currentSettings.galleryItems.length >= 16) {
    return {
      status: "error",
      message: "Maksimal 16 foto galeri. Hapus foto lama terlebih dahulu.",
    };
  }

  let gambarKey: string;
  try {
    gambarKey = await uploadImageFile(file, "landing_galeri");
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Gagal mengunggah foto galeri.",
    };
  }

  const nextSettings = {
    ...currentSettings,
    galleryItems: [
      ...currentSettings.galleryItems,
      {
        id: crypto.randomUUID(),
        judul,
        gambar: gambarKey,
      },
    ],
  };

  const saved = await saveLandingSettings(nextSettings);
  if (!saved.ok) {
    await deleteImageFile(gambarKey);
    return {
      status: "error",
      message: saved.error,
    };
  }

  revalidateTag("landing-settings");
  revalidatePath("/");
  revalidatePath("/admin/landing");

  return {
    status: "success",
    message: "Foto berhasil ditambahkan ke Galeri Sekolah.",
  };
}

export async function deleteGalleryItemAction(itemId: string): Promise<void> {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return;
  }

  const { settings: currentSettings } = await getLandingSettings();
  const target = currentSettings.galleryItems.find((item) => item.id === itemId);
  if (!target) {
    return;
  }

  const nextSettings = {
    ...currentSettings,
    galleryItems: currentSettings.galleryItems.filter((item) => item.id !== itemId),
  };

  const saved = await saveLandingSettings(nextSettings);
  if (saved.ok) {
    await deleteImageFile(target.gambar);
    revalidateTag("landing-settings");
    revalidatePath("/");
    revalidatePath("/admin/landing");
  }
}
