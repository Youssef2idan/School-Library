import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Info,
  Languages,
  LogOut,
  Palette,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Modal, TopBar } from '@/components'
import { setLang } from '@/i18n'
import type { Lang } from '@/i18n'
import { cn } from '@/lib/cn'
import { useSettings } from '@/store/settings'

interface RowProps {
  icon: ReactNode
  label: string
  children?: ReactNode
  onClick?: () => void
  danger?: boolean
}

function Row({ icon, label, children, onClick, danger }: RowProps) {
  const cls = 'flex min-h-14 w-full items-center gap-3 px-4'
  const content = (
    <>
      <span className={danger ? 'text-danger' : 'text-primary-soft'}>{icon}</span>
      <span className={cn('flex-1 text-start text-sm font-semibold', danger && 'text-danger')}>{label}</span>
      {children}
    </>
  )
  return onClick ? (
    <button onClick={onClick} className={cls}>
      {content}
    </button>
  ) : (
    <div className={cls}>{content}</div>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-primary' : 'bg-surface-2')}
    >
      <span
        className={cn(
          'absolute top-0.5 size-6 rounded-full bg-white transition-all',
          on ? 'start-[1.375rem]' : 'start-0.5',
        )}
      />
    </button>
  )
}

type Dialog = 'about' | 'help' | 'logout' | null

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const notifications = useSettings((s) => s.notifications)
  const setNotifications = useSettings((s) => s.setNotifications)
  const [dialog, setDialog] = useState<Dialog>(null)

  const isAr = i18n.language === 'ar'
  const Arrow = isAr ? ChevronLeft : ChevronRight
  const langs: { code: Lang; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
  ]

  return (
    <>
      <TopBar title={t('settings.title')} />

      <div className="space-y-4 p-4">
        <Card className="divide-y divide-line p-0">
          <Row icon={<Bell size={22} />} label={t('settings.notifications')}>
            <Toggle on={notifications} onChange={setNotifications} label={t('settings.notifications')} />
          </Row>

          <Row icon={<Palette size={22} />} label={t('settings.theme')}>
            <span className="text-sm text-muted">{t('settings.themeDark')}</span>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-bold text-primary-soft">
              {t('settings.soon')}
            </span>
          </Row>

          <Row icon={<Languages size={22} />} label={t('settings.language')}>
            <div className="flex gap-1">
              {langs.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={cn(
                    'min-h-9 rounded-full px-3 text-xs font-semibold',
                    i18n.language === code ? 'bg-primary text-white' : 'bg-surface-2 text-muted',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Row>
        </Card>

        <Card className="divide-y divide-line p-0">
          <Row icon={<Info size={22} />} label={t('settings.about')} onClick={() => setDialog('about')}>
            <Arrow size={18} className="text-muted" />
          </Row>
          <Row icon={<CircleHelp size={22} />} label={t('settings.help')} onClick={() => setDialog('help')}>
            <Arrow size={18} className="text-muted" />
          </Row>
          <Row icon={<LogOut size={22} />} label={t('settings.logout')} danger onClick={() => setDialog('logout')}>
            <Arrow size={18} className="text-muted" />
          </Row>
        </Card>
      </div>

      <Modal open={dialog === 'about'} onClose={() => setDialog(null)}>
        <h2 className="mb-2 text-xl font-bold">{t('settings.aboutTitle')}</h2>
        <p className="mb-2 text-sm text-muted">{t('settings.aboutText')}</p>
        <p className="mb-5 text-xs text-muted">{t('settings.version')}</p>
        <Button fullWidth onClick={() => setDialog(null)}>
          {t('settings.ok')}
        </Button>
      </Modal>

      <Modal open={dialog === 'help'} onClose={() => setDialog(null)}>
        <h2 className="mb-2 text-xl font-bold">{t('settings.helpTitle')}</h2>
        <p className="mb-5 text-sm text-muted">{t('settings.helpText')}</p>
        <Button fullWidth onClick={() => setDialog(null)}>
          {t('settings.ok')}
        </Button>
      </Modal>

      <Modal open={dialog === 'logout'} onClose={() => setDialog(null)}>
        <h2 className="mb-2 text-xl font-bold">{t('settings.logoutTitle')}</h2>
        <p className="mb-5 text-sm text-muted">{t('settings.logoutText')}</p>
        <div className="space-y-2">
          <Button fullWidth onClick={() => navigate('/splash', { replace: true })}>
            {t('settings.ok')}
          </Button>
          <Button fullWidth variant="secondary" onClick={() => setDialog(null)}>
            {t('settings.cancel')}
          </Button>
        </div>
      </Modal>
    </>
  )
}