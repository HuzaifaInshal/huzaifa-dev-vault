import { cn } from '../../lib/utils'
import React from 'react'

const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
  <div className="w-full overflow-auto">
    <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
)

const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
  <thead className={cn('bg-zinc-800', className)} {...props} />
)

const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)

const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
  <tr className={cn('border-b border-zinc-700 bg-zinc-900', className)} {...props} />
)

const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
  <th
    className={cn('h-11 px-4 text-left align-middle text-sm font-medium text-zinc-400', className)}
    {...props}
  />
)

const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td className={cn('h-16 px-4 py-3.5 align-middle text-zinc-100', className)} {...props} />
)

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
