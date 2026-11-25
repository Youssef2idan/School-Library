import { Coins } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-xs gap-1',
  md: 'text-sm gap-1.5',
  lg: 'text-2xl gap-2',
}

const iconSizes = { sm: 14, md: 18, lg: 28 }

export default function CoinBadge({ amount, size = 'md', className }: Props) {
  return (
    <span
      className={cn('inline-flex items-center font-bold text-coin', sizes[size], className)}
    >
      <Coins size={iconSizes[size]} />
      {amount.toLocaleString()}
    </span>
  )
}