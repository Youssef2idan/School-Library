export interface BookPage {
  pageNumber: number
  text: string
}

export interface AudioTrack {
  title: string
  url: string
}

export type BookFormat = 'text' | 'images' | 'pdf'

export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  priceCoins: number
  language: 'ar' | 'en'
  description: string
  // محتوى الكتاب: واحد من التلاتة
  pages?: BookPage[]
  imageUrls?: string[]
  pdfUrl?: string
  // التسجيلات الصوتية (MP3). ملف واحد أو عدة ملفات (فصول)
  audioTracks?: AudioTrack[]
}

export interface User {
  id: string
  name: string
  avatarUrl: string
  role: 'student' | 'teacher'
  coins: number
  streak: number
  totalDays: number
}

export interface UserBookProgress {
  bookId: string
  unlocked: boolean
  lastPage: number
  completed: boolean
}

export type TransactionType = 'read_book' | 'complete_quiz' | 'milestone' | 'unlock_book'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  createdAt: string
}

export interface LeaderboardEntry {
  userId: string
  name: string
  avatarUrl: string
  coins: number
  booksRead: number
}