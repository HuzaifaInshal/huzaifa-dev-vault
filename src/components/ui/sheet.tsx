'use client'

import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import React from 'react'

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  side?: 'left' | 'right'
  className?: string
}

const Sheet = ({ open, onOpenChange, children, title, side = 'right', className }: SheetProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/50',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          'duration-300',
        )}
      />
      <Dialog.Content
        className={cn(
          'fixed top-0 z-50 h-full bg-zinc-900 border-zinc-700 shadow-2xl flex flex-col focus:outline-none',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          side === 'right'
            ? 'data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right'
            : 'data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left',
          'duration-300 ease-in-out',
          'w-3/4',
          className,
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

const SheetClose = ({ className }: { className?: string }) => (
  <Dialog.Close
    className={cn('rounded-lg p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors', className)}
  >
    <X className="size-5" />
  </Dialog.Close>
)

export { Sheet, SheetClose }
