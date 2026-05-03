'use client'

import { Check, ChevronDown } from 'lucide-react'
import { Select as RadixSelect } from 'radix-ui'
import * as React from 'react'
import { cn } from '../../../lib/utils'
import { handleRippleAnimation } from '../../../lib/ui/handleRippleAnimation'
import { endIconStyles, inputStyles, startIconStyles } from './input-styles'
import LabelContainer from './label-container'

type ReactDispatch<T> = React.Dispatch<React.SetStateAction<T>>

type SelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

type Props = Omit<React.ComponentProps<typeof RadixSelect.Root>, 'value' | 'defaultValue' | 'onValueChange'> & {
  label?: string
  error?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  setValue?: ReactDispatch<string>
  onValueChange?: (value: string) => void
  options: SelectOption[]
  containerClassName?: string
  labelClassName?: string
  triggerClassName?: string
  contentClassName?: string
  name?: string
}

const Select = ({
  label,
  error,
  value,
  defaultValue,
  placeholder = 'Select an option',
  startIcon,
  endIcon,
  setValue,
  onValueChange,
  options,
  containerClassName,
  labelClassName,
  triggerClassName,
  contentClassName,
  name,
  required,
  disabled,
  ...rest
}: Props) => {
  const hasStartIcon = Boolean(startIcon)
  const hasEndIcon = Boolean(endIcon)

  const handleValueChange = (nextValue: string) => {
    setValue?.(nextValue as unknown as React.SetStateAction<string>)
    onValueChange?.(nextValue)
  }

  return (
    <LabelContainer
      error={error}
      htmlFor={name}
      label={label}
      className={containerClassName}
      labelClassName={labelClassName}
      required={required}
    >
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        name={name}
        required={required}
        disabled={disabled}
        {...rest}
      >
        <RadixSelect.Trigger
          aria-invalid={Boolean(error)}
          className={cn(
            inputStyles,
            'relative flex items-center justify-between gap-3 text-left overflow-hidden',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasStartIcon && 'pl-10',
            (hasEndIcon || !endIcon) && 'pr-10',
            triggerClassName,
          )}
          onPointerDown={(e) => {
            handleRippleAnimation(e as unknown as React.MouseEvent<HTMLButtonElement>, 'bg-zinc-700')
          }}
        >
          {hasStartIcon && <span className={cn(startIconStyles, 'pointer-events-none')}>{startIcon}</span>}
          <RadixSelect.Value placeholder={<span className="text-zinc-500">{placeholder}</span>} />
          {hasEndIcon ? (
            <span className={cn(endIconStyles, 'pointer-events-none')}>{endIcon}</span>
          ) : (
            <RadixSelect.Icon asChild>
              <ChevronDown className={cn(endIconStyles, 'size-4 text-zinc-500')} />
            </RadixSelect.Icon>
          )}
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={8}
            className={cn(
              'z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm',
              contentClassName,
            )}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 pr-8 text-sm text-zinc-100 outline-none',
                    'focus:bg-violet-500/10 data-disabled:pointer-events-none data-disabled:opacity-50',
                    'overflow-hidden',
                  )}
                  onMouseDown={(e) => {
                    handleRippleAnimation(e as unknown as React.MouseEvent<HTMLButtonElement>, 'bg-violet-500/50')
                  }}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-3 inline-flex items-center">
                    <Check className="size-4 text-violet-400" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </LabelContainer>
  )
}

export default Select
