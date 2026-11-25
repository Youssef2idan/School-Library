import { BarChart3, BookOpen, Home, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

const items = [
  { to: '/', key: 'home', icon: Home },
  { to: '/books', key: 'books', icon: BookOpen },
  { to: '/stats', key: 'stats', icon: BarChart3 },
  { to: '/profile', key: 'profile', icon: User },
] as const

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[430px] rounded-t-3xl border-t border-line bg-surface/95 backdrop-blur">
      {items.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold',
              isActive ? 'text-primary-soft' : 'text-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} fill={isActive ? 'currentColor' : 'none'} />
              {t(`nav.${key}`)}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}