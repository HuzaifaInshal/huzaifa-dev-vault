"use client";

import * as React from "react";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";

type ViewType = "year" | "month" | "date";

interface BaseSelectorProps {
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: ReactDispatch<boolean>;
}

interface CalendarPanelProps {
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  initialViewDate?: Date | null;
}

const MainBackground = "bg-primary";
const SecondaryBackground = "bg-background-secondary";
const BackgroundColor = "bg-background";

const TextColorMain = "text-text-primary";
const TextColorSecondary = "text-text-secondary";
const TextColorDisabled = "text-gray-400";

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
    disabled?: boolean;
  }
>(({ onClick, children, className, disabled }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={() => !disabled && onClick?.()}
    disabled={disabled}
    className={cn(
      "flex h-9 min-w-9 items-center justify-center rounded-md p-3 text-sm whitespace-nowrap",
      "cursor-pointer",
      !disabled && `hover:${SecondaryBackground} hover:${TextColorMain}`,
      disabled && "cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
));

SelectorButton.displayName = "SelectorButton";

const checkIfDateDisabled = (
  date: Date,
  disabledDates?: Date[],
  minDate?: Date,
  maxDate?: Date
) => {
  if (
    disabledDates?.some((disabledDate) =>
      moment(date).isSame(disabledDate, "day")
    )
  ) {
    return true;
  }

  if (minDate && moment(date).isBefore(moment(minDate), "day")) {
    return true;
  }

  if (maxDate && moment(date).isAfter(moment(maxDate), "day")) {
    return true;
  }

  return false;
};

const getDateCellClasses = ({
  date,
  viewDate,
  selectedDate,
  disabledDates,
  minDate,
  maxDate
}: {
  date: Date;
  viewDate: Date;
  selectedDate?: Date | null;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}) => {
  const dateDisabled = checkIfDateDisabled(
    date,
    disabledDates,
    minDate,
    maxDate
  );
  const isCurrentMonth = moment(date).isSame(viewDate, "month");
  const today = moment(date).isSame(moment(), "day");
  const isSelected = selectedDate
    ? moment(date).isSame(selectedDate, "day")
    : false;

  if (dateDisabled) {
    return cn("text-sm font-medium rounded-full", TextColorDisabled);
  }

  if (isSelected) {
    return cn(
      "text-sm font-medium rounded-full font-bold text-safed",
      MainBackground,
      `hover:${MainBackground}`
    );
  }

  if (today) {
    return cn(
      "text-sm font-medium rounded-full font-bold",
      SecondaryBackground,
      TextColorMain
    );
  }

  return cn(
    "text-sm font-medium rounded-full",
    isCurrentMonth ? TextColorMain : TextColorSecondary
  );
};

const DateGrid = ({
  viewDate,
  selectedDate,
  onSelectDate,
  disabledDates,
  minDate,
  maxDate
}: CalendarPanelProps & { viewDate: Date }) => {
  const start = moment(viewDate).startOf("month").startOf("week");
  const end = moment(viewDate).endOf("month").endOf("week");

  const days: Date[] = [];
  const current = moment(start);

  while (current.isSameOrBefore(end)) {
    days.push(current.toDate());
    current.add(1, "day");
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayLabel) => (
        <div
          key={dayLabel}
          className={cn("text-center text-sm font-medium", TextColorSecondary)}
        >
          {dayLabel}
        </div>
      ))}

      {days.map((day) => {
        const dateDisabled = checkIfDateDisabled(
          day,
          disabledDates,
          minDate,
          maxDate
        );

        return (
          <SelectorButton
            key={day.toISOString()}
            disabled={dateDisabled}
            onClick={() => onSelectDate(day)}
            className={getDateCellClasses({
              date: day,
              viewDate,
              selectedDate,
              disabledDates,
              minDate,
              maxDate
            })}
          >
            {moment(day).date()}
          </SelectorButton>
        );
      })}
    </div>
  );
};

const MonthGrid = ({
  viewDate,
  onMonthSelect
}: {
  viewDate: Date;
  onMonthSelect: (month: number) => void;
}) => {
  const months = Array.from({ length: 12 }, (_, index) => ({
    index,
    label: moment(viewDate).month(index).format("MMM"),
    isCurrentMonth: moment().isSame(moment(viewDate).month(index), "month")
  }));

  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month) => (
        <SelectorButton
          key={month.index}
          onClick={() => onMonthSelect(month.index)}
          className={cn(
            "font-medium",
            month.isCurrentMonth && `font-bold ${SecondaryBackground}`
          )}
        >
          {month.label}
        </SelectorButton>
      ))}
    </div>
  );
};

