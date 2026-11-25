import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

interface Props {
  page: number
  total: number
  onPrev: () => void
  onNext: () => void
  className?: string
}

export default function PageNav({ page, total, onPrev, onNext, className }: Props) {
  const { t, i18n } = useTranslation()
  const rtl = i18n.language === 'ar'
  const PrevIcon = rtl ? ChevronRight : ChevronLeft
  const NextIcon = rtl ? ChevronLeft : ChevronRight

  const btn =
    'flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 disabled:opacity-40'

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <button aria-label={t('reader.prev')} disabled={page <= 1} onClick={onPrev} className={btn}>
        <PrevIcon size={26} />
      </button>
      <span dir="ltr" className="text-xl font-bold">
        {page} / {total > 0 ? total : '—'}
      </span>
      <button aria-label={t('reader.next')} disabled={total === 0 || page >= total} onClick={onNext} className={btn}>
        <NextIcon size={26} />
      </button>
    </div>
  )
}