"use client";

import { useRef, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setOpen(false);
    startTransition(() => {
      formRef.current?.requestSubmit();
    });
  }

  return (
    <>
      <form ref={formRef} action={action} className="inline-block">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <button
                type="button"
                disabled={isPending}
                aria-label={triggerAriaLabel}
                title={triggerTitle}
                className={triggerClassName}
              >
                {children}
              </button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel autoFocus className="min-h-11">
                {cancelLabel}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isPending}
                variant={variant === "danger" ? "destructive" : "default"}
                className="min-h-11"
              >
                {isPending ? "Memproses..." : confirmLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </>
  );
}
