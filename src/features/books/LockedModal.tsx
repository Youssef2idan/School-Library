import { Lock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@/components'
import { userApi } from '@/lib/api'
import type { BookWithStatus } from '@/lib/api'

interface Props {
  book: BookWithStatus | null
  coins: number
  onClose: () => void
  onUnlocked: () => void
}

export default function LockedModal({ book, coins, onClose, onUnlocked }: Props) {
  const { t } = useTranslation()
  const [error, setError] = useState(false)

  const canUnlock = !!book && coins >= book.priceCoins

  const unlock = async () => {
    if (!book) return
    try {
      await userApi.unlockBook(book.id)
      setError(false)
      onUnlocked()
    } catch {
      setError(true)
    }
  }

  const close = () => {
    setError(false)
    onClose()
  }

  return (
    <Modal open={!!book} onClose={close}>
      <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-primary/20">
        <Lock size={40} className="text-primary-soft" />
      </div>
      <h2 className="mb-2 text-xl font-bold">{t('locked.title')}</h2>
      <p className="mb-5 text-sm text-muted">
        {error || !canUnlock ? t('locked.notEnough') : t('locked.text')}
      </p>
      <div className="space-y-2">
        {canUnlock && book && (
          <Button fullWidth onClick={unlock}>
            {t('locked.unlockFor', { price: book.priceCoins })}
          </Button>
        )}
        <Button fullWidth variant={canUnlock ? 'secondary' : 'primary'} onClick={close}>
          {t('locked.keepReading')}
        </Button>
      </div>
    </Modal>
  )
}