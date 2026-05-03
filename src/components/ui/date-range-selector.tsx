"use client"

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { ReactDispatch } from '../../types/common'

type ViewType = 'year' | 'month' | 'date'

export interface DateRangeValue {
  startDate: Date | null
  endDate: Date | null
}

interface Props {
  hideTrigger?: boolean
  open?: boolean
  onOpenChange?: ReactDispatch<boolean>
  value?: DateRangeValue
  setValue?: (value: DateRangeValue) => void
  disabledDates?: Date[]
  minDate?: Date
  maxDate?: Date
}

const triggerClassName = cn(
  'rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100',
  'cursor-pointer whitespace-nowrap transition-colors hover:bg-zinc-800',
)

const contentClassName =
  'absolute left-0 top-full z-50 mt-2 w-[320px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl'

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

function useOutsideDismiss(ref: React.RefObject<HTMLDivElement>, open: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!open) return
    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [onClose, open, ref])
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
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

function isBetweenInclusive(date: Date, start: Date, end: Date) {
  const time = normalizeDate(date).getTime()
  return time >= normalizeDate(start).getTime() && time <= normalizeDate(end).getTime()
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
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

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function checkIfDateDisabled(date: Date, disabledDates?: Date[], minDate?: Date, maxDate?: Date) {
  if (disabledDates?.some((item) => isSameDay(item, date))) return true
  if (minDate && isBeforeDay(date, minDate)) return true
  if (maxDate && isAfterDay(date, maxDate)) return true
  return false
}

function formatDateRangeLabel(value?: DateRangeValue, placeholder = 'Select Date Range') {
  if (!value?.startDate && !value?.endDate) return placeholder
  if (value?.startDate && !value?.endDate) return `${formatDateLabel(value.startDate)} - ...`
  if (!value?.startDate || !value?.endDate) return placeholder
  return `${formatDateLabel(value.startDate)} - ${formatDateLabel(value.endDate)}`
}

export default function DateRangeSelector({
  value,
  setValue,
  disabledDates,
  minDate,
  maxDate,
  hideTrigger,
  open,
  onOpenChange,
}: Props) {
  const [isOpen, setIsOpen] = useControllableOpen(open, onOpenChange)
  const [range, setRange] = React.useState<DateRangeValue>(value ?? { startDate: null, endDate: null })
  const [currentView, setCurrentView] = React.useState<ViewType>('date')
  const [viewDate, setViewDate] = React.useState<Date>(value?.startDate ?? new Date())
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setRange(value ?? { startDate: null, endDate: null })
  }, [value])

  useOutsideDismiss(rootRef, isOpen, () => setIsOpen(false))

  const goNext = () => {
    if (currentView === 'date') setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
    else if (currentView === 'month') setViewDate((current) => new Date(current.getFullYear() + 1, current.getMonth(), 1))
    else setViewDate((current) => new Date(current.getFullYear() + 10, current.getMonth(), 1))
  }

  const goPrev = () => {
    if (currentView === 'date') setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
    else if (currentView === 'month') setViewDate((current) => new Date(current.getFullYear() - 1, current.getMonth(), 1))
    else setViewDate((current) => new Date(current.getFullYear() - 10, current.getMonth(), 1))
  }

  const handleSelectDate = (date: Date) => {
    let nextRange: DateRangeValue
    if (!range.startDate || (range.startDate && range.endDate)) {
      nextRange = { startDate: date, endDate: null }
    } else if (isBeforeDay(date, range.startDate)) {
      nextRange = { startDate: date, endDate: null }
    } else {
      nextRange = { startDate: range.startDate, endDate: date }
    }
    setRange(nextRange)
    setValue?.(nextRange)
    if (nextRange.startDate && nextRange.endDate) onOpenChange?.(false)
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
    <div ref={rootRef} className="relative inline-block">
      {hideTrigger ? null : (
        <button type="button" className={triggerClassName} onClick={() => setIsOpen((prev) => !prev)}>
          {formatDateRangeLabel(range)}
        </button>
      )}

      {isOpen && (
        <div className={contentClassName}>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="cursor-pointer font-semibold text-zinc-100 hover:underline"
              onClick={() => {
                if (currentView === 'date') setCurrentView('month')
                else if (currentView === 'month') setCurrentView('year')
              }}
            >
              {currentView === 'date' &&
                new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate)}
              {currentView === 'month' &&
                new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(viewDate)}
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
                const isStart = range.startDate ? isSameDay(day, range.startDate) : false
                const isEnd = range.endDate ? isSameDay(day, range.endDate) : false
                const inRange =
                  range.startDate && range.endDate && isBetweenInclusive(day, range.startDate, range.endDate)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDate(day)}
                    className={cn(
                      'flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
                      disabled && 'cursor-not-allowed text-zinc-600',
                      !disabled && (isStart || isEnd) && 'bg-violet-600 text-white hover:bg-violet-600',
                      !disabled && !isStart && !isEnd && inRange && 'bg-violet-600/15 text-violet-300',
                      !disabled && !isStart && !isEnd && !inRange && isSameMonth(day, viewDate) && 'text-zinc-100 hover:bg-zinc-800',
                      !disabled && !isStart && !isEnd && !inRange && !isSameMonth(day, viewDate) && 'text-zinc-500 hover:bg-zinc-800',
                    )}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
