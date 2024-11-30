import { create } from 'zustand';

// State types
interface States {
  count: number;
}

// Action types
interface Actions {
  increase: () => void;
  decrease: () => void;
}

// useCounterStore
export const useCountStore = create<States & Actions>((set) => ({
  // States
  count: 0,
    
  // Actions
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));