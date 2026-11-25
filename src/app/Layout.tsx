import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '@/components'
import { cn } from '@/lib/cn'

const HIDE_NAV = ['/rewards', '/leaderboard', '/settings']

function splashSeen(): boolean {
  try {
    return sessionStorage.getItem('splash-shown') === '1'
  } catch {
    return true
  }
}

export default function Layout() {
  const { pathname } = useLocation()

  // أول مرة تفتح التطبيق: اعرض الـ Splash
  if (!splashSeen() && pathname === '/') return <Navigate to="/splash" replace />

  const showNav = !HIDE_NAV.includes(pathname)

  return (
    <div className={cn('mx-auto min-h-full max-w-[430px]', showNav ? 'pb-24' : 'pb-8')}>
      <Outlet />
      {showNav && <BottomNav />}
    </div>
  )
}