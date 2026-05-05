"use client";

import * as React from "react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";
import { handleRippleAnimation } from "@/lib/ui/handleRippleAnimation";
import { dropdownAnimationStyles } from "@/styles/ui/inputStyles";

import LabelContainer from "./LabelContainer";

type DropdownItem = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  onClick?: (value: string) => void;
};

type Props = {
  children: React.ReactNode;
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  items?: DropdownItem[];
  contentClassName?: string;
  required?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Dropdown = ({
  children,
  label,
  error,
  containerClassName,
  labelClassName,
  items = [],
  contentClassName,
  required,
  open,
  defaultOpen,
  onOpenChange
}: Props) => {
  return (
    <LabelContainer
      error={error}
      label={label}
      className={containerClassName}
      labelClassName={labelClassName}
      required={required}
    >
      <DropdownMenu.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            align="start"
            className={cn(
              "z-50 min-w-(--radix-dropdown-menu-trigger-width) overflow-hidden rounded-lg border border-border-primary bg-background p-1 shadow-sm",
              dropdownAnimationStyles,
              contentClassName
            )}
          >
            {items.map((item) => (
              <DropdownMenu.Item
                key={item.value}
                disabled={item.disabled}
                onMouseDown={(e) => {
                  handleRippleAnimation(
                    e as unknown as React.MouseEvent<
                      HTMLButtonElement,
                      MouseEvent
                    >,
                    "bg-primary"
                  );
                }}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-left text-sm text-text-primary outline-none overflow-hidden",
                  "focus:bg-primary/10",
                  item.disabled && "pointer-events-none opacity-50"
                )}
              >
                {item.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </LabelContainer>
  );
};

export default Dropdown;
