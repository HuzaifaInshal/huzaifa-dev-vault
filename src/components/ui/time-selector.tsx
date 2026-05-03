"use client"

import * as React from 'react'
import { cn } from '../../lib/utils'
import type { ReactDispatch } from '../../types/common'

type TimeValue = string

interface Props {
  hideTrigger?: boolean
  open?: boolean
  onOpenChange?: ReactDispatch<boolean>
  value?: TimeValue | null
  setValue?: (value: TimeValue) => void
  minuteStep?: number
}

const triggerClassName = cn(
  'rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100',
  'cursor-pointer whitespace-nowrap transition-colors hover:bg-zinc-800',
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

function formatTimeValue(time?: string | null) {
  if (!time) return ''
  const [rawHour = '00', rawMinute = '00'] = time.split(':')
  const hour24 = Number(rawHour)
  const hour12 = hour24 % 12 || 12
  const period = hour24 >= 12 ? 'PM' : 'AM'
  return `${hour12.toString().padStart(2, '0')}:${rawMinute} ${period}`
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
  if (is24Hour) {
    return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }
  const normalizedHour = Number(hour12) % 12
  const nextHour24 = period === 'PM' ? normalizedHour + 12 : normalizedHour
  return `${nextHour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export default function TimeSelector({
  value,
  setValue,
  minuteStep = 1,
  hideTrigger,
  open,
  onOpenChange,
}: Props) {
  const [isOpen, setIsOpen] = useControllableOpen(open, onOpenChange)
  const [is24Hour, setIs24Hour] = React.useState(() => detectSystem24HourFormat())
  const hourRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const minuteRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const periodRefs = React.useRef<Record<'AM' | 'PM', HTMLButtonElement | null>>({ AM: null, PM: null })
  const rootRef = React.useRef<HTMLDivElement>(null)
  const parsed = parseTimeParts(value)
  const safeMinuteStep = Math.max(1, minuteStep)

  useOutsideDismiss(rootRef, isOpen, () => setIsOpen(false))

  React.useEffect(() => {
    setIs24Hour(detectSystem24HourFormat())
  }, [])

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

  return (
    <div ref={rootRef} className="relative inline-block">
      {hideTrigger ? null : (
        <button type="button" className={triggerClassName} onClick={() => setIsOpen((prev) => !prev)}>
          {value ? formatTimeValue(value) : 'Select Time'}
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
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
                          setValue?.(nextValue)
                          onOpenChange?.(false)
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
                        setValue?.(nextValue)
                        onOpenChange?.(false)
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
      )}
    </div>
  )
}
