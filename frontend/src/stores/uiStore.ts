import { create } from 'zustand'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIState {
  isGlobalLoading: boolean
  toasts: Toast[]
  isNavOpen: boolean
  
  // Actions
  setGlobalLoading: (loading: boolean) => void
  addToast: (message: string, type: Toast['type']) => void
  removeToast: (id: number) => void
  toggleNav: () => void
  setNavOpen: (open: boolean) => void
}

let toastId = 0

export const useUIStore = create<UIState>((set, get) => ({
  isGlobalLoading: false,
  toasts: [],
  isNavOpen: false,
  
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
  
  addToast: (message, type) => {
    const id = ++toastId
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }))
    // Auto remove after 3 seconds
    setTimeout(() => {
      get().removeToast(id)
    }, 3000)
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
  
  setNavOpen: (isNavOpen) => set({ isNavOpen })
}))
