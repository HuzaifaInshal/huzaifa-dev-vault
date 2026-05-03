"use client"

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { ReactDispatch } from '../../types/common'

type ViewType = 'year' | 'month' | 'date'

interface Props {
  hideTrigger?: boolean
  open?: boolean
  onOpenChange?: ReactDispatch<boolean>
  value?: Date | null
  setValue?: (value: Date) => void
  disabledDates?: Date[]
  minDate?: Date
  maxDate?: Date
  minuteStep?: number
}

const triggerClassName = cn(
  'rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100',
  'cursor-pointer whitespace-nowrap transition-colors hover:bg-zinc-800',
)

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function checkIfDateDisabled(date: Date, disabledDates?: Date[], minDate?: Date, maxDate?: Date) {
  if (disabledDates?.some((item) => isSameDay(item, date))) return true
  if (minDate && normalizeDate(date) < normalizeDate(minDate)) return true
  if (maxDate && normalizeDate(date) > normalizeDate(maxDate)) return true
  return false
}

function formatDateTimeLabel(value?: Date | null, placeholder = 'Select Date & Time') {
  return value
    ? new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(value)
    : placeholder
}

function formatTimeValue(time?: string | null) {
  if (!time) return ''
  const [rawHour = '00', rawMinute = '00'] = time.split(':')
  const hour24 = Number(rawHour)
  const hour12 = hour24 % 12 || 12
  const period = hour24 >= 12 ? 'PM' : 'AM'
  return `${hour12.toString().padStart(2, '0')}:${rawMinute} ${period}`
}

