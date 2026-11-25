import { library } from '@/data/library'
import { dayKey, db, delay } from './_state'

export interface DayActivity {
  date: string
  pages: number
}

export interface Stats {
  booksRead: number
  totalBooks: number
  streak: number
  totalDays: number
  totalEarned: number
  week: DayActivity[]
}

export const statsApi = {
  get: () => {
    let streak = 0
    const d = new Date()
    if (!(db.activity[dayKey(d)] > 0)) d.setDate(d.getDate() - 1)
    while (db.activity[dayKey(d)] > 0) {
      streak += 1
      d.setDate(d.getDate() - 1)
    }

    const week: DayActivity[] = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      const key = dayKey(day)
      week.push({ date: key, pages: db.activity[key] ?? 0 })
    }

    const stats: Stats = {
      booksRead: db.progress.filter((p) => p.completed).length,
      totalBooks: library.length,
      streak,
      totalDays: Object.values(db.activity).filter((v) => v > 0).length,
      totalEarned: db.transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
      week,
    }
    return delay(stats)
  },
}