import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-700 border-transparent shadow-sm',
  secondary:
    'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-zinc-700',
  ghost:
    'bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 border-transparent',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg border',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-zinc-950',
        'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
