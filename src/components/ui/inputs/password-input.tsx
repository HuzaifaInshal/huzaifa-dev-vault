import { cn } from '../../../lib/utils'
import React from 'react'
import LabelContainer from './label-container'
import { endIconStyles, inputStyles, startIconStyles } from './input-styles'

type ReactDispatch<T> = React.Dispatch<React.SetStateAction<T>>

const PasswordInput = ({
  label,
  error,
  value,
  setValue,
  startIcon,
  containerClassName,
  labelClassName,
  showToggle = true,
  ...rest
}: Omit<React.ComponentProps<'input'>, 'type'> & {
  label?: string
  error?: string
  value?: string
  startIcon?: React.ReactNode
  setValue?: ReactDispatch<string>
  containerClassName?: string
  labelClassName?: string
  showToggle?: boolean
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const hasStartIcon = Boolean(startIcon)

  return (
    <LabelContainer
      error={error}
      htmlFor={rest.id}
      label={label}
      className={containerClassName}
      labelClassName={labelClassName}
      required={rest.required}
    >
      <div className={cn('relative', 'flex', 'items-center')}>
        {hasStartIcon && <span className={startIconStyles}>{startIcon}</span>}
        <input
          type={isVisible ? 'text' : 'password'}
          className={cn(inputStyles, hasStartIcon && 'pl-10', rest.className)}
          {...rest}
          value={value}
          onChange={(e) => {
            setValue?.(e.target.value)
            rest.onChange?.(e)
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className={cn(endIconStyles, 'text-zinc-500', 'transition-colors', 'hover:text-zinc-200')}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
          >
            {isVisible ? (
              <svg className={cn('size-5')} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 12c2.1-4.2 5.7-6.3 9-6.3s6.9 2.1 9 6.3c-2.1 4.2-5.7 6.3-9 6.3S5.1 16.2 3 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg className={cn('size-5')} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 5.5 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9.9 9.9a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M6.4 6.4C4.9 7.6 3.7 9.4 3 12c2.1 4.2 5.7 6.3 9 6.3 1.6 0 3.2-.5 4.7-1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10.2 5.8c.6-.1 1.2-.2 1.8-.2 3.3 0 6.9 2.1 9 6.3-.5 1.1-1.1 2.1-1.8 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </LabelContainer>
  )
}

export default PasswordInput
