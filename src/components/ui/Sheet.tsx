"use client";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Wherever this Sheet is being called please dont forget to call <Dialog.Title></Dialog.Title> inside the children

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
};

const Sheet = ({
  open,
  onOpenChange,
  children,
  side = "right",
  className
}: SheetProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/40",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "duration-300"
        )}
      />
      <Dialog.Content
        className={cn(
          "fixed top-0 z-50 h-full bg-background shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] flex flex-col focus:outline-none",
          side === "right" ? "right-0" : "left-0",
          side === "right"
            ? "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
            : "data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left",
          "duration-300 ease-in-out",
          "w-3/4",
          className
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const SheetClose = ({ className }: { className?: string }) => (
  <Dialog.Close
    className={cn(
      "rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors",
      className
    )}
  >
    <X className="size-5" />
  </Dialog.Close>
);

export { Sheet, SheetClose };
