import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export default function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('card-gradient rounded-2xl border border-line p-4', className)}
      {...rest}
    />
  )
}