"use client";

import * as React from "react";
import moment from "moment";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";

type TimeValue = string;

interface TimeRangeValue {
  startTime: TimeValue | null;
  endTime: TimeValue | null;
}

interface BaseSelectorProps {
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: ReactDispatch<boolean>;
}

const MainBackground = "bg-primary";
const BackgroundColor = "bg-background";
const MainBorder = "border-border-primary";

const selectorTriggerClassName = cn(
  "bg-background-secondary px-3 py-2 2xl:py-3",
  "text-sm 2xl:text-base text-text-primary",
  "rounded-lg whitespace-nowrap cursor-pointer"
);

const selectorContentClassName = cn(
  "w-[310px] rounded-lg border p-3 shadow-md",
  BackgroundColor,
  MainBorder
);

const SelectorButton = React.forwardRef<
  HTMLButtonElement,
  {
    onClick?: VoidFunction;
    children?: React.ReactNode;
    className?: string;
  }
>(({ onClick, children, className }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={() => onClick?.()}
    className={cn(
      "flex h-9 min-w-9 items-center justify-center rounded-md p-3 text-sm whitespace-nowrap",
      "cursor-pointer hover:bg-background-secondary hover:text-text-primary",
      className
    )}
  >
    {children}
  </button>
));

SelectorButton.displayName = "SelectorButton";

const formatTimeValue = (time?: string | null) =>
  time ? moment(time, "HH:mm").format("hh:mm A") : "";

const formatTimeRangeLabel = (
  value?: TimeRangeValue,
  placeholder = "Select Time Range"
) => {
  if (!value?.startTime && !value?.endTime) return placeholder;
  if (value?.startTime && !value?.endTime) {
    return `${formatTimeValue(value.startTime)} - ...`;
  }
  if (!value?.startTime || !value?.endTime) return placeholder;

  return `${formatTimeValue(value.startTime)} - ${formatTimeValue(
    value.endTime
  )}`;
};

