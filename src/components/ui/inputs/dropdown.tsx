'use client'

import * as React from 'react'
import { DropdownMenu } from 'radix-ui'
import { cn } from '../../../lib/utils'
import { handleRippleAnimation } from '../../../lib/ui/handleRippleAnimation'
import LabelContainer from '../inputs/label-container'

type DropdownItem = {
  value: string
  label: React.ReactNode
  disabled?: boolean
  onClick?: (value: string) => void
}

type Props = {
  children: React.ReactNode
  label?: string
  error?: string
  containerClassName?: string
  labelClassName?: string
  items?: DropdownItem[]
  contentClassName?: string
  required?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dropdown = ({
  children,
  label,
  error,
  containerClassName,
  labelClassName,
  items = [],
  contentClassName,
  required,
  open,
  defaultOpen,
  onOpenChange,
}: Props) => {
  return (
    <LabelContainer
      error={error}
      label={label}
      className={containerClassName}
      labelClassName={labelClassName}
      required={required}
    >
      <DropdownMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            align="start"
            className={cn(
              'z-50 min-w-(--radix-dropdown-menu-trigger-width) overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-sm',
              contentClassName,
            )}
          >
            {items.map((item) => (
              <DropdownMenu.Item
                key={item.value}
                disabled={item.disabled}
                onMouseDown={(e) => {
                  handleRippleAnimation(
                    e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    'bg-violet-500',
                  )
                }}
                onClick={() => item.onClick?.(item.value)}
                className={cn(
                  'relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-left text-sm text-zinc-100 outline-none overflow-hidden',
                  'focus:bg-violet-500/10',
                  item.disabled && 'pointer-events-none opacity-50',
                )}
              >
                {item.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </LabelContainer>
  )
}

export default Dropdown
