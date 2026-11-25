import { BookOpen, Coins, Crown, Settings, Star, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Avatar, Card, TopBar } from '@/components'
import { statsApi, userApi } from '@/lib/api'
import type { Stats } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { User } from '@/types'

export default function ProfilePage() {
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    void userApi.me().then(setUser)
    void statsApi.get().then(setStats)
  }, [])

  const booksRead = stats?.booksRead ?? 0

  const achievements = [
    { key: 'firstBook', icon: Star, unlocked: booksRead >= 1 },
    { key: 'fiveBooks', icon: Crown, unlocked: booksRead >= 5 },
    { key: 'streak7', icon: Trophy, unlocked: (stats?.streak ?? 0) >= 7 },
    { key: 'coins1000', icon: Coins, unlocked: (stats?.totalEarned ?? 0) >= 1000 },
  ]

  return (
    <>
      <TopBar
        title={t('profile.title')}
        right={
          <Link
            to="/settings"
            aria-label={t('settings.title')}
            className="flex size-11 items-center justify-center text-primary-soft"
          >
            <Settings size={22} />
          </Link>
        }
      />

      <div className="space-y-5 p-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar name={user?.name ?? '?'} size={104} ring="#7c3aed" />
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm text-muted">{t('profile.student')}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col items-center gap-1">
            <BookOpen size={26} className="text-sky-300" />
            <p className="text-2xl font-extrabold">{booksRead}</p>
            <p className="text-xs text-muted">{t('profile.booksRead')}</p>
          </Card>
          <Card className="flex flex-col items-center gap-1">
            <Coins size={26} className="text-coin" />
            <p className="text-2xl font-extrabold">{(user?.coins ?? 0).toLocaleString()}</p>
            <p className="text-xs text-muted">{t('profile.totalCoins')}</p>
          </Card>
        </div>

        <section>
          <h2 className="mb-3 font-bold">{t('profile.achievements')}</h2>
          <div className="grid grid-cols-4 gap-2">
            {achievements.map(({ key, icon: Icon, unlocked }) => (
              <div key={key} className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={cn(
                    'flex size-14 items-center justify-center rounded-full border-2',
                    unlocked ? 'border-coin bg-coin/15 text-coin' : 'border-line bg-surface text-muted opacity-60',
                  )}
                >
                  <Icon size={26} />
                </div>
                <p className="text-[10px] font-semibold">{t(`profile.ach.${key}`)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}