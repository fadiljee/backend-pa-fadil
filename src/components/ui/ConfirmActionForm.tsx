"use client";

import { useId, useRef, useTransition } from "react";

interface ConfirmActionFormProps {
  action: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  triggerClassName?: string;
  triggerAriaLabel?: string;
  triggerTitle?: string;
  children: React.ReactNode;
}

const confirmButtonStyles: Record<NonNullable<ConfirmActionFormProps["variant"]>, string> = {
  danger: "bg-red-700 hover:bg-red-800 text-white",
  primary: "bg-indigo-800 hover:bg-indigo-900 text-white",
};

export function ConfirmActionForm({
  action,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "danger",
  triggerClassName = "",
  triggerAriaLabel,
  triggerTitle,
  children,
}: ConfirmActionFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const titleId = useId();
  const descId = useId();

  function handleOpen() {
    dialogRef.current?.showModal();
  }

  function handleClose() {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = "";
    }
  }

  function handleConfirm() {
    dialogRef.current?.close("confirm");
    startTransition(() => {
      formRef.current?.requestSubmit();
    });
  }

  return (
    <>
      <form ref={formRef} action={action} className="inline-block">
        <button
          type="button"
          onClick={handleOpen}
          disabled={isPending}
          aria-label={triggerAriaLabel}
          title={triggerTitle}
          className={triggerClassName}
        >
          {children}
        </button>
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClose={handleClose}
        className="m-auto w-[min(92dvw,26rem)] rounded-xl border border-slate-200 bg-white p-6 text-left text-slate-900 shadow-xl"
      >
        <h2 id={titleId} className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close("cancel")}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60 ${confirmButtonStyles[variant]}`}
          >
            {isPending ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
