import { library } from '@/data/library'
import { canAfford } from '@/lib/coins'
import type { EarnType } from '@/lib/coins'
import { db, delay, grant, save, uid } from './_state'

export const userApi = {
  me: () => delay(db.user),

  transactions: () => delay([...db.transactions].reverse()),

  earn: (type: EarnType) => {
    const amount = grant(type)
    save()
    return delay({ amount, balance: db.user.coins })
  },

  unlockBook: async (bookId: string) => {
    const book = library.find((b) => b.id === bookId)
    if (!book) throw new Error('Book not found')
    if (!canAfford(db.user.coins, book.priceCoins)) throw new Error('NOT_ENOUGH_COINS')

    db.user.coins -= book.priceCoins
    const existing = db.progress.find((p) => p.bookId === bookId)
    if (existing) existing.unlocked = true
    else db.progress.push({ bookId, unlocked: true, lastPage: 1, completed: false })

    db.transactions.push({
      id: uid(),
      type: 'unlock_book',
      amount: -book.priceCoins,
      createdAt: new Date().toISOString(),
    })
    save()
    return delay({ balance: db.user.coins })
  },
}