import type { Book, BookFormat } from '@/types'

export function getBookFormat(book: Book): BookFormat | null {
  if (book.pdfUrl) return 'pdf'
  if (book.imageUrls && book.imageUrls.length > 0) return 'images'
  if (book.pages && book.pages.length > 0) return 'text'
  return null
}