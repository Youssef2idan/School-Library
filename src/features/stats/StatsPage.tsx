import { BookOpen, CalendarDays, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookCover, Card, Chip, ProgressRing, TopBar } from '@/components'
import { booksApi, statsApi, userApi } from '@/lib/api'
import type { BookWithStatus, Stats } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Transaction } from '@/types'

type Tab = 'overview' | 'books' | 'coins'

export default function StatsPage() {
  const { t, i18n } = useTranslation()
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [books, setBooks] = useState<BookWithStatus[]>([])
  const [txs, setTxs] = useState<Transaction[]>([])

  useEffect(() => {
    void statsApi.get().then(setStats)
    void booksApi.list().then(setBooks)
    void userApi.transactions().then(setTxs)
  }, [])

  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US'
  const tabs: Tab[] = ['overview', 'books', 'coins']
  const max = Math.max(1, ...(stats?.week.map((d) => d.pages) ?? [1]))
  const percent = stats && stats.totalBooks > 0 ? (stats.booksRead / stats.totalBooks) * 100 : 0
  const myBooks = books.filter((b) => b.unlocked)

  return (
    <>
      <TopBar title={t('stats.title')} />

      <div className="space-y-4 p-4">
        <div className="flex gap-1 rounded-full bg-surface p-1">
          {tabs.map((k) => (
            <Chip key={k} active={tab === k} onClick={() => setTab(k)}>
              {t(`stats.${k}`)}
            </Chip>
          ))}
        </div>

        {tab === 'overview' && stats && (
          <>
            <Card className="flex items-center justify-between gap-3">
              <ProgressRing value={percent} size={140} stroke={10}>
                <BookOpen size={22} className="text-primary-soft" />
                <span className="text-3xl font-extrabold">{stats.booksRead}</span>
                <span className="text-[11px] text-muted">{t('stats.booksRead')}</span>
              </ProgressRing>

              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-surface-2/60 p-3">
                  <Flame size={26} className="text-orange-400" />
                  <div>
                    <p className="text-lg font-extrabold leading-none">{stats.streak}</p>
                    <p className="text-[11px] text-muted">{t('stats.dayStreak')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-surface-2/60 p-3">
                  <CalendarDays size={26} className="text-sky-300" />
                  <div>
                    <p className="text-lg font-extrabold leading-none">{stats.totalDays}</p>
                    <p className="text-[11px] text-muted">{t('stats.totalDays')}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 font-bold">{t('stats.readingActivity')}</h2>
              <div className="flex h-36 items-end justify-between gap-2">
                {stats.week.map((d) => (
                  <div key={d.date} className="flex h-full flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-md bg-gradient-to-t from-primary to-primary-soft"
                        style={{ height: `${Math.max(6, (d.pages / max) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted">
                      {new Date(`${d.date}T00:00:00`).toLocaleDateString(locale, { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {tab === 'books' && (
          <ul className="space-y-3">
            {myBooks.length === 0 && <p className="py-10 text-center text-muted">{t('stats.noBooks')}</p>}
            {myBooks.map((b) => {
              const total = b.pages?.length ?? b.imageUrls?.length ?? 0
              const progress = b.completed ? 100 : total > 0 ? Math.round((b.lastPage / total) * 100) : 0
              const label = b.completed
                ? t('stats.completed')
                : b.lastPage > 1
                  ? t('stats.page', { page: b.lastPage })
                  : t('stats.notStarted')
              return (
                <li key={b.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                  <BookCover src={b.coverUrl} title={b.title} className="w-12 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="truncate text-sm font-bold">{b.title}</p>
                    <p className={cn('text-xs', b.completed ? 'text-success' : 'text-muted')}>{label}</p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary-soft" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {tab === 'coins' && (
          <ul className="space-y-2">
            {txs.length === 0 && <p className="py-10 text-center text-muted">{t('stats.noTransactions')}</p>}
            {txs.map((tx) => (
              <li
                key={tx.id}
                className="flex min-h-14 items-center justify-between rounded-xl border border-line bg-surface px-4"
              >
                <div>
                  <p className="text-sm font-semibold">{t(`stats.tx.${tx.type}`)}</p>
                  <p className="text-[11px] text-muted">
                    {new Date(tx.createdAt).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <span dir="ltr" className={cn('font-bold', tx.amount > 0 ? 'text-success' : 'text-danger')}>
                  {tx.amount > 0 ? '+' : ''}
                  {tx.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}