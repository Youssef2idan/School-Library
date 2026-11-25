import { Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Book } from '@/types'

interface Props {
  book: Book
  sentences: string[]
  activeIndex: number
  footer: ReactNode
}

export default function TextView({ book, sentences, activeIndex, footer }: Props) {
  const isAr = book.language === 'ar'

  return (
    <div className="overflow-hidden rounded-2xl border border-line shadow-xl shadow-black/30">
      <img src={book.coverUrl} alt="" className="h-40 w-full object-cover object-top" />
      <div className="bg-[#f6ecd7] p-5 text-[#2a2140]">
        <p
          dir={isAr ? 'rtl' : 'ltr'}
          className="min-h-44 text-[21px] leading-[1.9]"
          style={{ fontFamily: isAr ? undefined : 'Georgia, "Times New Roman", serif' }}
        >
          {sentences.map((s, i) => (
            <span key={i} className={cn('rounded px-0.5 transition-colors', i === activeIndex && 'bg-primary/25')}>
              {s}{' '}
            </span>
          ))}
        </p>

        <div className="my-4 flex items-center gap-3 text-amber-500">
          <span className="h-px flex-1 bg-[#2a2140]/20" />
          <Star size={14} fill="currentColor" />
          <span className="h-px flex-1 bg-[#2a2140]/20" />
        </div>

        {footer}
      </div>
    </div>
  )
}