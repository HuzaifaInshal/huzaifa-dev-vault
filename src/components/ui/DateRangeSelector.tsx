"use client";

import * as React from "react";
import moment from "moment";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";
import { dropdownAnimationStyles } from "@/styles/ui/inputStyles";

type ViewType = "year" | "month" | "date";

interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

interface BaseSelectorProps {
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: ReactDispatch<boolean>;
}

interface CalendarPanelProps {
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
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
      "flex h-9 min-w-9 items-center justify-center rounded-md p-3 text-sm whitespace-nowrap cursor-pointer",
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
  if (disabledDates?.some((d) => moment(date).isSame(d, "day"))) return true;
  if (minDate && moment(date).isBefore(moment(minDate), "day")) return true;
  if (maxDate && moment(date).isAfter(moment(maxDate), "day")) return true;
  return false;
};

const getDateCellClasses = ({
  date,
  viewDate,
  rangeStart,
  rangeEnd,
  disabledDates,
  minDate,
  maxDate
}: {
  date: Date;
  viewDate: Date;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
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
  const isRangeStart = rangeStart
    ? moment(date).isSame(rangeStart, "day")
    : false;
  const isRangeEnd = rangeEnd ? moment(date).isSame(rangeEnd, "day") : false;
  const inRange =
    rangeStart &&
    rangeEnd &&
    moment(date).isBetween(rangeStart, rangeEnd, "day", "[]");

  if (dateDisabled)
    return cn("text-sm font-medium rounded-full", TextColorDisabled);
  if (isRangeStart || isRangeEnd)
    return cn(
      "text-sm font-medium rounded-full font-bold text-background",
      MainBackground,
      `hover:${MainBackground}`
    );
  if (inRange)
    return cn(
      "text-sm font-medium rounded-full bg-primary/12 text-primary hover:bg-primary/12"
    );
  if (today)
    return cn(
      "text-sm font-medium rounded-full font-bold",
      SecondaryBackground,
      TextColorMain
    );
  return cn(
    "text-sm font-medium rounded-full",
    isCurrentMonth ? TextColorMain : TextColorSecondary
  );
};

const DateGrid = ({
  viewDate,
  rangeStart,
  rangeEnd,
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
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
        <div
          key={d}
          className={cn("text-center text-xs font-medium", TextColorSecondary)}
        >
          {d}
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
              rangeStart,
              rangeEnd,
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
  const months = Array.from({ length: 12 }, (_, i) => ({
    index: i,
    label: moment(viewDate).month(i).format("MMM"),
    isCurrentMonth: moment().isSame(moment(viewDate).month(i), "month")
  }));
  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((m) => (
        <SelectorButton
          key={m.index}
          onClick={() => onMonthSelect(m.index)}
          className={cn(
            "font-medium",
            m.isCurrentMonth && `font-bold ${SecondaryBackground}`
          )}
        >
          {m.label}
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
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);
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
  rangeStart,
  rangeEnd,
  onSelectDate,
  disabledDates,
  minDate,
  maxDate,
  initialViewDate
}: CalendarPanelProps) => {
  const [currentView, setCurrentView] = React.useState<ViewType>("date");
  const [viewDate, setViewDate] = React.useState<Date>(
    initialViewDate ?? rangeStart ?? new Date()
  );

  const goNext = () => {
    if (currentView === "date")
      setViewDate(moment(viewDate).add(1, "month").toDate());
    else if (currentView === "month")
      setViewDate(moment(viewDate).add(1, "year").toDate());
    else setViewDate(moment(viewDate).add(10, "year").toDate());
  };

  const goPrev = () => {
    if (currentView === "date")
      setViewDate(moment(viewDate).subtract(1, "month").toDate());
    else if (currentView === "month")
      setViewDate(moment(viewDate).subtract(1, "year").toDate());
    else setViewDate(moment(viewDate).subtract(10, "year").toDate());
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className={cn(
            TextColorMain,
            "cursor-pointer font-semibold hover:underline text-sm"
          )}
          onClick={() => {
            if (currentView === "date") setCurrentView("month");
            else if (currentView === "month") setCurrentView("year");
          }}
        >
          {currentView === "date" && moment(viewDate).format("MMMM YYYY")}
          {currentView === "month" && moment(viewDate).format("YYYY")}
          {currentView === "year" &&
            `${moment(viewDate).year() - 4} – ${moment(viewDate).year() + 5}`}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(TextColorMain, "cursor-pointer")}
            onClick={goPrev}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={cn(TextColorMain, "cursor-pointer")}
            onClick={goNext}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      {currentView === "year" && (
        <YearGrid
          viewDate={viewDate}
          onYearSelect={(y) => {
            setViewDate(moment(viewDate).year(y).toDate());
            setCurrentView("month");
          }}
        />
      )}
      {currentView === "month" && (
        <MonthGrid
          viewDate={viewDate}
          onMonthSelect={(m) => {
            setViewDate(moment(viewDate).month(m).toDate());
            setCurrentView("date");
          }}
        />
      )}
      {currentView === "date" && (
        <DateGrid
          viewDate={viewDate}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onSelectDate={onSelectDate}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </div>
  );
};

const formatDateRangeLabel = (
  value?: DateRangeValue,
  placeholder = "Select Date Range"
) => {
  if (!value?.startDate && !value?.endDate) return placeholder;
  if (value?.startDate && !value?.endDate)
    return `${moment(value.startDate).format("DD MMM YYYY")} - ...`;
  if (!value?.startDate || !value?.endDate) return placeholder;
  return `${moment(value.startDate).format("DD MMM YYYY")} – ${moment(value.endDate).format("DD MMM YYYY")}`;
};

interface Props extends BaseSelectorProps {
  value?: DateRangeValue;
  setValue?: (value: DateRangeValue) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

const DateRangeSelector = ({
  value,
  setValue,
  disabledDates,
  minDate,
  maxDate,
  hideTrigger,
  open,
  onOpenChange,
  placeholder = "Select Date Range"
}: Props) => {
  const [range, setRange] = React.useState<DateRangeValue>({
    startDate: value?.startDate ?? null,
    endDate: value?.endDate ?? null
  });

  React.useEffect(() => {
    setRange({
      startDate: value?.startDate ?? null,
      endDate: value?.endDate ?? null
    });
  }, [value?.startDate, value?.endDate]);

  const hasValue = !!(range.startDate || range.endDate);

  const handleSelectDate = (date: Date) => {
    let nextRange: DateRangeValue;
    if (!range.startDate || (range.startDate && range.endDate)) {
      nextRange = { startDate: date, endDate: null };
    } else if (moment(date).isBefore(range.startDate, "day")) {
      nextRange = { startDate: date, endDate: null };
    } else {
      nextRange = { startDate: range.startDate, endDate: date };
    }
    setRange(nextRange);
    setValue?.(nextRange);
    if (nextRange.startDate && nextRange.endDate) onOpenChange?.(false);
  };

  const handleClear = () => {
    const cleared = { startDate: null, endDate: null };
    setRange(cleared);
    setValue?.(cleared);
  };

  return (
    <DropdownMenu.DropdownMenu open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <div className="relative inline-flex">
          <DropdownMenu.DropdownMenuTrigger
            translate="no"
            className={cn(
              "flex items-center justify-between gap-2",
              "h-9 w-full px-3 pr-9 rounded-lg border border-border-primary",
              "bg-background-secondary text-sm cursor-pointer whitespace-nowrap",
              hasValue ? TextColorMain : TextColorSecondary
            )}
          >
            {formatDateRangeLabel(range, placeholder)}
            {!hasValue && (
              <Calendar className="size-4 absolute right-3 pointer-events-none text-text-secondary" />
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
          "w-[310px] rounded-lg border p-3 shadow-md",
          "z-50",
          BackgroundColor,
          MainBorder,
          dropdownAnimationStyles
        )}
      >
        <CalendarPanel
          rangeStart={range.startDate}
          rangeEnd={range.endDate}
          onSelectDate={handleSelectDate}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
          initialViewDate={range.startDate}
        />
        {hasValue && (
          <div className="mt-3 flex justify-end border-t border-border-primary pt-2">
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

export default DateRangeSelector;
