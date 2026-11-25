import { createBrowserRouter } from 'react-router-dom'
import BooksPage from '@/features/books/BooksPage'
import HomePage from '@/features/home/HomePage'
import SplashPage from '@/features/home/SplashPage'
import LeaderboardPage from '@/features/leaderboard/LeaderboardPage'
import ProfilePage from '@/features/profile/ProfilePage'
import ReaderPage from '@/features/reader/ReaderPage'
import RewardsPage from '@/features/rewards/RewardsPage'
import SettingsPage from '@/features/settings/SettingsPage'
import StatsPage from '@/features/stats/StatsPage'
import Layout from './Layout'

export const router = createBrowserRouter([
  { path: '/splash', element: <SplashPage /> },
  { path: '/reader/:id', element: <ReaderPage /> },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/books', element: <BooksPage /> },
      { path: '/stats', element: <StatsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/rewards', element: <RewardsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
])