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
  triggerClassName?: string;
}

interface Props extends BaseSelectorProps {
  value?: DateRangeValue;
  setValue?: (value: DateRangeValue) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

const isDisabled = (
  date: Date,
  disabledDates?: Date[],
  minDate?: Date,
  maxDate?: Date
) => {
  if (disabledDates?.some((d) => moment(date).isSame(d, "day"))) return true;
  if (minDate && moment(date).isBefore(minDate, "day")) return true;
  if (maxDate && moment(date).isAfter(maxDate, "day")) return true;
  return false;
};

const formatLabel = (
  value?: DateRangeValue,
  placeholder = "Select Date Range"
) => {
  if (!value?.startDate && !value?.endDate) return placeholder;
  if (value.startDate && !value.endDate)
    return `${moment(value.startDate).format("DD MMM YYYY")} - ...`;
  if (!value.startDate || !value.endDate) return placeholder;
  return `${moment(value.startDate).format("DD MMM YYYY")} – ${moment(value.endDate).format("DD MMM YYYY")}`;
};

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MonthGrid = ({
  viewDate,
  rangeStart,
  rangeEnd,
  hoverDate,
  onSelectDate,
  onHoverDate,
  disabledDates,
  minDate,
  maxDate
}: {
  viewDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  onSelectDate: (date: Date) => void;
  onHoverDate: (date: Date | null) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}) => {
  const start = moment(viewDate).startOf("month").startOf("week");
  const end = moment(viewDate).endOf("month").endOf("week");
  const days: Date[] = [];
  const cur = moment(start);
  while (cur.isSameOrBefore(end)) {
    days.push(cur.toDate());
    cur.add(1, "day");
  }

  const effectiveEnd =
    rangeEnd ??
    (rangeStart &&
    hoverDate &&
    moment(hoverDate).isSameOrAfter(rangeStart, "day")
      ? hoverDate
      : null);

  return (
    <div className="grid grid-cols-7">
      {DAY_LABELS.map((d) => (
        <div
          key={d}
          className="flex h-9 items-center justify-center text-xs font-medium text-text-secondary"
        >
          {d}
        </div>
      ))}
      {days.map((day) => {
        const isCurrentMonth = moment(day).isSame(viewDate, "month");
        const disabled =
          !isCurrentMonth || isDisabled(day, disabledDates, minDate, maxDate);
        const isToday = moment(day).isSame(moment(), "day");
        const isStart = rangeStart
          ? moment(day).isSame(rangeStart, "day")
          : false;
        const isEnd = rangeEnd ? moment(day).isSame(rangeEnd, "day") : false;
        const isHoverEnd =
          !rangeEnd && hoverDate ? moment(day).isSame(hoverDate, "day") : false;
        const inConfirmedRange =
          rangeStart && rangeEnd
            ? moment(day).isBetween(rangeStart, rangeEnd, "day", "()")
            : false;
        const inPreviewRange =
          !rangeEnd && rangeStart && effectiveEnd
            ? moment(day).isBetween(rangeStart, effectiveEnd, "day", "()")
            : false;
        const isSelected = isStart || isEnd;
        const isPreviewEdge = isHoverEnd && !rangeEnd;

        const squareBase =
          "relative flex h-9 w-full items-center justify-center text-sm font-medium transition-colors";
        let bgClass = "";
        let textClass = isCurrentMonth
          ? "text-text-primary"
          : "text-transparent select-none pointer-events-none";
        let innerClass =
          "z-10 flex h-8 w-8 items-center justify-center rounded-sm";

        if (disabled) {
          textClass = "text-gray-300 cursor-not-allowed";
        } else if (isSelected || isPreviewEdge) {
          bgClass = inConfirmedRange || inPreviewRange ? "bg-primary/10" : "";
          innerClass = cn(
            innerClass,
            "bg-primary text-background font-semibold"
          );
          textClass = "";
        } else if (inConfirmedRange) {
          bgClass = "bg-primary/10";
          textClass = "text-primary font-medium";
        } else if (inPreviewRange) {
          bgClass = "bg-primary/5";
          textClass = "text-primary/70";
        } else if (isToday) {
          innerClass = cn(
            innerClass,
            "bg-background-secondary font-bold text-text-primary"
          );
          textClass = "";
        }

        const isRangeLeftEdge =
          isStart || (inConfirmedRange && moment(day).day() === 0);
        const isRangeRightEdge =
          isEnd || (inConfirmedRange && moment(day).day() === 6);
        const isPreviewLeftEdge =
          isStart || (inPreviewRange && moment(day).day() === 0);
        const isPreviewRightEdge =
          isPreviewEdge || (inPreviewRange && moment(day).day() === 6);

        const rangeBgRounded = cn(
          bgClass && "w-full",
          bgClass,
          (isRangeLeftEdge || isPreviewLeftEdge) && bgClass && "rounded-l-sm",
          (isRangeRightEdge || isPreviewRightEdge) && bgClass && "rounded-r-sm"
        );

        return (
          <div
            key={day.toISOString()}
            className={cn(squareBase, rangeBgRounded)}
            onMouseEnter={() => !disabled && onHoverDate(day)}
            onMouseLeave={() => onHoverDate(null)}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(day)}
              className={cn(
                innerClass,
                textClass,
                !disabled &&
                  !isSelected &&
                  !isPreviewEdge &&
                  "hover:bg-background-secondary hover:text-text-primary",
                disabled && "cursor-not-allowed"
              )}
            >
              {moment(day).date()}
            </button>
          </div>
        );
      })}
    </div>
  );
};

