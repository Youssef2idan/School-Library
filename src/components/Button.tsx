import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-primary to-primary-2 text-white shadow-lg shadow-primary/40 active:scale-[0.98]',
  secondary: 'bg-surface text-fg border border-line active:scale-[0.98]',
  ghost: 'bg-transparent text-primary-soft',
}

export default function Button({
  variant = 'primary',
  fullWidth,
  icon,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition disabled:opacity-50',
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}