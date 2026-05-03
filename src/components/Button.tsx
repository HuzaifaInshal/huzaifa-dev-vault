import type { ButtonHTMLAttributes, ElementType, MouseEvent, ReactNode } from 'react'
import { clsx } from 'clsx'
import { LoaderCircle } from 'lucide-react'
import { handleRippleAnimation } from '../lib/ui/handleRippleAnimation'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
type Size = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  component?: ElementType
  link?: string
  isLoading?: boolean
  children?: ReactNode
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
  link: 'border-transparent bg-transparent text-violet-300 underline-offset-4 hover:underline',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2.5',
  icon: 'h-9 w-9 p-0',
}

const rippleColorByVariant: Record<Variant, string> = {
  primary: 'bg-white/35',
  secondary: 'bg-white/20',
  ghost: 'bg-white/15',
  destructive: 'bg-white/30',
  link: 'bg-violet-300/25',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  component,
  link,
  children,
  isLoading = false,
  disabled,
  onMouseDown,
  ...props
}: ButtonProps) {
  const Comp: ElementType = component ?? (link ? 'a' : 'button')

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (!disabled && !isLoading) {
      handleRippleAnimation(event, rippleColorByVariant[variant])
    }

    onMouseDown?.(event as MouseEvent<HTMLButtonElement>)
  }

  const sharedClassName = clsx(
    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg border font-medium',
    'cursor-pointer whitespace-nowrap transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

  const content = (
    <>
      {isLoading && (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-inherit">
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </span>
      )}
      <span className={clsx('inline-flex items-center gap-2', isLoading && 'opacity-0')}>
        {children}
      </span>
    </>
  )

  if (link) {
    return (
      <Comp
        href={link}
        className={sharedClassName}
        aria-disabled={disabled || isLoading}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {content}
      </Comp>
    )
  }

  return (
    <Comp
      className={sharedClassName}
      disabled={disabled || isLoading}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {content}
    </Comp>
  )
}
