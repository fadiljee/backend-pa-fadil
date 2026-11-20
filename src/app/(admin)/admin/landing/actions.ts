"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminSession } from "@/lib/auth/admin-session";
import {
  DEFAULT_LANDING_SETTINGS,
  landingSettingsSchema,
  saveLandingSettings,
} from "@/lib/services/landing-settings";

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
    coursesEyebrow: String(formData.get("coursesEyebrow") ?? ""),
    coursesTitle: String(formData.get("coursesTitle") ?? ""),
    aboutEyebrow: String(formData.get("aboutEyebrow") ?? ""),
    aboutTitle: String(formData.get("aboutTitle") ?? ""),
    aboutParagraph1: String(formData.get("aboutParagraph1") ?? ""),
    aboutParagraph2: String(formData.get("aboutParagraph2") ?? ""),
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
