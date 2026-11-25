import { library } from '@/data/library'
import { MILESTONE_EVERY } from '@/lib/coins'
import type { Book, UserBookProgress } from '@/types'
import { dayKey, db, delay, grant, save } from './_state'

export type BookWithStatus = Book & { unlocked: boolean; completed: boolean; lastPage: number }

function findProgress(bookId: string): UserBookProgress | undefined {
  return db.progress.find((x) => x.bookId === bookId)
}

function ensureProgress(bookId: string): UserBookProgress {
  let p = findProgress(bookId)
  if (!p) {
    p = { bookId, unlocked: true, lastPage: 1, completed: false }
    db.progress.push(p)
  }
  return p
}

function withStatus(book: Book): BookWithStatus {
  const p = findProgress(book.id)
  return {
    ...book,
    unlocked: book.priceCoins === 0 || !!p?.unlocked,
    completed: !!p?.completed,
    lastPage: p?.lastPage ?? 1,
  }
}

export const booksApi = {
  list: () => delay(library.map(withStatus)),

  get: (id: string) => {
    const book = library.find((b) => b.id === id)
    return book ? delay(withStatus(book)) : Promise.reject(new Error('Book not found'))
  },

  saveProgress: (bookId: string, lastPage: number, countActivity: boolean) => {
    const p = ensureProgress(bookId)
    p.lastPage = lastPage
    if (countActivity) {
      const k = dayKey()
      db.activity[k] = (db.activity[k] ?? 0) + 1
    }
    save()
    return delay(true, 0)
  },

  // ⚠️ لازم يتنقل للسيرفر: دلوقتي الطالب يقدر يوصل لآخر صفحة بسرعة ويكسب العملات
  complete: (bookId: string) => {
    const p = ensureProgress(bookId)
    if (p.completed) return delay({ awarded: 0, milestone: 0 }, 0)
    p.completed = true
    const awarded = grant('read_book')
    const done = db.progress.filter((x) => x.completed).length
    const milestone = done % MILESTONE_EVERY === 0 ? grant('milestone') : 0
    save()
    return delay({ awarded, milestone }, 0)
  },
}