const detectSystem24HourFormat = () => {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, { hour: "numeric" });

    return !formatter
      .formatToParts(new Date(2026, 0, 1, 13, 0))
      .some((part) => part.type === "dayPeriod");
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
  if (is24Hour) {
    return moment({ hour: hour24, minute }).format("HH:mm");
  }

  const normalizedHour = Number(hour12) % 12;
  const nextHour24 = period === "PM" ? normalizedHour + 12 : normalizedHour;

  return moment({ hour: nextHour24, minute }).format("HH:mm");
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
  >({
    AM: null,
    PM: null
  });

  React.useEffect(() => {
    setIs24Hour(detectSystem24HourFormat());
  }, []);

  const parsed = parseTimeParts(selectedValue);
  const safeMinuteStep = Math.max(1, minuteStep);

  const hours = is24Hour
    ? Array.from({ length: 24 }, (_, hour) => hour.toString().padStart(2, "0"))
    : Array.from({ length: 12 }, (_, index) =>
        (index + 1).toString().padStart(2, "0")
      );

  const minutes = Array.from(
    { length: Math.ceil(60 / safeMinuteStep) },
    (_, index) => (index * safeMinuteStep).toString().padStart(2, "0")
  ).filter((minute) => Number(minute) < 60);

  React.useEffect(() => {
    const selectedHourKey = is24Hour
      ? parsed.hour24.toString().padStart(2, "0")
      : parsed.hour12;
    const selectedMinuteKey = parsed.minute.toString().padStart(2, "0");

    hourRefs.current[selectedHourKey]?.scrollIntoView({ block: "center" });
    minuteRefs.current[selectedMinuteKey]?.scrollIntoView({ block: "center" });

    if (!is24Hour) {
      periodRefs.current[parsed.period]?.scrollIntoView({ block: "center" });
    }
  }, [is24Hour, parsed.hour12, parsed.hour24, parsed.minute, parsed.period]);

  const columnClassName =
    "max-h-56 overflow-y-auto rounded-md border border-border-primary p-1 pt-0 custom-scrollbar";

  return (
    <div
      className={cn(
        "grid gap-3 px-3",
        is24Hour ? "grid-cols-2" : "grid-cols-3"
      )}
    >
      <div className={columnClassName}>
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
                ref={(node) => {
                  hourRefs.current[hour] = node;
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
                    `${MainBackground} text-safed hover:${MainBackground}`
                )}
              >
                {hour}
              </SelectorButton>
            );
          })}
        </div>
      </div>

      <div className={columnClassName}>
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
                ref={(node) => {
                  minuteRefs.current[minute] = node;
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
                    `${MainBackground} text-safed hover:${MainBackground}`
                )}
              >
                {minute}
              </SelectorButton>
            );
          })}
        </div>
      </div>

      {!is24Hour && (
        <div className={columnClassName}>
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
                  ref={(node) => {
                    periodRefs.current[period] = node;
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
                      `${MainBackground} text-safed hover:${MainBackground}`
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

const SelectorContent = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <DropdownMenu.Content
    translate="no"
    sideOffset={8}
    className={cn(selectorContentClassName, className)}
  >
    {children}
  </DropdownMenu.Content>
);

const SelectorRoot = ({
  hideTrigger,
  open,
  onOpenChange,
  triggerLabel,
  children
}: BaseSelectorProps & {
  triggerLabel: string;
  children: React.ReactNode;
}) => (
  <DropdownMenu.DropdownMenu open={open} onOpenChange={onOpenChange}>
    {hideTrigger ? null : (
      <DropdownMenu.DropdownMenuTrigger
        translate="no"
        className={selectorTriggerClassName}
      >
        {triggerLabel}
      </DropdownMenu.DropdownMenuTrigger>
    )}
    {children}
  </DropdownMenu.DropdownMenu>
);

interface Props extends BaseSelectorProps {
  value?: TimeRangeValue;
  setValue?: (value: TimeRangeValue) => void;
  minuteStep?: number;
}

const TimeRangeSelector = ({
  value,
  setValue,
  minuteStep = 1,
  ...rest
}: Props) => {
  const [activeField, setActiveField] = React.useState<"start" | "end">(
    "start"
  );
  const [range, setRange] = React.useState<TimeRangeValue>({
    startTime: value?.startTime ?? null,
    endTime: value?.endTime ?? null
  });

  React.useEffect(() => {
    setRange({
      startTime: value?.startTime ?? null,
      endTime: value?.endTime ?? null
    });
  }, [value?.startTime, value?.endTime]);

  const selectedValue =
    activeField === "start" ? range.startTime : range.endTime;

  const handleTimeSelect = (time: string) => {
    let nextRange: TimeRangeValue =
      activeField === "start"
        ? { ...range, startTime: time }
        : { ...range, endTime: time };

    if (
      nextRange.startTime &&
      nextRange.endTime &&
      moment(nextRange.endTime, "HH:mm").isBefore(
        moment(nextRange.startTime, "HH:mm")
      )
    ) {
      nextRange =
        activeField === "start"
          ? { startTime: time, endTime: null }
          : { startTime: time, endTime: time };
    }

    setRange(nextRange);
    setValue?.(nextRange);

    if (activeField === "start") {
      setActiveField("end");
      return;
    }

    if (nextRange.startTime && nextRange.endTime) {
      rest.onOpenChange?.(false);
    }
  };

  return (
    <SelectorRoot {...rest} triggerLabel={formatTimeRangeLabel(range)}>
      <SelectorContent className="w-[320px]">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveField("start")}
            className={cnField(activeField === "start")}
          >
            Start:{" "}
            {range.startTime ? formatTimeValue(range.startTime) : "--:--"}
          </button>
          <button
            type="button"
            onClick={() => setActiveField("end")}
            className={cnField(activeField === "end")}
          >
            End: {range.endTime ? formatTimeValue(range.endTime) : "--:--"}
          </button>
        </div>

        <div className="mb-3 text-sm font-medium text-text-primary">
          Select {activeField === "start" ? "Start" : "End"} Time
        </div>

        <TimeGrid
          selectedValue={selectedValue}
          minuteStep={minuteStep}
          onSelect={handleTimeSelect}
        />
      </SelectorContent>
    </SelectorRoot>
  );
};

const cnField = (active: boolean) =>
  [
    "rounded-md text-sm font-medium transition-colors",
    "px-3 py-2",
    active
      ? "bg-primary text-safed"
      : "bg-background-secondary text-text-primary hover:bg-background-secondary/80"
  ].join(" ");

export default TimeRangeSelector;