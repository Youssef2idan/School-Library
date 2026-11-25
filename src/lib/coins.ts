import type { TransactionType } from '@/types'

// ⚠️ TODO: لازم المنطق ده يتنقل للـ Backend (Supabase RPC) لاحقًا.
// لو فضل في الـ Frontend، أي طالب يقدر يعدل عملاته من المتصفح.

export const COIN_REWARDS: Record<Exclude<TransactionType, 'unlock_book'>, number> = {
  read_book: 50,
  complete_quiz: 30,
  milestone: 100,
}

export type EarnType = keyof typeof COIN_REWARDS

// مكافأة الـ milestone كل كام كتاب مكتمل
export const MILESTONE_EVERY = 3

export function getReward(type: EarnType): number {
  return COIN_REWARDS[type]
}

export function canAfford(coins: number, price: number): boolean {
  return coins >= price
}