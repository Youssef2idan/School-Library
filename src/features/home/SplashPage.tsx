import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Logo, StackedBooks } from '@/components'

export default function SplashPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    try {
      sessionStorage.setItem('splash-shown', '1')
    } catch {
      /* ignore */
    }
    const id = setTimeout(() => navigate('/', { replace: true }), 2200)
    return () => clearTimeout(id)
  }, [navigate])

  return (
    <div className="safe-top safe-bottom mx-auto flex h-full max-w-[430px] flex-col items-center justify-center px-8 text-center">
      <Logo size={96} />
      <h1 className="mt-4 text-4xl font-extrabold leading-tight">
        School
        <br />
        <span className="bg-gradient-to-b from-primary-soft to-primary bg-clip-text text-transparent">
          Library
        </span>
      </h1>
      <p className="mt-3 text-sm text-fg/90">{t('app.tagline')}</p>

      <StackedBooks className="mt-10 w-52 animate-[float_3s_ease-in-out_infinite]" />

      <div className="mt-10 h-2 w-52 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-1/3 animate-[load_1.4s_ease-in-out_infinite] rounded-full bg-primary-soft" />
      </div>
      <p className="mt-3 text-sm text-muted">{t('app.loading')}</p>
    </div>
  )
}