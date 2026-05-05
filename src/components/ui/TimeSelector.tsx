"use client";

import * as React from "react";
import moment from "moment";
import { Clock, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";
import { dropdownAnimationStyles } from "@/styles/ui/inputStyles";

type TimeValue = string;

interface BaseSelectorProps {
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: ReactDispatch<boolean>;
}

const MainBackground = "bg-primary";
const SecondaryBackground = "bg-background-secondary";
const BackgroundColor = "bg-background";
const MainBorder = "border-border-primary";

const SelectorButton = React.forwardRef<
  HTMLButtonElement,
  { onClick?: VoidFunction; children?: React.ReactNode; className?: string }
>(({ onClick, children, className }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={() => onClick?.()}
    className={cn(
      "flex h-9 min-w-9 items-center justify-center rounded-md p-3 text-sm whitespace-nowrap cursor-pointer hover:bg-background-secondary hover:text-text-primary",
      className
    )}
  >
    {children}
  </button>
));
SelectorButton.displayName = "SelectorButton";

const formatTimeValue = (time?: string | null) =>
  time ? moment(time, "HH:mm").format("hh:mm A") : "";

const detectSystem24HourFormat = () => {
  try {
    return !new Intl.DateTimeFormat(undefined, { hour: "numeric" })
      .formatToParts(new Date(2026, 0, 1, 13, 0))
      .some((p) => p.type === "dayPeriod");
  } catch {
    return false;
  }
};

const parseTimeParts = (value?: string | null) => {
  const parsed = value ? moment(value, "HH:mm") : moment("00:00", "HH:mm");
  return {
    hour24: parsed.hour(),
    minute: parsed.minute(),
    hour12: parsed.format("hh"),
    period: parsed.format("A") as "AM" | "PM"
  };
};

const composeTimeValue = ({
  hour24,
  hour12,
  minute,
  period,
  is24Hour
}: {
  hour24: number;
  hour12: string;
  minute: number;
  period: "AM" | "PM";
  is24Hour: boolean;
}) => {
  if (is24Hour) return moment({ hour: hour24, minute }).format("HH:mm");
  const normalizedHour = Number(hour12) % 12;
  return moment({
    hour: period === "PM" ? normalizedHour + 12 : normalizedHour,
    minute
  }).format("HH:mm");
};

const TimeGrid = ({
  selectedValue,
  minuteStep = 1,
  onSelect
}: {
  selectedValue?: string | null;
  minuteStep?: number;
  onSelect: (time: string) => void;
}) => {
  const [is24Hour, setIs24Hour] = React.useState(() =>
    detectSystem24HourFormat()
  );
  const hourRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const minuteRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const periodRefs = React.useRef<
    Record<"AM" | "PM", HTMLButtonElement | null>
  >({ AM: null, PM: null });

  React.useEffect(() => {
    setIs24Hour(detectSystem24HourFormat());
  }, []);

  const parsed = parseTimeParts(selectedValue);
  const safeStep = Math.max(1, minuteStep);
  const hours = is24Hour
    ? Array.from({ length: 24 }, (_, h) => h.toString().padStart(2, "0"))
    : Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minutes = Array.from({ length: Math.ceil(60 / safeStep) }, (_, i) =>
    (i * safeStep).toString().padStart(2, "0")
  ).filter((m) => Number(m) < 60);

  React.useEffect(() => {
    const hKey = is24Hour
      ? parsed.hour24.toString().padStart(2, "0")
      : parsed.hour12;
    hourRefs.current[hKey]?.scrollIntoView({ block: "center" });
    minuteRefs.current[
      parsed.minute.toString().padStart(2, "0")
    ]?.scrollIntoView({ block: "center" });
    if (!is24Hour)
      periodRefs.current[parsed.period]?.scrollIntoView({ block: "center" });
  }, [is24Hour, parsed.hour12, parsed.hour24, parsed.minute, parsed.period]);

  const colCls =
    "max-h-56 overflow-y-auto rounded-md border border-border-primary p-1 pt-0 custom-scrollbar";

  return (
    <div
      className={cn(
        "grid gap-3 px-3",
        is24Hour ? "grid-cols-2" : "grid-cols-3"
      )}
    >
      <div className={colCls}>
        <p className="sticky top-0 z-10 mb-2 bg-background px-2 py-1 pt-2 text-xs font-medium text-text-secondary">
          Hour
        </p>
        <hr className="border-border-primary" />
        <div className="flex flex-col gap-1">
          {hours.map((hour) => {
            const isSelected = is24Hour
              ? parsed.hour24 === Number(hour)
              : parsed.hour12 === hour;
            return (
              <SelectorButton
                key={hour}
                ref={(n) => {
                  hourRefs.current[hour] = n;
                }}
                onClick={() =>
                  onSelect(
                    composeTimeValue({
                      hour24: Number(hour),
                      hour12: hour,
                      minute: parsed.minute,
                      period: parsed.period,
                      is24Hour
                    })
                  )
                }
                className={cn(
                  "justify-start font-medium",
                  isSelected &&
                    `${MainBackground} text-background hover:${MainBackground}`
                )}
              >
                {hour}
              </SelectorButton>
            );
          })}
        </div>
      </div>
      <div className={colCls}>
        <p className="sticky top-0 z-10 mb-2 bg-background px-2 py-1 pt-2 text-xs font-medium text-text-secondary">
          Minute
        </p>
        <hr className="border-border-primary" />
        <div className="flex flex-col gap-1">
          {minutes.map((minute) => {
            const isSelected = parsed.minute === Number(minute);
            return (
              <SelectorButton
                key={minute}
                ref={(n) => {
                  minuteRefs.current[minute] = n;
                }}
                onClick={() =>
                  onSelect(
                    composeTimeValue({
                      hour24: parsed.hour24,
                      hour12: parsed.hour12,
                      minute: Number(minute),
                      period: parsed.period,
                      is24Hour
                    })
                  )
                }
                className={cn(
                  "justify-start font-medium",
                  isSelected &&
                    `${MainBackground} text-background hover:${MainBackground}`
                )}
              >
                {minute}
              </SelectorButton>
            );
          })}
        </div>
      </div>
      {!is24Hour && (
        <div className={colCls}>
          <p className="sticky top-0 z-10 mb-2 bg-background px-2 py-1 pt-2 text-xs font-medium text-text-secondary">
            Period
          </p>
          <hr className="border-border-primary" />
          <div className="flex flex-col gap-1">
            {(["AM", "PM"] as const).map((period) => {
              const isSelected = parsed.period === period;
              return (
                <SelectorButton
                  key={period}
                  ref={(n) => {
                    periodRefs.current[period] = n;
                  }}
                  onClick={() =>
                    onSelect(
                      composeTimeValue({
                        hour24: parsed.hour24,
                        hour12: parsed.hour12,
                        minute: parsed.minute,
                        period,
                        is24Hour: false
                      })
                    )
                  }
                  className={cn(
                    "justify-start font-medium",
                    isSelected &&
                      `${MainBackground} text-background hover:${MainBackground}`
                  )}
                >
                  {period}
                </SelectorButton>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface Props extends BaseSelectorProps {
  value?: TimeValue | null;
  setValue?: (value: TimeValue) => void;
  minuteStep?: number;
  placeholder?: string;
}

const TimeSelector = ({
  value,
  setValue,
  minuteStep = 1,
  placeholder = "Select Time",
  ...rest
}: Props) => {
  const hasValue = !!value;

  const handleClear = () => {
    setValue?.(undefined as unknown as TimeValue);
  };

  return (
    <DropdownMenu.DropdownMenu
      open={rest.open}
      onOpenChange={rest.onOpenChange}
    >
      {!rest.hideTrigger && (
        <div className="relative inline-flex">
          <DropdownMenu.DropdownMenuTrigger
            translate="no"
            className={cn(
              "flex items-center justify-between gap-2",
              "h-9 w-full px-3 pr-9 rounded-lg border border-border-primary",
              "bg-background-secondary text-sm cursor-pointer whitespace-nowrap",
              hasValue ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {hasValue ? formatTimeValue(value) : placeholder}
            {!hasValue && (
              <Clock className="size-4 absolute right-3 pointer-events-none text-text-secondary" />
            )}
          </DropdownMenu.DropdownMenuTrigger>
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 rounded-full text-text-secondary hover:bg-border-primary hover:text-text-primary cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}

      <DropdownMenu.Content
        translate="no"
        sideOffset={8}
        className={cn(
          "w-[320px] rounded-lg border p-3 shadow-md px-0",
          "z-50",
          BackgroundColor,
          MainBorder,
          dropdownAnimationStyles
        )}
      >
        <TimeGrid
          selectedValue={value}
          minuteStep={minuteStep}
          onSelect={(time) => {
            setValue?.(time);
            rest.onOpenChange?.(false);
          }}
        />
        {hasValue && (
          <div className="mt-3 flex justify-end border-t border-border-primary pt-2 px-3">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 rounded-md border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.DropdownMenu>
  );
};

export default TimeSelector;
