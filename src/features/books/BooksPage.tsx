import { Lock, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BookCover, Button, Chip, CoinBadge, TopBar } from '@/components'
import { booksApi, userApi } from '@/lib/api'
import type { BookWithStatus } from '@/lib/api'
import LockedModal from './LockedModal'

type Filter = 'all' | 'unlocked' | 'locked'

export default function BooksPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [books, setBooks] = useState<BookWithStatus[]>([])
  const [coins, setCoins] = useState(0)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<BookWithStatus | null>(null)

  const refresh = async () => {
    setBooks(await booksApi.list())
    setCoins((await userApi.me()).coins)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const visible = useMemo(
    () =>
      books.filter((b) => {
        const matchesQuery = b.title.toLowerCase().includes(query.trim().toLowerCase())
        const matchesFilter =
          filter === 'all' || (filter === 'unlocked' ? b.unlocked : !b.unlocked)
        return matchesQuery && matchesFilter
      }),
    [books, query, filter],
  )

  const filters: Filter[] = ['all', 'unlocked', 'locked']

  return (
    <>
      <TopBar title={t('books.title')} right={<CoinBadge amount={coins} size="sm" />} />

      <div className="space-y-4 p-4">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('books.search')}
            className="h-11 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
          />
        </label>

        <div className="flex gap-2">
          {filters.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {t(`books.${f}`)}
            </Chip>
          ))}
        </div>

        {visible.length === 0 && <p className="py-10 text-center text-muted">{t('books.empty')}</p>}

        <ul className="space-y-3">
          {visible.map((b) => (
            <li key={b.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <BookCover src={b.coverUrl} title={b.title} className="w-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{b.title}</p>
                <p className="line-clamp-2 text-xs text-muted">{b.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <CoinBadge amount={b.priceCoins} size="sm" />
                {b.unlocked ? (
                  <Button className="min-h-9 px-4 text-sm" onClick={() => navigate(`/reader/${b.id}`)}>
                    {t('books.read')}
                  </Button>
                ) : (
                  <button
                    aria-label="Locked"
                    onClick={() => setSelected(b)}
                    className="flex size-11 items-center justify-center rounded-xl bg-surface-2 text-muted"
                  >
                    <Lock size={18} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <LockedModal
        book={selected}
        coins={coins}
        onClose={() => setSelected(null)}
        onUnlocked={() => {
          setSelected(null)
          void refresh()
        }}
      />
    </>
  )
}