import { Bell, BookOpen, ChevronLeft, ChevronRight, Gift, Plus, Settings, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, BookCover, Card, CoinBadge, Logo, MedalAvatar, StackedBooks } from '@/components'
import { booksApi, leaderboardApi, userApi } from '@/lib/api'
import type { BookWithStatus } from '@/lib/api'
import type { LeaderboardEntry, User } from '@/types'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<BookWithStatus[]>([])
  const [top, setTop] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    void userApi.me().then(setUser)
    void booksApi.list().then(setBooks)
    void leaderboardApi.list().then((l) => setTop(l.slice(0, 3)))
  }, [])

  const isAr = i18n.language === 'ar'
  const Arrow = isAr ? ChevronLeft : ChevronRight

  const shortcuts = [
    { to: '/books', label: t('home.library'), icon: BookOpen, color: 'text-sky-300' },
    { to: '/leaderboard', label: t('home.leaderboard'), icon: Trophy, color: 'text-amber-300' },
    { to: '/rewards', label: t('home.rewards'), icon: Gift, color: 'text-pink-300' },
    { to: '/settings', label: t('home.settings'), icon: Settings, color: 'text-primary-soft' },
  ]

  return (
    <div className="safe-top space-y-4 p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={38} />
          <div className="text-lg font-extrabold leading-[1.05]">
            <div>School</div>
            <div className="text-primary-soft">Library</div>
          </div>
        </div>
        <button aria-label="Notifications" className="flex size-11 items-center justify-center">
          <Bell size={24} />
        </button>
      </header>

      <Card className="flex items-center justify-between p-3">
        <Link to="/profile" className="flex items-center gap-3">
          <Avatar name={user?.name ?? '?'} size={44} ring="#7c3aed" />
          <div>
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-[11px] text-muted">🎓 {t('home.student')}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <CoinBadge amount={user?.coins ?? 0} size="lg" className="text-xl" />
          <button
            aria-label="Add coins"
            onClick={() => navigate('/rewards')}
            className="flex size-7 items-center justify-center rounded-full bg-primary"
          >
            <Plus size={16} />
          </button>
        </div>
      </Card>

      <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-primary/80 via-primary-2/70 to-surface-2 p-5">
        <div className="relative z-10 max-w-[58%]">
          <h2 className="text-[26px] font-extrabold leading-tight">
            {t('home.bannerTitle1')}
            <br />
            <span className="text-primary-soft">{t('home.bannerTitle2')}</span>
          </h2>
          <p className="mb-4 mt-2 text-xs text-white/80">{t('home.bannerText')}</p>
          <button
            onClick={() => navigate('/books')}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-primary px-4 text-sm font-semibold shadow-lg shadow-black/30"
          >
            {t('home.startReading')}
            <Arrow size={16} />
          </button>
        </div>
        <StackedBooks className="absolute -bottom-2 end-0 w-36 -rotate-6" />
        <div className="absolute bottom-2 start-5 flex gap-1.5">
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white/40" />
          <span className="size-1.5 rounded-full bg-white/40" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {shortcuts.map(({ to, label, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="card-gradient flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border border-line text-[11px] font-semibold"
          >
            <Icon size={26} className={color} />
            {label}
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">🔥 {t('home.popular')}</h2>
          <Link to="/books" className="flex items-center gap-0.5 text-xs text-primary-soft">
            {t('home.seeAll')}
            <Arrow size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {books.slice(0, 4).map((b) => (
            <Link key={b.id} to={`/reader/${b.id}`} className="space-y-1.5">
              <BookCover src={b.coverUrl} title={b.title} locked={!b.unlocked} />
              <div className="flex justify-center">
                <CoinBadge amount={b.priceCoins} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">🏆 {t('home.topReaders')}</h2>
          <Link to="/leaderboard" className="flex items-center gap-0.5 text-xs text-primary-soft">
            {t('home.seeAll')}
            <Arrow size={14} />
          </Link>
        </div>
        <Card className="grid grid-cols-3 gap-2 p-3">
          {top.map((r, i) => (
            <div key={r.userId} className="flex flex-col items-center gap-1.5 text-center">
              <MedalAvatar name={r.name} rank={(i + 1) as 1 | 2 | 3} size={44} />
              <p className="w-full truncate text-[11px] font-bold">{r.name}</p>
              <p className="text-[10px] text-muted">
                {r.booksRead} {t('home.books')}
              </p>
            </div>
          ))}
        </Card>
      </section>
    </div>
  )
}