'use client'

import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import React from 'react'

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title: string
  className?: string
}

const Modal = ({ open, onOpenChange, children, title, className }: ModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-50',
          'bg-black/50 duration-100 supports-backdrop-filter:backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        )}
      />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl',
          'focus:outline-none',
          'duration-100 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

const ModalClose = ({ className }: { className?: string }) => (
  <Dialog.Close
    className={cn('rounded-lg p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors', className)}
  >
    <X className="size-5" />
  </Dialog.Close>
)

export { Modal, ModalClose }
