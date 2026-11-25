import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  right?: ReactNode
  hideBack?: boolean
}

export default function TopBar({ title, right, hideBack }: Props) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const BackIcon = i18n.language === 'ar' ? ChevronRight : ChevronLeft

  return (
    <header className="safe-top sticky top-0 z-10 flex items-center bg-bg/90 px-2 backdrop-blur">
      <div className="flex size-11 items-center justify-center">
        {!hideBack && (
          <button
            aria-label={t('common.back')}
            onClick={() => navigate(-1)}
            className="flex size-11 items-center justify-center"
          >
            <BackIcon size={24} />
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-bold">{title}</h1>
      <div className="flex min-w-11 items-center justify-center">{right}</div>
    </header>
  )
}