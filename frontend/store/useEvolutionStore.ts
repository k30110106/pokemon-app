import { create } from "zustand";

interface PokemonState {
  currentId: number | null;
  setCurrentId: (id: number) => void;
}

export const usePokemonStore = create<PokemonState>((set) => ({
  currentId: null,
  setCurrentId: (id) => set({ currentId: id }),
}));