function extractTimeFromDate(date?: Date | null) {
  if (!date) return null
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function combineDateAndTime(date: Date, time: string) {
  const [hour, minute] = time.split(':').map(Number)
  const next = new Date(date)
  next.setHours(hour, minute, 0, 0)
  return next
}

function detectSystem24HourFormat() {
  try {
    const formatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric' })
    return !formatter
      .formatToParts(new Date(2026, 0, 1, 13, 0))
      .some((part) => part.type === 'dayPeriod')
  } catch {
    return false
  }
}

function parseTimeParts(value?: string | null) {
  const [rawHour = '00', rawMinute = '00'] = (value ?? '00:00').split(':')
  const hour24 = Number(rawHour)
  const minute = Number(rawMinute)
  return {
    hour24,
    minute,
    hour12: (hour24 % 12 || 12).toString().padStart(2, '0'),
    period: hour24 >= 12 ? ('PM' as const) : ('AM' as const),
  }
}

function composeTimeValue({
  hour24,
  hour12,
  minute,
  period,
  is24Hour,
}: {
  hour24: number
  hour12: string
  minute: number
  period: 'AM' | 'PM'
  is24Hour: boolean
}) {
  if (is24Hour) return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  const normalizedHour = Number(hour12) % 12
  const nextHour24 = period === 'PM' ? normalizedHour + 12 : normalizedHour
  return `${nextHour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export default function DateTimeSelector({
  value,
  setValue,
  disabledDates,
  minDate,
  maxDate,
  minuteStep = 1,
  hideTrigger,
  open,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value ?? null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(extractTimeFromDate(value))
  const [currentView, setCurrentView] = React.useState<ViewType>('date')
  const [viewDate, setViewDate] = React.useState<Date>(value ?? new Date())
  const [is24Hour, setIs24Hour] = React.useState(() => detectSystem24HourFormat())
  const hourRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const minuteRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const periodRefs = React.useRef<Record<'AM' | 'PM', HTMLButtonElement | null>>({ AM: null, PM: null })
  const rootRef = React.useRef<HTMLDivElement>(null)

  const isOpen = open ?? internalOpen
  const setOpen = (nextValue: boolean) => {
    if (open === undefined) setInternalOpen(nextValue)
    onOpenChange?.(nextValue)
  }

  React.useEffect(() => {
    setSelectedDate(value ?? null)
    setSelectedTime(extractTimeFromDate(value))
  }, [value])

  React.useEffect(() => {
    setIs24Hour(detectSystem24HourFormat())
  }, [])

  React.useEffect(() => {
    if (!isOpen) return
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [isOpen])

  const commitIfReady = (nextDate: Date | null, nextTime: string | null) => {
    if (!nextDate || !nextTime) return
    const nextValue = combineDateAndTime(nextDate, nextTime)
    setValue?.(nextValue)
    setOpen(false)
  }

  const days = (() => {
    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
    end.setDate(end.getDate() + (6 - end.getDay()))
    const result: Date[] = []
    const current = new Date(start)
    while (current <= end) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  })()

  const parsed = parseTimeParts(selectedTime)
  const safeMinuteStep = Math.max(1, minuteStep)
  const hours = is24Hour
    ? Array.from({ length: 24 }, (_, hour) => hour.toString().padStart(2, '0'))
    : Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'))
  const minutes = Array.from(
    { length: Math.ceil(60 / safeMinuteStep) },
    (_, index) => (index * safeMinuteStep).toString().padStart(2, '0'),
  ).filter((minute) => Number(minute) < 60)

  React.useEffect(() => {
    const selectedHourKey = is24Hour ? parsed.hour24.toString().padStart(2, '0') : parsed.hour12
    const selectedMinuteKey = parsed.minute.toString().padStart(2, '0')
    hourRefs.current[selectedHourKey]?.scrollIntoView({ block: 'center' })
    minuteRefs.current[selectedMinuteKey]?.scrollIntoView({ block: 'center' })
    if (!is24Hour) periodRefs.current[parsed.period]?.scrollIntoView({ block: 'center' })
  }, [is24Hour, parsed.hour12, parsed.hour24, parsed.minute, parsed.period])

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
        <button type="button" className={triggerClassName} onClick={() => setOpen(!isOpen)}>
          {formatDateTimeLabel(value)}
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[360px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
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
              <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - (currentView === 'date' ? 1 : 0), 1))}>
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    currentView === 'date'
                      ? new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                      : currentView === 'month'
                        ? new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)
                        : new Date(viewDate.getFullYear() + 10, viewDate.getMonth(), 1),
                  )
                }
              >
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
                  className="flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
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

              {days.map((day) => {
                const disabled = checkIfDateDisabled(day, disabledDates, minDate, maxDate)
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(day)
                      commitIfReady(day, selectedTime)
                    }}
                    className={cn(
                      'flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
                      disabled && 'cursor-not-allowed text-zinc-600',
                      !disabled &&
                        selectedDate &&
                        isSameDay(day, selectedDate) &&
                        'bg-violet-600 text-white hover:bg-violet-600',
                      !disabled &&
                        (!selectedDate || !isSameDay(day, selectedDate)) &&
                        isSameMonth(day, viewDate) &&
                        'text-zinc-100 hover:bg-zinc-800',
                      !disabled &&
                        (!selectedDate || !isSameDay(day, selectedDate)) &&
                        !isSameMonth(day, viewDate) &&
                        'text-zinc-500 hover:bg-zinc-800',
                    )}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          )}

          <div className="mt-4 border-t border-zinc-800 pt-4">
            <p className="mb-3 text-sm font-medium text-zinc-200">
              Select Time {selectedTime ? `(${formatTimeValue(selectedTime)})` : ''}
            </p>
            <div className={cn('grid gap-3', is24Hour ? 'grid-cols-2' : 'grid-cols-3')}>
              {[
                { label: 'Hour', values: hours, refMap: hourRefs.current },
                { label: 'Minute', values: minutes, refMap: minuteRefs.current },
              ].map((column, index) => (
                <div key={column.label} className="max-h-56 overflow-y-auto rounded-lg border border-zinc-800 p-1 pt-0">
                  <p className="sticky top-0 z-10 mb-2 bg-zinc-950 px-2 py-2 text-xs font-medium text-zinc-400">
                    {column.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {column.values.map((entry) => {
                      const isSelected =
                        index === 0
                          ? is24Hour
                            ? parsed.hour24 === Number(entry)
                            : parsed.hour12 === entry
                          : parsed.minute === Number(entry)
                      return (
                        <button
                          key={entry}
                          type="button"
                          ref={(node) => {
                            column.refMap[entry] = node
                          }}
                          onClick={() => {
                            const nextValue =
                              index === 0
                                ? composeTimeValue({
                                    hour24: Number(entry),
                                    hour12: entry,
                                    minute: parsed.minute,
                                    period: parsed.period,
                                    is24Hour,
                                  })
                                : composeTimeValue({
                                    hour24: parsed.hour24,
                                    hour12: parsed.hour12,
                                    minute: Number(entry),
                                    period: parsed.period,
                                    is24Hour,
                                  })
                            setSelectedTime(nextValue)
                            commitIfReady(selectedDate, nextValue)
                          }}
                          className={cn(
                            'flex h-9 items-center justify-start rounded-md px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800',
                            isSelected && 'bg-violet-600 text-white hover:bg-violet-600',
                          )}
                        >
                          {entry}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {!is24Hour && (
                <div className="max-h-56 overflow-y-auto rounded-lg border border-zinc-800 p-1 pt-0">
                  <p className="sticky top-0 z-10 mb-2 bg-zinc-950 px-2 py-2 text-xs font-medium text-zinc-400">
                    Period
                  </p>
                  <div className="flex flex-col gap-1">
                    {(['AM', 'PM'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        ref={(node) => {
                          periodRefs.current[period] = node
                        }}
                        onClick={() => {
                          const nextValue = composeTimeValue({
                            hour24: parsed.hour24,
                            hour12: parsed.hour12,
                            minute: parsed.minute,
                            period,
                            is24Hour: false,
                          })
                          setSelectedTime(nextValue)
                          commitIfReady(selectedDate, nextValue)
                        }}
                        className={cn(
                          'flex h-9 items-center justify-start rounded-md px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800',
                          parsed.period === period && 'bg-violet-600 text-white hover:bg-violet-600',
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
