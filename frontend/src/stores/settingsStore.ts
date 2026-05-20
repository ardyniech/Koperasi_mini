import { create } from 'zustand'

interface Settings {
  community_name: string
  logo_url?: string
  primary_color: string
  footer_text: string
  social_instagram?: string
  social_linkedin?: string
  social_website?: string
}

interface SettingsState {
  settings: Settings
  isLoading: boolean
  
  // Actions
  setSettings: (settings: Settings) => void
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  setLoading: (loading: boolean) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  community_name: 'Koperasi Mini Syariah',
  primary_color: '#007aff',
  footer_text: 'Powered by Ardyniech',
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  isLoading: false,
  
  setSettings: (settings) => set({ settings }),
  
  updateSetting: (key, value) => set((state) => ({
    settings: { ...state.settings, [key]: value }
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  resetSettings: () => set({ settings: defaultSettings })
}))
