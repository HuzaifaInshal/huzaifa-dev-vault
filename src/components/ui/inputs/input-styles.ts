import { cn } from '../../../lib/utils'

export const inputStyles = cn(
  'h-9 w-full',
  'rounded-lg border border-zinc-700',
  'bg-zinc-900',
  'px-3 py-2',
  'text-base text-zinc-100',
  'placeholder:text-zinc-500',
  'focus:outline-2 focus:outline-violet-500',
)

export const startIconStyles = cn('pointer-events-auto', 'absolute left-3', 'inline-flex items-center')

export const endIconStyles = cn('pointer-events-auto', 'absolute right-3', 'inline-flex items-center')
