import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  merchantId: string;
  confirmedMerchantId: string;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMerchantId: (id: string) => void;
  setConfirmedMerchantId: (id: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sidebarOpen: true,
      merchantId: '',
      confirmedMerchantId: '',
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMerchantId: (id) => set({ merchantId: id }),
      setConfirmedMerchantId: (id) => set({ confirmedMerchantId: id }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sidebarOpen: state.sidebarOpen,
        merchantId: state.merchantId,
        confirmedMerchantId: state.confirmedMerchantId,
      }),
    }
  )
); 