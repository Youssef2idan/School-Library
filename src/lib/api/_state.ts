import { currentUser, initialProgress } from '@/data/mock'
import { getReward } from '@/lib/coins'
import type { EarnType } from '@/lib/coins'
import type { Transaction, User, UserBookProgress } from '@/types'

interface DB {
  user: User
  progress: UserBookProgress[]
  transactions: Transaction[]
  activity: Record<string, number> // yyyy-mm-dd -> عدد الصفحات المقروءة
}

const KEY = 'school-library-db'

export function uid(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// بيانات تجريبية لآخر 7 أيام عشان الإحصائيات متبقاش فاضية
function seedActivity(): Record<string, number> {
  const seed = [6, 9, 4, 12, 7, 10, 5]
  const out: Record<string, number> = {}
  seed.forEach((pages, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (seed.length - 1 - i))
    out[dayKey(d)] = pages
  })
  return out
}

function fresh(): DB {
  return {
    user: structuredClone(currentUser),
    progress: structuredClone(initialProgress),
    transactions: [],
    activity: seedActivity(),
  }
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>
      const base = fresh()
      return {
        user: parsed.user ?? base.user,
        progress: parsed.progress ?? base.progress,
        transactions: parsed.transactions ?? base.transactions,
        activity: parsed.activity ?? base.activity,
      }
    }
  } catch {
    /* ignore */
  }
  return fresh()
}

export const db: DB = load()

export function save(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    /* ignore */
  }
}

// بيضيف عملات ويسجل المعاملة. لازم يتنقل للسيرفر لاحقًا
export function grant(type: EarnType): number {
  const amount = getReward(type)
  db.user.coins += amount
  db.transactions.push({ id: uid(), type, amount, createdAt: new Date().toISOString() })
  return amount
}

export const delay = <T,>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms))