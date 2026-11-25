import { Lock } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props {
  src: string
  title: string
  locked?: boolean
  className?: string
}

export default function BookCover({ src, title, locked, className }: Props) {
  return (
    <div className={cn('relative aspect-[2/3] overflow-hidden rounded-lg', className)}>
      <img
        src={src}
        alt={title}
        className={cn('h-full w-full object-cover', locked && 'opacity-50')}
      />
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Lock size={20} />
        </div>
      )}
    </div>
  )
}