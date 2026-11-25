import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  notifications: boolean
  setNotifications: (value: boolean) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      setNotifications: (notifications) => set({ notifications }),
    }),
    { name: 'school-library-settings' },
  ),
)