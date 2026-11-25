import type { Book, LeaderboardEntry, User, UserBookProgress } from '@/types'

const cover = (title: string, c1: string, c2: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
        </linearGradient>
        <radialGradient id="s" cx="0.5" cy="0.25" r="0.6">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g)"/>
      <rect width="200" height="300" fill="url(#s)"/>
      <rect x="0" y="0" width="12" height="300" fill="#000" opacity="0.2"/>
      <circle cx="140" cy="70" r="26" fill="#fff" opacity="0.15"/>
      <text x="106" y="165" font-size="24" font-weight="700" fill="#fff" text-anchor="middle" font-family="Georgia, serif">${title}</text>
      <rect x="60" y="190" width="90" height="3" rx="1.5" fill="#fff" opacity="0.6"/>
    </svg>`,
  )}`

export const books: Book[] = [
  {
    id: 'alice',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    coverUrl: cover('Alice', '#8b5cf6', '#4c1d95'),
    priceCoins: 0,
    language: 'en',
    description: 'A girl falls down a rabbit hole into a strange world.',
    pages: [
      {
        pageNumber: 1,
        text: 'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do. Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it.',
      },
      {
        pageNumber: 2,
        text: 'And what is the use of a book, thought Alice, without pictures or conversations? So she was considering in her own mind whether the pleasure of making a daisy-chain was worth the trouble of getting up.',
      },
      {
        pageNumber: 3,
        text: 'Suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that. Alice did not think it so very much out of the way to hear the Rabbit say to itself, Oh dear! I shall be late!',
      },
    ],
  },
  {
    id: 'sherlock',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    coverUrl: cover('Sherlock', '#f59e0b', '#78350f'),
    priceCoins: 100,
    language: 'en',
    description: "Mysteries solved by the world's greatest detective.",
    pages: [
      {
        pageNumber: 1,
        text: 'To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.',
      },
      {
        pageNumber: 2,
        text: 'It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.',
      },
    ],
  },
  {
    id: 'oz',
    title: 'The Wonderful Wizard of Oz',
    author: 'L. Frank Baum',
    coverUrl: cover('Oz', '#10b981', '#064e3b'),
    priceCoins: 120,
    language: 'en',
    description: 'A cyclone carries Dorothy to a magical land.',
    pages: [
      {
        pageNumber: 1,
        text: "Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer's wife.",
      },
      {
        pageNumber: 2,
        text: 'When Dorothy stood in the doorway and looked around, she could see nothing but the great gray prairie on every side.',
      },
    ],
  },
  {
    id: 'treasure',
    title: 'Treasure Island',
    author: 'Robert Louis Stevenson',
    coverUrl: cover('Treasure Island', '#3b82f6', '#1e3a8a'),
    priceCoins: 150,
    language: 'en',
    description: 'Pirates, maps and buried gold.',
    pages: [
      {
        pageNumber: 1,
        text: 'Squire Trelawney, Dr. Livesey, and the rest of these gentlemen having asked me to write down the whole particulars about Treasure Island, from the beginning to the end, I take up my pen in the year of grace seventeen hundred and fifty-something.',
      },
    ],
  },
  {
    id: 'peter-pan',
    title: 'Peter Pan',
    author: 'J. M. Barrie',
    coverUrl: cover('Peter Pan', '#f43f5e', '#881337'),
    priceCoins: 180,
    language: 'en',
    description: 'The boy who would not grow up.',
    pages: [
      {
        pageNumber: 1,
        text: 'All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this.',
      },
    ],
  },
]

export const currentUser: User = {
  id: 'u1',
  name: 'Youssef Zidan',
  avatarUrl: '',
  role: 'student',
  coins: 250,
  streak: 7,
  totalDays: 42,
}

export const initialProgress: UserBookProgress[] = [
  { bookId: 'alice', unlocked: true, lastPage: 1, completed: false },
  { bookId: 'sherlock', unlocked: true, lastPage: 1, completed: false },
]

export const leaderboard: LeaderboardEntry[] = [
  { userId: 'u2', name: 'Omar', avatarUrl: '', coins: 1500, booksRead: 40 },
  { userId: 'u3', name: 'Sara', avatarUrl: '', coins: 1200, booksRead: 33 },
  { userId: 'u4', name: 'Ali', avatarUrl: '', coins: 1100, booksRead: 30 },
  { userId: 'u5', name: 'Ahmed Khaled', avatarUrl: '', coins: 950, booksRead: 25 },
  { userId: 'u1', name: 'Youssef Zidan', avatarUrl: '', coins: 850, booksRead: 28 },
  { userId: 'u6', name: 'Hana Mohamed', avatarUrl: '', coins: 780, booksRead: 22 },
]