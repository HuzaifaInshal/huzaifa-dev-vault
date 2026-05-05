"use client";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Wherever this Modal is being called please dont forget to call <Dialog.Title></Dialog.Title> inside the children

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

const Modal = ({ open, onOpenChange, children, className }: ModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          "fixed inset-0 z-50",
          "bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        )}
      />
      <Dialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "bg-background rounded-[20px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)]",
          "outline -outline-offset-1 outline-border-primary",
          "focus:outline-none",
          "duration-100 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",

          className
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const ModalClose = ({ className }: { className?: string }) => (
  <Dialog.Close
    className={cn(
      "rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors",
      className
    )}
  >
    <X className="size-5" />
  </Dialog.Close>
);

export { Modal, ModalClose };
