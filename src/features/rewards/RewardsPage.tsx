import { BookOpen, CircleCheck, Lock, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CoinBadge, TopBar } from '@/components'
import { userApi } from '@/lib/api'
import { COIN_REWARDS } from '@/lib/coins'
import TreasureChest from './TreasureChest'

export default function RewardsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    void userApi.me().then((u) => setCoins(u.coins))
  }, [])

  const rows = [
    { key: 'readBook', icon: BookOpen, color: 'text-sky-300', amount: COIN_REWARDS.read_book },
    { key: 'completeQuiz', icon: Star, color: 'text-amber-300', amount: COIN_REWARDS.complete_quiz },
    { key: 'milestone', icon: CircleCheck, color: 'text-success', amount: COIN_REWARDS.milestone },
  ]

  return (
    <>
      <TopBar title={t('rewards.title')} />

      <div className="space-y-5 p-4">
        <div className="flex flex-col items-center gap-1">
          <TreasureChest className="w-56 animate-[float_3s_ease-in-out_infinite]" />
          <p className="text-xl font-bold">{t('rewards.youHave')}</p>
          <CoinBadge amount={coins} size="lg" />
        </div>

        <section className="space-y-2">
          <h2 className="font-bold">{t('rewards.howToEarn')}</h2>
          {rows.map(({ key, icon: Icon, color, amount }) => (
            <Card key={key} className="flex items-center gap-3 p-3">
              <Icon size={28} className={color} />
              <div>
                <p className="text-sm font-semibold">{t(`rewards.${key}`)}</p>
                <p className="text-sm font-bold text-coin">{t('rewards.plusCoins', { amount })}</p>
              </div>
            </Card>
          ))}
        </section>

        <button
          onClick={() => navigate('/books')}
          className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-gradient-to-b from-primary to-primary-2 p-4 text-start shadow-lg shadow-primary/40"
        >
          <Lock size={28} />
          <div>
            <p className="font-bold">{t('rewards.useCoins1')}</p>
            <p className="text-sm text-white/80">{t('rewards.useCoins2')}</p>
          </div>
        </button>
      </div>
    </>
  )
}