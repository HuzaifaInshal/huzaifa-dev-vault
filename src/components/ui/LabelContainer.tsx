import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  label?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
}

const LabelContainer = ({
  children,
  error,
  label,
  htmlFor,
  required,
  className,
  labelClassName
}: Props) => {
  return (
    <div className={cn("flex", "flex-col", "gap-2", "w-full", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            "text-[0.95rem]",
            "font-medium",
            "leading-6",
            "text-text-primary",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-xl text-red-600 ms-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default LabelContainer;
