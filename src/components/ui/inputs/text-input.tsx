import { cn } from '../../../lib/utils'
import React from 'react'
import LabelContainer from './label-container'
import { endIconStyles, inputStyles, startIconStyles } from './input-styles'

type ReactDispatch<T> = React.Dispatch<React.SetStateAction<T>>

const TextInput = ({
  label,
  error,
  value,
  setValue,
  startIcon,
  endIcon,
  containerClassName,
  labelClassName,
  ...rest
}: React.ComponentProps<'input'> & {
  label?: string
  error?: string
  value?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  setValue?: ReactDispatch<string>
  containerClassName?: string
  labelClassName?: string
}) => {
  const hasStartIcon = Boolean(startIcon)
  const hasEndIcon = Boolean(endIcon)

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
          {...rest}
          type="text"
          className={cn(inputStyles, hasStartIcon && 'pl-10', hasEndIcon && 'pr-10', rest.className)}
          value={value}
          onChange={(e) => {
            setValue?.(e.target.value)
            rest.onChange?.(e)
          }}
        />
        {hasEndIcon && <span className={endIconStyles}>{endIcon}</span>}
      </div>
    </LabelContainer>
  )
}

export default TextInput
