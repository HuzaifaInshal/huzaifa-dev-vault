"use client";

import * as React from "react";
import {
  OTPInput as OTPInputPrimitive,
  OTPInputContext,
  type OTPInputProps
} from "input-otp";

import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";

import LabelContainer from "./LabelContainer";

const otpInputCellClassName = cn(
  "relative flex h-12 w-12 items-center justify-center rounded-lg border border-border-primary bg-input text-base text-text-primary outline-none transition-all",
  "first:ms-0",
  "ms-3",
  "data-[active=true]:ring-primary data-[active=true]:ring-2",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
);

type Props = Omit<
  OTPInputProps,
  "children" | "render" | "onChange" | "maxLength"
> & {
  label?: string;
  error?: string;
  setValue?: ReactDispatch<string>;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  maxLength?: number;
};

function OtpInputSlot({
  index,
  className
}: {
  index: number;
  className?: string;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-active={isActive}
      className={cn(otpInputCellClassName, className)}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-primary duration-1000" />
        </div>
      )}
    </div>
  );
}

const OtpInput = ({
  value,
  setValue,
  containerClassName,
  maxLength = 6,
  required,
  label,
  className,
  inputClassName,
  labelClassName,
  error,
  disabled,
  ...rest
}: Props) => {
  return (
    <LabelContainer
      error={error}
      htmlFor={rest.id}
      label={label}
      className={containerClassName}
      labelClassName={labelClassName}
      required={required}
    >
      <OTPInputPrimitive
        value={value}
        maxLength={maxLength}
        spellCheck={false}
        disabled={disabled}
        onChange={(nextValue) => setValue?.(nextValue)}
        containerClassName="flex items-center disabled:opacity-50"
        className={cn("w-fit disabled:cursor-not-allowed", inputClassName)}
        {...rest}
      >
        {Array.from({ length: maxLength }, (_, index) => (
          <OtpInputSlot key={index} index={index} className={className} />
        ))}
      </OTPInputPrimitive>
    </LabelContainer>
  );
};

export default OtpInput;
