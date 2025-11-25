import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types';

interface UserState extends UserInfo {
  // Actions
  setUserInfo: (info: Partial<UserInfo>) => void;
  setFullName: (name: string) => void;
  clearUserInfo: () => void;
}

const initialState: UserInfo = {
  name: '',
  firstName: '',
  lastName: '',
  email: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setUserInfo: (info) => {
        set((state) => ({ ...state, ...info }));
      },

      setFullName: (name) => {
        const parts = name.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        set({
          name,
          firstName,
          lastName,
        });
      },

      clearUserInfo: () => {
        set(initialState);
      },
    }),
    {
      name: 'haircare-user-storage',
    }
  )
);
