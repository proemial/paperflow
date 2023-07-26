import { create } from 'zustand'

export type DrawerState = {
  open: boolean,
  toggle: () => void,
};

export const useDrawerState = create<DrawerState>(set => ({
  open: false,
  toggle: () => set((state) => ({open: !state.open}))
}))
