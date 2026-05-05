import { cn } from "@/lib/utils";

export const dropdownAnimationStyles =
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

export const inputStyles = cn(
  "h-9 w-full",
  "rounded-lg border border-border-primary",
  "bg-input",
  "px-3 py-2",
  "text-base text-text-primary",
  "placeholder:text-text-secondary",
  "focus:outline-primary"
);

export const startIconStyles = cn(
  "pointer-events-auto",
  "absolute left-3",
  "inline-flex items-center"
);

export const endIconStyles = cn(
  "pointer-events-auto",
  "absolute right-3",
  "inline-flex items-center"
);
