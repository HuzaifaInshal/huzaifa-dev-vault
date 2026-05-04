"use client";

import * as React from "react";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { cn } from "@/lib/utils";
import { ReactDispatch } from "@/types/common";

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

  if (dateDisabled) {
    return cn("text-sm font-medium rounded-full", TextColorDisabled);
  }

  if (isRangeStart || isRangeEnd) {
    return cn(
      "text-sm font-medium rounded-full font-bold text-safed",
      MainBackground,
      `hover:${MainBackground}`
    );
  }

  if (inRange) {
    return cn(
      "text-sm font-medium rounded-full bg-primary/12 text-primary",
      "hover:bg-primary/12"
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
  if (value?.startDate && !value?.endDate) {
    return `${moment(value.startDate).format("DD MMM YYYY")} - ...`;
  }
  if (!value?.startDate || !value?.endDate) return placeholder;

  return `${moment(value.startDate).format("DD MMM YYYY")} - ${moment(
    value.endDate
  ).format("DD MMM YYYY")}`;
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
  value?: DateRangeValue;
  setValue?: (value: DateRangeValue) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const DateRangeSelector = ({
  value,
  setValue,
  disabledDates,
  minDate,
  maxDate,
  ...rest
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

    if (nextRange.startDate && nextRange.endDate) {
      rest.onOpenChange?.(false);
    }
  };

  return (
    <SelectorRoot {...rest} triggerLabel={formatDateRangeLabel(range)}>
      <SelectorContent>
        <CalendarPanel
          rangeStart={range.startDate}
          rangeEnd={range.endDate}
          onSelectDate={handleSelectDate}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
          initialViewDate={range.startDate}
        />
      </SelectorContent>
    </SelectorRoot>
  );
};

export default DateRangeSelector;