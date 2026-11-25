import { leaderboard } from '@/data/mock'
import type { LeaderboardEntry } from '@/types'
import { db, delay } from './_state'

export type Period = 'all' | 'month'

export const leaderboardApi = {
  list: (period: Period = 'all') => {
    const booksRead = db.progress.filter((p) => p.completed).length
    const me: LeaderboardEntry = {
      userId: db.user.id,
      name: db.user.name,
      avatarUrl: db.user.avatarUrl,
      coins: db.user.coins,
      booksRead,
    }
    const others = leaderboard.filter((e) => e.userId !== db.user.id)

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const entries = [...others, me].map((e): LeaderboardEntry => {
      if (period === 'all') return e
      if (e.userId === db.user.id) {
        const earned = db.transactions
          .filter((t) => t.amount > 0 && new Date(t.createdAt) >= monthStart)
          .reduce((sum, t) => sum + t.amount, 0)
        return { ...e, coins: earned }
      }
      // بيانات تجريبية للشهر. الحقيقية هتيجي من السيرفر
      return { ...e, coins: Math.round(e.coins * 0.3) }
    })

    entries.sort((a, b) => b.coins - a.coins)
    return delay(entries)
  },
}