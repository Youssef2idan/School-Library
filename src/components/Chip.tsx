import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export default function Chip({ active, className, ...rest }: Props) {
  return (
    <button
      className={cn(
        'min-h-11 flex-1 rounded-full px-4 text-sm font-semibold transition',
        active ? 'bg-primary text-white' : 'bg-surface text-muted',
        className,
      )}
      {...rest}
    />
  )
}