import { Pause, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components'
import { cn } from '@/lib/cn'

const RATES = [0.75, 1, 1.25, 1.5]

interface Props {
  playing: boolean
  rate: number
  onToggle: () => void
  onRate: (rate: number) => void
}

export default function TtsControls({ playing, rate, onToggle, onRate }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="space-y-3">
      <p className="text-center text-xs text-muted">{t('reader.ttsHint')}</p>
      <div className="flex items-center justify-center">
        <button
          onClick={onToggle}
          className="flex min-h-14 items-center gap-2 rounded-full bg-primary px-8 text-lg font-bold text-white shadow-lg shadow-primary/40"
        >
          {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          {playing ? t('reader.pause') : t('reader.play')}
        </button>
      </div>
      <div className="flex items-center justify-center gap-2" dir="ltr">
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => onRate(r)}
            className={cn(
              'min-h-11 min-w-14 rounded-full px-3 text-sm font-semibold',
              rate === r ? 'bg-primary text-white' : 'bg-surface-2 text-muted',
            )}
          >
            {r}x
          </button>
        ))}
      </div>
    </Card>
  )
}