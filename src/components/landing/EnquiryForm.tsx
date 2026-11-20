"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KEPERLUAN_OPTIONS } from "@/lib/services/pesan";
import { submitPesanAction, type PesanFormState } from "./contact-actions";

const initialState: PesanFormState = {};

export function EnquiryForm({ className = "" }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(submitPesanAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    if (state.status === "success") {
      form.reset();
    } else if (state.status === "error" && state.field) {
      const el = form.elements.namedItem(state.field);
      if (el instanceof HTMLElement) el.focus();
    }
  }, [state]);

  const invalid = (name: string) => state.status === "error" && state.field === name;

  return (
    <Card
      id="hubungi"
      className={`scroll-mt-28 gap-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white py-0 shadow-xl ring-0 ${className}`}
    >
      <div className="bg-crimson px-5 py-4 text-white">
        <h2 id="hubungi-title" className="text-sm font-bold uppercase tracking-wider">
          Hubungi Sekolah
        </h2>
        <p className="mt-0.5 text-xs text-white/90">
          Kirim pertanyaan Anda, pengelola sekolah akan segera menindaklanjuti.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        aria-labelledby="hubungi-title"
        className="space-y-3 px-5 pb-5 pt-4"
      >
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="enq-website">Website</Label>
          <Input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="enq-nama" className="text-xs font-semibold text-ink">
            Nama Lengkap <span aria-hidden="true" className="text-crimson">*</span>
          </Label>
          <Input
            id="enq-nama"
            name="nama"
            type="text"
            required
            minLength={3}
            maxLength={80}
            autoComplete="name"
            enterKeyHint="next"
            placeholder="Nama orang tua / siswa"
            aria-invalid={invalid("nama") || undefined}
            className="validated-field min-h-11 border-slate-300 bg-white text-base text-ink placeholder:text-slate-500 focus-visible:border-crimson sm:text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="enq-email" className="text-xs font-semibold text-ink">
            Alamat Email <span aria-hidden="true" className="text-crimson">*</span>
          </Label>
          <Input
            id="enq-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            placeholder="nama@email.com"
            aria-invalid={invalid("email") || undefined}
            className="validated-field min-h-11 border-slate-300 bg-white text-base text-ink placeholder:text-slate-500 focus-visible:border-crimson sm:text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="enq-hp" className="text-xs font-semibold text-ink">
            Nomor HP / WhatsApp <span aria-hidden="true" className="text-crimson">*</span>
          </Label>
          <Input
            id="enq-hp"
            name="no_hp"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9+\-\s]{8,20}"
            enterKeyHint="next"
            placeholder="0812 3456 7890"
            aria-describedby="enq-hp-help"
            aria-invalid={invalid("no_hp") || undefined}
            className="validated-field min-h-11 border-slate-300 bg-white text-base text-ink placeholder:text-slate-500 focus-visible:border-crimson sm:text-sm"
          />
          <p id="enq-hp-help" className="text-[11px] text-muted">
            8 sampai 20 digit angka
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="enq-keperluan" className="text-xs font-semibold text-ink">
            Keperluan <span aria-hidden="true" className="text-crimson">*</span>
          </Label>
          <select
            id="enq-keperluan"
            name="keperluan"
            required
            defaultValue=""
            aria-invalid={invalid("keperluan") || undefined}
            className="validated-field block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-ink focus-visible:border-crimson sm:text-sm"
          >
            <option value="" disabled>
              Pilih keperluan Anda
            </option>
            {KEPERLUAN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="enq-pesan" className="text-xs font-semibold text-ink">
            Pesan <span className="font-normal text-muted">(opsional)</span>
          </Label>
          <Textarea
            id="enq-pesan"
            name="pesan"
            rows={2}
            maxLength={1000}
            placeholder="Tuliskan pertanyaan singkat..."
            className="validated-field resize-y border-slate-300 bg-white text-base text-ink placeholder:text-slate-500 focus-visible:border-crimson sm:text-sm"
          />
        </div>

        <div aria-live="polite" role="status" className="empty:hidden">
          {state.status === "success" && (
            <p className="flex items-start gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{state.message}</span>
            </p>
          )}
          {state.status === "error" && (
            <p className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{state.message}</span>
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="min-h-11 w-full rounded-md bg-crimson text-xs font-bold uppercase tracking-wider text-white hover:bg-crimson-dark"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Mengirim..." : "Kirim Pesan"}
        </Button>
      </form>
    </Card>
  );
}
