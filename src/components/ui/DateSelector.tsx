"use client";
import moment from "moment";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { ReactDispatch } from "@/types/common";
import { dropdownAnimationStyles } from "@/styles/ui/inputStyles";

export type ViewType = "year" | "month" | "date";

interface MonthViewProps {
  viewDate: Date;
  onMonthSelect: (month: number) => void;
}

interface DateViewProps {
  viewDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

interface YearViewProps {
  viewDate: Date;
  onYearSelect: (year: number) => void;
}

interface ReturnClassessProps {
  dateDisabled: boolean;
  selected: boolean;
  isCurrentMonth: boolean;
  today: boolean;
}

interface ContentProps {
  value?: Date;
  setValue?: (_args: Date) => void;
  onOpenChange?: (_args: boolean) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  onClear?: () => void;
}

interface ButtonProps {
  onClick?: VoidFunction;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface Props extends ContentProps {
  hideTrigger?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: ReactDispatch<boolean>;
  placeholder?: string;
}

const MainBackground = "bg-primary";
const SecondaryBackground = "bg-background-secondary";
const BackgroundColor = "bg-background";
const TextColorMain = "text-text-primary";
const TextColorSecondary = "text-text-secondary";
const TextColorDisabled = "text-gray-400";
const MainBorder = "border-border-primary shadow-md";

const DateSelectorContent = ({
  setValue,
  value,
  onOpenChange,
  disabledDates,
  minDate,
  maxDate,
  onClear
}: ContentProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [currentView, setCurrentView] = useState<ViewType>("date");
  const [viewDate, setViewDate] = useState<Date>(value ?? new Date());

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

  const handleDateSelect = (date: Date) => {
    if (checkIfDateDisabled(date, disabledDates, minDate, maxDate)) return;
    setSelectedDate(date);
    setValue?.(date);
    setCurrentView("date");
    onOpenChange?.(false);
  };

  return (
    <DropdownMenu.Content
      translate="no"
      sideOffset={8}
      className={cn(
        "w-72 p-3 z-50 rounded-lg border",
        "z-50",
        BackgroundColor,
        MainBorder,
        dropdownAnimationStyles
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          className={cn(
            TextColorMain,
            "font-semibold hover:underline cursor-pointer text-sm"
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
        <YearView
          viewDate={viewDate}
          onYearSelect={(year) => {
            setViewDate(moment(viewDate).year(year).toDate());
            setCurrentView("month");
          }}
        />
      )}
      {currentView === "month" && (
        <MonthView
          viewDate={viewDate}
          onMonthSelect={(month) => {
            setViewDate(moment(viewDate).month(month).toDate());
            setCurrentView("date");
          }}
        />
      )}
      {currentView === "date" && (
        <DateView
          viewDate={viewDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}

      {currentView === "date" && selectedDate && (
        <div className="mt-3 flex justify-end border-t border-border-primary pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              onClear?.();
            }}
            className="flex items-center gap-1 rounded-md border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </DropdownMenu.Content>
  );
};

const checkIfDateDisabled = (
  date: Date,
  disabledDates?: Date[],
  minDate?: Date,
  maxDate?: Date
): boolean => {
  if (disabledDates?.some((d) => moment(date).isSame(d, "day"))) return true;
  if (minDate && moment(date).isBefore(moment(minDate), "day")) return true;
  if (maxDate && moment(date).isAfter(moment(maxDate), "day")) return true;
  return false;
};

const returnClassess = ({
  dateDisabled,
  selected,
  isCurrentMonth,
  today
}: ReturnClassessProps) => {
  const main = "text-sm font-medium rounded-full";
  let sec = "";
  if (dateDisabled) sec = `${TextColorDisabled} !cursor-not-allowed`;
  else if (selected) sec = `${MainBackground} text-background font-bold`;
  else if (today) sec = `font-bold ${SecondaryBackground}`;
  else if (isCurrentMonth) sec = TextColorMain;
  else sec = TextColorSecondary;
  return `${main} ${sec}`;
};

const DateView: React.FC<DateViewProps> = ({
  viewDate,
  selectedDate,
  onDateSelect,
  disabledDates,
  minDate,
  maxDate
}) => {
  const start = moment(viewDate).startOf("month").startOf("week");
  const end = moment(viewDate).endOf("month").add(6, "day");
  const days: Date[] = [];
  let current = moment(start);
  while (current.isSameOrBefore(end)) {
    days.push(current.toDate());
    current = current.add(1, "day");
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
        <div
          key={d}
          className={cn("text-center font-medium text-xs", TextColorSecondary)}
        >
          {d}
        </div>
      ))}
      {days.map((day) => {
        const isCurrentMonth =
          moment(day).format("MM") === moment(viewDate).format("MM");
        const selected = selectedDate
          ? moment(day).isSame(selectedDate, "day")
          : false;
        const today = moment(day).isSame(moment(), "day");
        const dateDisabled = checkIfDateDisabled(
          day,
          disabledDates,
          minDate,
          maxDate
        );
        return (
          <Button
            key={day.toString()}
            className={cn(
              returnClassess({ dateDisabled, isCurrentMonth, selected, today })
            )}
            onClick={() => onDateSelect(day)}
            disabled={dateDisabled}
          >
            {moment(day).date()}
          </Button>
        );
      })}
    </div>
  );
};

const MonthView: React.FC<MonthViewProps> = ({ viewDate, onMonthSelect }) => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: moment(viewDate).month(i).format("MMM"),
    date: moment(viewDate).month(i).toDate()
  }));
  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map(({ label, date }, i) => (
        <Button
          key={i}
          onClick={() => onMonthSelect(i)}
          className={cn(
            "font-medium",
            moment(date).isSame(moment(), "month") &&
              `font-bold ${SecondaryBackground}`
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

const YearView: React.FC<YearViewProps> = ({ viewDate, onYearSelect }) => {
  const startYear = Math.floor(moment(viewDate).year() / 10) * 10 - 1;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);
  return (
    <div className="grid grid-cols-3 gap-2">
      {years.map((year) => (
        <Button
          key={year}
          onClick={() => onYearSelect(year)}
          className={cn(
            "font-medium",
            moment().year() === year && `font-bold ${SecondaryBackground}`
          )}
        >
          {year}
        </Button>
      ))}
    </div>
  );
};

const Button = ({ onClick, children, className, disabled }: ButtonProps) => (
  <button
    type="button"
    onClick={() => !disabled && onClick?.()}
    disabled={disabled}
    className={cn(
      "h-9 min-w-9 p-1 cursor-pointer flex items-center justify-center rounded-md text-sm",
      !disabled && `hover:${SecondaryBackground} hover:${TextColorMain}`,
      disabled && "cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);

const DateSelector = ({
  hideTrigger,
  trigger,
  open,
  onOpenChange,
  placeholder = "Select Date",
  ...rest
}: Props) => {
  const hasValue = !!rest.value;

  const handleClear = () => {
    rest.setValue?.(undefined as unknown as Date);
  };

  return (
    <DropdownMenu.DropdownMenu onOpenChange={onOpenChange} open={open}>
      {trigger ? (
        <DropdownMenu.DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenu.DropdownMenuTrigger>
      ) : hideTrigger ? null : (
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
            {hasValue ? moment(rest.value).format("DD MMM YYYY") : placeholder}
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
      <DateSelectorContent
        {...rest}
        onOpenChange={onOpenChange}
        onClear={handleClear}
      />
    </DropdownMenu.DropdownMenu>
  );
};

export default DateSelector;
