"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";
import { LandingSettings } from "@/lib/services/landing-settings";
import { LandingFormState, updateLandingSettingsAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: LandingFormState = {};

interface LandingSettingsFormProps {
  initialSettings: LandingSettings;
  persisted: boolean;
}

export function LandingSettingsForm({
  initialSettings,
  persisted,
}: LandingSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateLandingSettingsAction,
    initialState
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});

  function handleFieldBlur(
    fieldName: string,
    el: HTMLInputElement | HTMLTextAreaElement
  ) {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    setInvalidFields((prev) => ({ ...prev, [fieldName]: !el.validity.valid }));
  }

  function getFieldAriaProps(fieldName: string, hintId?: string) {
    const serverError = state.fieldErrors?.[fieldName];
    const clientInvalid = touchedFields[fieldName] && invalidFields[fieldName];
    const isInvalid = Boolean(serverError || clientInvalid);
    const errorId = `${fieldName}-error`;
    const describedBy = [hintId, isInvalid ? errorId : undefined]
      .filter(Boolean)
      .join(" ");

    return {
      "aria-invalid": isInvalid || undefined,
      "aria-describedby": describedBy || undefined,
      errorId,
      serverError,
      clientInvalid,
    };
  }

  const emailAria = getFieldAriaProps("contactEmail", "contactEmail-hint");
  const schoolNameAria = getFieldAriaProps("schoolName");
  const heroTitleAria = getFieldAriaProps("heroTitle");

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan Landing Page</h1>
          <p className="mt-1 text-sm text-slate-600">
            Atur seluruh teks, keunggulan sekolah, dan kontak yang tampil di halaman utama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>Lihat Landing Page</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="min-h-11 cursor-pointer bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>

      {!persisted && !state.status && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
          <span>
            Landing page saat ini memakai nilai bawaan. Klik <strong>Simpan Perubahan</strong>{" "}
            untuk menyimpan pengaturan ke database.
          </span>
        </div>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      )}

      {state.status === "success" && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      )}

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            1. Identitas Sekolah (Navbar &amp; Footer)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="schoolName" className="text-sm font-semibold text-slate-800">
              Nama Sekolah
            </Label>
            <Input
              id="schoolName"
              name="schoolName"
              required
              minLength={2}
              maxLength={80}
              defaultValue={initialSettings.schoolName}
              onBlur={(e) => handleFieldBlur("schoolName", e.currentTarget)}
              aria-invalid={schoolNameAria["aria-invalid"]}
              aria-describedby={schoolNameAria["aria-describedby"]}
              className="validated-field min-h-11"
            />
            {(schoolNameAria.serverError || schoolNameAria.clientInvalid) && (
              <p id={schoolNameAria.errorId} className="text-xs font-medium text-red-700">
                {schoolNameAria.serverError ?? "Nama sekolah wajib diisi minimal 2 karakter."}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="schoolSubtitle" className="text-sm font-semibold text-slate-800">
              Subjudul Portal
            </Label>
            <Input
              id="schoolSubtitle"
              name="schoolSubtitle"
              required
              minLength={2}
              maxLength={80}
              defaultValue={initialSettings.schoolSubtitle}
              className="validated-field min-h-11"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            2. Bagian Hero (Atas Halaman)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="heroTitle" className="text-sm font-semibold text-slate-800">
              Judul Utama (H1)
            </Label>
            <Input
              id="heroTitle"
              name="heroTitle"
              required
              minLength={5}
              maxLength={160}
              defaultValue={initialSettings.heroTitle}
              onBlur={(e) => handleFieldBlur("heroTitle", e.currentTarget)}
              aria-invalid={heroTitleAria["aria-invalid"]}
              aria-describedby={heroTitleAria["aria-describedby"]}
              className="validated-field min-h-11"
            />
            {(heroTitleAria.serverError || heroTitleAria.clientInvalid) && (
              <p id={heroTitleAria.errorId} className="text-xs font-medium text-red-700">
                {heroTitleAria.serverError ?? "Judul hero wajib diisi minimal 5 karakter."}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heroDescription" className="text-sm font-semibold text-slate-800">
              Deskripsi Hero
            </Label>
            <Textarea
              id="heroDescription"
              name="heroDescription"
              required
              minLength={10}
              maxLength={320}
              rows={3}
              defaultValue={initialSettings.heroDescription}
              className="validated-field"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="heroPrimaryCta" className="text-sm font-semibold text-slate-800">
                Teks Tombol Utama
              </Label>
              <Input
                id="heroPrimaryCta"
                name="heroPrimaryCta"
                required
                minLength={2}
                maxLength={40}
                defaultValue={initialSettings.heroPrimaryCta}
                className="validated-field min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="heroSecondaryCta" className="text-sm font-semibold text-slate-800">
                Teks Tombol Sekunder (Pengunjung)
              </Label>
              <Input
                id="heroSecondaryCta"
                name="heroSecondaryCta"
                required
                minLength={2}
                maxLength={40}
                defaultValue={initialSettings.heroSecondaryCta}
                className="validated-field min-h-11"
              />
            </div>
          </div>

          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              name="showStats"
              defaultChecked={initialSettings.showStats}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span>Tampilkan ringkasan jumlah siswa aktif dan materi aktif di Hero</span>
          </label>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            3. Bagian Materi &amp; Galeri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="coursesEyebrow" className="text-sm font-semibold text-slate-800">
                Label Section Materi
              </Label>
              <Input
                id="coursesEyebrow"
                name="coursesEyebrow"
                required
                minLength={2}
                maxLength={40}
                defaultValue={initialSettings.coursesEyebrow}
                className="validated-field min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coursesTitle" className="text-sm font-semibold text-slate-800">
                Judul Section Materi
              </Label>
              <Input
                id="coursesTitle"
                name="coursesTitle"
                required
                minLength={4}
                maxLength={120}
                defaultValue={initialSettings.coursesTitle}
                className="validated-field min-h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="galleryEyebrow" className="text-sm font-semibold text-slate-800">
                Label Section Galeri
              </Label>
              <Input
                id="galleryEyebrow"
                name="galleryEyebrow"
                required
                minLength={2}
                maxLength={40}
                defaultValue={initialSettings.galleryEyebrow}
                className="validated-field min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="galleryTitle" className="text-sm font-semibold text-slate-800">
                Judul Section Galeri
              </Label>
              <Input
                id="galleryTitle"
                name="galleryTitle"
                required
                minLength={4}
                maxLength={120}
                defaultValue={initialSettings.galleryTitle}
                className="validated-field min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="galleryTagline" className="text-sm font-semibold text-slate-800">
                Slogan Galeri
              </Label>
              <Input
                id="galleryTagline"
                name="galleryTagline"
                maxLength={100}
                defaultValue={initialSettings.galleryTagline}
                className="min-h-11"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Catatan: Daftar kartu materi dan foto galeri diambil otomatis dari menu{" "}
            <Link href="/admin/materi" className="font-semibold text-primary hover:underline">
              Materi
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            4. Bagian Tentang Sekolah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="aboutEyebrow" className="text-sm font-semibold text-slate-800">
                Label Section Tentang
              </Label>
              <Input
                id="aboutEyebrow"
                name="aboutEyebrow"
                required
                minLength={2}
                maxLength={40}
                defaultValue={initialSettings.aboutEyebrow}
                className="validated-field min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="aboutTitle" className="text-sm font-semibold text-slate-800">
                Judul Section Tentang
              </Label>
              <Input
                id="aboutTitle"
                name="aboutTitle"
                required
                minLength={4}
                maxLength={120}
                defaultValue={initialSettings.aboutTitle}
                className="validated-field min-h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aboutParagraph1" className="text-sm font-semibold text-slate-800">
              Paragraf 1
            </Label>
            <Textarea
              id="aboutParagraph1"
              name="aboutParagraph1"
              required
              minLength={10}
              maxLength={500}
              rows={3}
              defaultValue={initialSettings.aboutParagraph1}
              className="validated-field"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aboutParagraph2" className="text-sm font-semibold text-slate-800">
              Paragraf 2
            </Label>
            <Textarea
              id="aboutParagraph2"
              name="aboutParagraph2"
              required
              minLength={10}
              maxLength={500}
              rows={3}
              defaultValue={initialSettings.aboutParagraph2}
              className="validated-field"
            />
          </div>

          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              name="aboutShowStudentCount"
              defaultChecked={initialSettings.aboutShowStudentCount}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span>Tampilkan kalimat jumlah siswa aktif dari database</span>
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="space-y-1.5">
                <Label
                  htmlFor={`highlight${idx + 1}`}
                  className="text-sm font-semibold text-slate-800"
                >
                  Poin Keunggulan {idx + 1} {idx === 0 ? "(Wajib)" : "(Opsional)"}
                </Label>
                <Input
                  id={`highlight${idx + 1}`}
                  name={`highlight${idx + 1}`}
                  required={idx === 0}
                  maxLength={60}
                  defaultValue={initialSettings.aboutHighlights[idx] ?? ""}
                  className="min-h-11"
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <Label htmlFor="schoolVision" className="text-sm font-semibold text-slate-800">
              Visi Sekolah
            </Label>
            <Textarea
              id="schoolVision"
              name="schoolVision"
              required
              minLength={10}
              maxLength={320}
              rows={3}
              defaultValue={initialSettings.schoolVision}
              className="validated-field"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="schoolMissions" className="text-sm font-semibold text-slate-800">
              Misi Sekolah (1 baris = 1 poin, maks. 6 poin)
            </Label>
            <Textarea
              id="schoolMissions"
              name="schoolMissions"
              required
              rows={5}
              defaultValue={initialSettings.schoolMissions.join("\n")}
              className="validated-field"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            5. Kontak &amp; Footer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="footerDescription" className="text-sm font-semibold text-slate-800">
              Deskripsi Singkat Footer
            </Label>
            <Textarea
              id="footerDescription"
              name="footerDescription"
              required
              minLength={10}
              maxLength={260}
              rows={2}
              defaultValue={initialSettings.footerDescription}
              className="validated-field"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="contactAddress" className="text-sm font-semibold text-slate-800">
                Alamat Sekolah
              </Label>
              <Input
                id="contactAddress"
                name="contactAddress"
                maxLength={200}
                placeholder="Kosongkan jika belum ada"
                defaultValue={initialSettings.contactAddress}
                className="min-h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactEmail" className="text-sm font-semibold text-slate-800">
                Email Sekolah
              </Label>
              <p id="contactEmail-hint" className="text-xs text-slate-500">
                Format: info@sekolah.sch.id (kosongkan jika tidak ditampilkan)
              </p>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                defaultValue={initialSettings.contactEmail}
                onBlur={(e) => handleFieldBlur("contactEmail", e.currentTarget)}
                aria-invalid={emailAria["aria-invalid"]}
                aria-describedby={emailAria["aria-describedby"]}
                className="validated-field min-h-11"
              />
              {(emailAria.serverError || emailAria.clientInvalid) && (
                <p id={emailAria.errorId} className="text-xs font-medium text-red-700">
                  {emailAria.serverError ??
                    "Masukkan format email yang valid, misalnya info@sekolah.sch.id."}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPhone" className="text-sm font-semibold text-slate-800">
                Telepon Sekolah
              </Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                maxLength={40}
                placeholder="Kosongkan jika belum ada"
                defaultValue={initialSettings.contactPhone}
                className="min-h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="copyrightText" className="text-sm font-semibold text-slate-800">
              Teks Hak Cipta (Copyright)
            </Label>
            <Input
              id="copyrightText"
              name="copyrightText"
              required
              minLength={4}
              maxLength={120}
              defaultValue={initialSettings.copyrightText}
              className="validated-field min-h-11"
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
