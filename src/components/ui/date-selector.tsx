"use client"

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { ReactDispatch } from '../../types/common'

type ViewType = 'year' | 'month' | 'date'

interface ContentProps {
  value?: Date | null
  setValue?: (value: Date) => void
  onOpenChange?: ReactDispatch<boolean>
  disabledDates?: Date[]
  minDate?: Date
  maxDate?: Date
}

interface Props extends ContentProps {
  hideTrigger?: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: ReactDispatch<boolean>
}

const triggerClassName = cn(
  'rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100',
  'cursor-pointer whitespace-nowrap transition-colors hover:bg-zinc-800',
)

const contentClassName = cn(
  'absolute left-0 top-full z-50 mt-2 w-[320px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl',
)

function useControllableOpen(open?: boolean, onOpenChange?: ReactDispatch<boolean>) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (nextValue: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof nextValue === 'function' ? nextValue(currentOpen) : nextValue
      if (!isControlled) setInternalOpen(resolved)
      onOpenChange?.(resolved)
    },
    [currentOpen, isControlled, onOpenChange],
  )

  return [currentOpen, setOpen] as const
}

function useOutsideDismiss(
  ref: React.RefObject<HTMLDivElement>,
  open: boolean,
  onClose: () => void,
) {
  React.useEffect(() => {
    if (!open) return

    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open, ref])
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function startOfWeek(date: Date) {
  const next = new Date(date)
  next.setDate(date.getDate() - date.getDay())
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfWeek(date: Date) {
  const next = startOfWeek(date)
  next.setDate(next.getDate() + 6)
  return next
}

function getCalendarDays(viewDate: Date) {
  const start = startOfWeek(startOfMonth(viewDate))
  const end = endOfWeek(endOfMonth(viewDate))
  const days: Date[] = []
  const current = new Date(start)

  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isBeforeDay(a: Date, b: Date) {
  return normalizeDate(a).getTime() < normalizeDate(b).getTime()
}

function isAfterDay(a: Date, b: Date) {
  return normalizeDate(a).getTime() > normalizeDate(b).getTime()
}

function checkIfDateDisabled(
  date: Date,
  disabledDates?: Date[],
  minDate?: Date,
  maxDate?: Date,
) {
  if (disabledDates?.some((item) => isSameDay(item, date))) return true
  if (minDate && isBeforeDay(date, minDate)) return true
  if (maxDate && isAfterDay(date, maxDate)) return true
  return false
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

function formatYear(date: Date) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function addYears(date: Date, amount: number) {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1)
}

const DateSelectorContent = ({
  setValue,
  value,
  onOpenChange,
  disabledDates,
  minDate,
  maxDate,
}: ContentProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value ?? null)
  const [currentView, setCurrentView] = React.useState<ViewType>('date')
  const [viewDate, setViewDate] = React.useState<Date>(value ?? new Date())

  const goNext = () => {
    if (currentView === 'date') setViewDate((current) => addMonths(current, 1))
    else if (currentView === 'month') setViewDate((current) => addYears(current, 1))
    else setViewDate((current) => addYears(current, 10))
  }

  const goPrev = () => {
    if (currentView === 'date') setViewDate((current) => addMonths(current, -1))
    else if (currentView === 'month') setViewDate((current) => addYears(current, -1))
    else setViewDate((current) => addYears(current, -10))
  }

  const handleDateSelect = (date: Date) => {
    if (checkIfDateDisabled(date, disabledDates, minDate, maxDate)) return
    setSelectedDate(date)
    setValue?.(date)
    setCurrentView('date')
    onOpenChange?.(false)
  }

  const months = Array.from({ length: 12 }, (_, index) => ({
    index,
    label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      new Date(viewDate.getFullYear(), index, 1),
    ),
  }))

  const startYear = Math.floor(viewDate.getFullYear() / 10) * 10 - 1
  const years = Array.from({ length: 12 }, (_, index) => startYear + index)

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="cursor-pointer font-semibold text-zinc-100 hover:underline"
          onClick={() => {
            if (currentView === 'date') setCurrentView('month')
            else if (currentView === 'month') setCurrentView('year')
          }}
        >
          {currentView === 'date' && formatMonthYear(viewDate)}
          {currentView === 'month' && formatYear(viewDate)}
          {currentView === 'year' && `${viewDate.getFullYear() - 4} - ${viewDate.getFullYear() + 5}`}
        </button>
        <div className="flex items-center gap-2 text-zinc-400">
          <button type="button" onClick={goPrev}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={goNext}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {currentView === 'year' && (
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                setViewDate(new Date(year, viewDate.getMonth(), 1))
                setCurrentView('month')
              }}
              className={cn(
                'flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800',
                year === new Date().getFullYear() && 'bg-zinc-900',
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {currentView === 'month' && (
        <div className="grid grid-cols-3 gap-2">
          {months.map((month) => (
            <button
              key={month.index}
              type="button"
              onClick={() => {
                setViewDate(new Date(viewDate.getFullYear(), month.index, 1))
                setCurrentView('date')
              }}
              className={cn(
                'flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800',
                month.index === new Date().getMonth() &&
                  viewDate.getFullYear() === new Date().getFullYear() &&
                  'bg-zinc-900',
              )}
            >
              {month.label}
            </button>
          ))}
        </div>
      )}

      {currentView === 'date' && (
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((label) => (
            <div key={label} className="text-center text-xs font-medium text-zinc-400">
              {label}
            </div>
          ))}

          {getCalendarDays(viewDate).map((day) => {
            const disabled = checkIfDateDisabled(day, disabledDates, minDate, maxDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => handleDateSelect(day)}
                className={cn(
                  'flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  disabled && 'cursor-not-allowed text-zinc-600',
                  !disabled && isSelected && 'bg-violet-600 text-white hover:bg-violet-600',
                  !disabled && !isSelected && isToday && 'bg-zinc-900 font-semibold text-zinc-100',
                  !disabled && !isSelected && !isToday && isSameMonth(day, viewDate) && 'text-zinc-100 hover:bg-zinc-800',
                  !disabled && !isSelected && !isToday && !isSameMonth(day, viewDate) && 'text-zinc-500 hover:bg-zinc-800',
                )}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

export default function DateSelector({
  hideTrigger,
  trigger,
  open,
  onOpenChange,
  ...rest
}: Props) {
  const [isOpen, setIsOpen] = useControllableOpen(open, onOpenChange)
  const rootRef = React.useRef<HTMLDivElement>(null)

  useOutsideDismiss(rootRef, isOpen, () => setIsOpen(false))

  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger ? (
        <div onClick={() => setIsOpen((value) => !value)}>{trigger}</div>
      ) : hideTrigger ? null : (
        <button type="button" className={triggerClassName} onClick={() => setIsOpen((value) => !value)}>
          {rest.value ? formatDateLabel(rest.value) : 'Select Date'}
        </button>
      )}

      {isOpen && (
        <div className={contentClassName}>
          <DateSelectorContent {...rest} onOpenChange={onOpenChange} />
        </div>
      )}
    </div>
  )
}
