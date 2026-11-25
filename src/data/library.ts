import type { Book } from '@/types'
import { books as demoBooks } from './mock'

// بيولّد روابط صفحات مرقمة: numberedImages('/books/my-book/page-', 12)
// => /books/my-book/page-01.jpg ... /books/my-book/page-12.jpg
export function numberedImages(prefix: string, count: number, ext = 'jpg', pad = 2): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}${String(i + 1).padStart(pad, '0')}.${ext}`)
}

// ✅ ضيف كتبك هنا. أمثلة (شيل علامة // عشان تفعّلها):
export const myBooks: Book[] = [
  // --- كتاب PDF + تسجيل MP3 واحد ---
  // {
  //   id: 'my-pdf-book',
  //   title: 'اسم الكتاب',
  //   author: 'اسم المؤلف',
  //   coverUrl: '/books/my-pdf-book/cover.jpg',
  //   priceCoins: 100,
  //   language: 'ar',
  //   description: 'وصف قصير للكتاب',
  //   pdfUrl: '/books/my-pdf-book/book.pdf',
  //   audioTracks: [{ title: 'الكتاب كامل', url: '/books/my-pdf-book/audio.mp3' }],
  // },
  // --- كتاب صور (كل صفحة صورة) + فصول صوتية ---
  // {
  //   id: 'my-image-book',
  //   title: 'Book Title',
  //   author: 'Author',
  //   coverUrl: '/books/my-image-book/cover.jpg',
  //   priceCoins: 0,
  //   language: 'en',
  //   description: 'Short description',
  //   imageUrls: numberedImages('/books/my-image-book/page-', 12),
  //   audioTracks: [
  //     { title: 'Chapter 1', url: '/books/my-image-book/ch1.mp3' },
  //     { title: 'Chapter 2', url: '/books/my-image-book/ch2.mp3' },
  //   ],
  // },
]

// لو عايز تشيل الكتب التجريبية: خليها [...myBooks] بس
export const library: Book[] = [...myBooks, ...demoBooks]