const YearGrid = ({
  viewDate,
  onYearSelect
}: {
  viewDate: Date;
  onYearSelect: (year: number) => void;
}) => {
  const startYear = Math.floor(moment(viewDate).year() / 10) * 10 - 1;
  const years = Array.from({ length: 12 }, (_, index) => startYear + index);

  return (
    <div className="grid grid-cols-3 gap-2">
      {years.map((year) => (
        <SelectorButton
          key={year}
          onClick={() => onYearSelect(year)}
          className={cn(
            "font-medium",
            year === moment().year() && `font-bold ${SecondaryBackground}`
          )}
        >
          {year}
        </SelectorButton>
      ))}
    </div>
  );
};

const CalendarPanel = ({
  selectedDate,
  onSelectDate,
  disabledDates,
  minDate,
  maxDate,
  initialViewDate
}: CalendarPanelProps) => {
  const [currentView, setCurrentView] = React.useState<ViewType>("date");
  const [viewDate, setViewDate] = React.useState<Date>(
    initialViewDate ?? selectedDate ?? new Date()
  );

  const goNext = () => {
    if (currentView === "date") {
      setViewDate(moment(viewDate).add(1, "month").toDate());
      return;
    }

    if (currentView === "month") {
      setViewDate(moment(viewDate).add(1, "year").toDate());
      return;
    }

    setViewDate(moment(viewDate).add(10, "year").toDate());
  };

  const goPrev = () => {
    if (currentView === "date") {
      setViewDate(moment(viewDate).subtract(1, "month").toDate());
      return;
    }

    if (currentView === "month") {
      setViewDate(moment(viewDate).subtract(1, "year").toDate());
      return;
    }

    setViewDate(moment(viewDate).subtract(10, "year").toDate());
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          className={cn(
            TextColorMain,
            "cursor-pointer font-semibold hover:underline"
          )}
          onClick={() => {
            if (currentView === "date") setCurrentView("month");
            else if (currentView === "month") setCurrentView("year");
          }}
        >
          {currentView === "date" && moment(viewDate).format("MMMM YYYY")}
          {currentView === "month" && moment(viewDate).format("YYYY")}
          {currentView === "year" &&
            `${moment(viewDate).year() - 4} - ${moment(viewDate).year() + 5}`}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={cn(TextColorMain, "cursor-pointer")}
            onClick={goPrev}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={cn(TextColorMain, "cursor-pointer")}
            onClick={goNext}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {currentView === "year" && (
        <YearGrid
          viewDate={viewDate}
          onYearSelect={(year) => {
            setViewDate(moment(viewDate).year(year).toDate());
            setCurrentView("month");
          }}
        />
      )}

      {currentView === "month" && (
        <MonthGrid
          viewDate={viewDate}
          onMonthSelect={(month) => {
            setViewDate(moment(viewDate).month(month).toDate());
            setCurrentView("date");
          }}
        />
      )}

      {currentView === "date" && (
        <DateGrid
          viewDate={viewDate}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </div>
  );
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

const combineDateAndTime = (date: Date, time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  return moment(date)
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0)
    .toDate();
};

const extractTimeFromDate = (date?: Date | null) =>
  date ? moment(date).format("HH:mm") : null;

const formatDateTimeLabel = (
  value?: Date | null,
  placeholder = "Select Date & Time"
) => (value ? moment(value).format("DD MMM YYYY, hh:mm A") : placeholder);

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
  value?: Date | null;
  setValue?: (value: Date) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  minuteStep?: number;
}

const DateTimeSelector = ({
  value,
  setValue,
  disabledDates,
  minDate,
  maxDate,
  minuteStep = 1,
  ...rest
}: Props) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    value ?? null
  );
  const [selectedTime, setSelectedTime] = React.useState<string | null>(
    extractTimeFromDate(value)
  );

  React.useEffect(() => {
    setSelectedDate(value ?? null);
    setSelectedTime(extractTimeFromDate(value));
  }, [value]);

  const commitIfReady = (nextDate: Date | null, nextTime: string | null) => {
    if (!nextDate || !nextTime) return;

    setValue?.(combineDateAndTime(nextDate, nextTime));
    rest.onOpenChange?.(false);
  };

  return (
    <SelectorRoot {...rest} triggerLabel={formatDateTimeLabel(value)}>
      <SelectorContent className="w-[340px]">
        <CalendarPanel
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            commitIfReady(date, selectedTime);
          }}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
          initialViewDate={selectedDate}
        />

        <div className="mt-4 border-t border-border-primary pt-4">
          <p className="mb-3 text-sm font-medium text-text-primary">
            Select Time
          </p>
          <TimeGrid
            selectedValue={selectedTime}
            minuteStep={minuteStep}
            onSelect={(time) => {
              setSelectedTime(time);
              commitIfReady(selectedDate, time);
            }}
          />
        </div>
      </SelectorContent>
    </SelectorRoot>
  );
};

export default DateTimeSelector;