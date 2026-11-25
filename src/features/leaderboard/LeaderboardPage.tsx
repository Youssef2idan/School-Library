import { Crown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Chip, CoinBadge, MedalAvatar, TopBar } from '@/components'
import { leaderboardApi, userApi } from '@/lib/api'
import type { Period } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { LeaderboardEntry } from '@/types'

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<Period>('all')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [meId, setMeId] = useState('')

  useEffect(() => {
    void userApi.me().then((u) => setMeId(u.id))
  }, [])

  useEffect(() => {
    let cancelled = false
    void leaderboardApi.list(period).then((list) => {
      if (!cancelled) setEntries(list)
    })
    return () => {
      cancelled = true
    }
  }, [period])

  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)
  // الترتيب على المنصة: التاني - الأول - التالت
  const order = [1, 0, 2]

  return (
    <>
      <TopBar title={t('leaderboard.title')} />

      <div className="space-y-5 p-4">
        <div className="flex gap-2">
          <Chip active={period === 'all'} onClick={() => setPeriod('all')}>
            {t('leaderboard.topReaders')}
          </Chip>
          <Chip active={period === 'month'} onClick={() => setPeriod('month')}>
            {t('leaderboard.thisMonth')}
          </Chip>
        </div>

        {entries.length === 0 && <p className="py-10 text-center text-muted">{t('leaderboard.empty')}</p>}

        <div className="flex items-end justify-center gap-3 pt-2">
          {order.map((i) => {
            const e = podium[i]
            if (!e) return null
            const first = i === 0
            return (
              <div key={e.userId} className="flex w-24 flex-col items-center gap-1.5">
                {first && <Crown size={28} className="text-coin" fill="currentColor" />}
                <MedalAvatar name={e.name} rank={(i + 1) as 1 | 2 | 3} size={first ? 76 : 58} />
                <p className="w-full truncate text-center text-sm font-bold">{e.name}</p>
                <CoinBadge amount={e.coins} size="sm" />
              </div>
            )
          })}
        </div>

        <ul className="space-y-2">
          {rest.map((e, i) => (
            <li
              key={e.userId}
              className={cn(
                'flex min-h-14 items-center gap-3 rounded-xl border px-3',
                e.userId === meId ? 'border-primary bg-primary/60' : 'border-line bg-surface',
              )}
            >
              <span className="w-5 text-center text-sm font-bold text-muted">{i + 4}</span>
              <Avatar name={e.name} size={36} />
              <span className="flex-1 truncate text-sm font-semibold">{e.name}</span>
              <CoinBadge amount={e.coins} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}