const MonthPicker = ({
  viewDate,
  onSelect
}: {
  viewDate: Date;
  onSelect: (month: number) => void;
}) => (
  <div className="grid grid-cols-3 gap-2">
    {Array.from({ length: 12 }, (_, i) => {
      const isCurrent = moment().isSame(moment(viewDate).month(i), "month");
      return (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "rounded-md px-2 py-2 text-sm font-medium text-text-primary hover:bg-background-secondary",
            isCurrent && "bg-background-secondary font-bold"
          )}
        >
          {moment(viewDate).month(i).format("MMM")}
        </button>
      );
    })}
  </div>
);

const YearPicker = ({
  viewDate,
  onSelect
}: {
  viewDate: Date;
  onSelect: (year: number) => void;
}) => {
  const startYear = Math.floor(moment(viewDate).year() / 10) * 10 - 1;
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 12 }, (_, i) => {
        const year = startYear + i;
        const isCurrent = moment().year() === year;
        return (
          <button
            key={year}
            type="button"
            onClick={() => onSelect(year)}
            className={cn(
              "rounded-md px-2 py-2 text-sm font-medium text-text-primary hover:bg-background-secondary",
              isCurrent && "bg-background-secondary font-bold"
            )}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};

const DateRangeSelectorV2 = ({
  value,
  setValue,
  disabledDates,
  minDate,
  maxDate,
  hideTrigger,
  open,
  onOpenChange,
  triggerClassName,
  placeholder = "Select Date Range"
}: Props) => {
  const [range, setRange] = React.useState<DateRangeValue>({
    startDate: value?.startDate ?? null,
    endDate: value?.endDate ?? null
  });
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [viewDate, setViewDate] = React.useState<Date>(
    value?.startDate ?? new Date()
  );
  const [view, setView] = React.useState<ViewType>("date");

  React.useEffect(() => {
    setRange({
      startDate: value?.startDate ?? null,
      endDate: value?.endDate ?? null
    });
  }, [value?.startDate, value?.endDate]);

  const leftMonth = viewDate;
  const rightMonth = moment(viewDate).add(1, "month").toDate();

  const handleSelectDate = (date: Date) => {
    if (!range.startDate || (range.startDate && range.endDate)) {
      setRange({ startDate: date, endDate: null });
      return;
    }
    if (moment(date).isBefore(range.startDate, "day")) {
      setRange({ startDate: date, endDate: null });
      return;
    }
    const next = { startDate: range.startDate, endDate: date };
    setRange(next);
    setValue?.(next);
    setHoverDate(null);
    onOpenChange?.(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && (!range.startDate || !range.endDate)) {
      setRange({
        startDate: value?.startDate ?? null,
        endDate: value?.endDate ?? null
      });
      setHoverDate(null);
    }
    onOpenChange?.(next);
  };

  const goNext = () => {
    if (view === "date") setViewDate(moment(viewDate).add(1, "month").toDate());
    else if (view === "month")
      setViewDate(moment(viewDate).add(1, "year").toDate());
    else setViewDate(moment(viewDate).add(10, "year").toDate());
  };
  const goPrev = () => {
    if (view === "date")
      setViewDate(moment(viewDate).subtract(1, "month").toDate());
    else if (view === "month")
      setViewDate(moment(viewDate).subtract(1, "year").toDate());
    else setViewDate(moment(viewDate).subtract(10, "year").toDate());
  };

  const headerLabel =
    view === "date"
      ? `${moment(leftMonth).format("MMM YYYY")} – ${moment(rightMonth).format("MMM YYYY")}`
      : view === "month"
        ? moment(viewDate).format("YYYY")
        : `${Math.floor(moment(viewDate).year() / 10) * 10 - 1} – ${Math.floor(moment(viewDate).year() / 10) * 10 + 10}`;

  const hasDates = !!(range.startDate || range.endDate);

  const handleClear = () => {
    const cleared = { startDate: null, endDate: null };
    setRange(cleared);
    setValue?.(cleared);
    setHoverDate(null);
  };

  return (
    <DropdownMenu.DropdownMenu open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <div className="relative inline-flex">
          <DropdownMenu.DropdownMenuTrigger
            className={cn(
              "flex items-center justify-between gap-2",
              "h-9 w-full px-3 pr-9 rounded-lg border border-border-primary",
              "bg-background-secondary text-sm cursor-pointer whitespace-nowrap",
              hasDates ? "text-text-primary" : "text-text-secondary",
              triggerClassName
            )}
          >
            {formatLabel(range, placeholder)}
            {!hasDates && (
              <Calendar className="size-4 absolute right-3 pointer-events-none text-text-secondary" />
            )}
          </DropdownMenu.DropdownMenuTrigger>
          {hasDates && (
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
          "w-fit rounded-lg border border-border-primary bg-background p-4 shadow-md",
          "z-50",
          dropdownAnimationStyles
        )}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (view === "date") setView("month");
              else if (view === "month") setView("year");
            }}
            className="cursor-pointer font-semibold text-text-primary hover:underline text-sm"
          >
            {headerLabel}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="cursor-pointer text-text-primary"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="cursor-pointer text-text-primary"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {view === "year" && (
          <YearPicker
            viewDate={viewDate}
            onSelect={(y) => {
              setViewDate(moment(viewDate).year(y).toDate());
              setView("month");
            }}
          />
        )}
        {view === "month" && (
          <MonthPicker
            viewDate={viewDate}
            onSelect={(m) => {
              setViewDate(moment(viewDate).month(m).toDate());
              setView("date");
            }}
          />
        )}

        {view === "date" && (
          <div className="flex gap-6">
            <div className="w-[280px]">
              <div className="mb-2 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {moment(leftMonth).format("MMMM YYYY")}
              </div>
              <MonthGrid
                viewDate={leftMonth}
                rangeStart={range.startDate}
                rangeEnd={range.endDate}
                hoverDate={hoverDate}
                onSelectDate={handleSelectDate}
                onHoverDate={setHoverDate}
                disabledDates={disabledDates}
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
            <div className="w-px bg-border-primary" />
            <div className="w-[280px]">
              <div className="mb-2 text-center text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {moment(rightMonth).format("MMMM YYYY")}
              </div>
              <MonthGrid
                viewDate={rightMonth}
                rangeStart={range.startDate}
                rangeEnd={range.endDate}
                hoverDate={hoverDate}
                onSelectDate={handleSelectDate}
                onHoverDate={setHoverDate}
                disabledDates={disabledDates}
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          </div>
        )}

        {view === "date" && (
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-xs text-text-secondary">
              {!range.startDate
                ? "Click to select start date"
                : !range.endDate
                  ? "Click to select end date"
                  : `${moment(range.startDate).format("DD MMM YYYY")} – ${moment(range.endDate).format("DD MMM YYYY")}`}
            </div>
            {hasDates && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 rounded-md border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.DropdownMenu>
  );
};

export default DateRangeSelectorV2;
