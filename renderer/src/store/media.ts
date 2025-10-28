import { create } from 'zustand';
import type { MediaItemMeta } from '../lib/media';

type MediaActions = {
    addItem: (item: MediaItemMeta) => void;
    updateItem: (id: string, patch: Partial<MediaItemMeta>) => void;
    clear: () => void;
};

type MediaStore = {
    items: MediaItemMeta[];
} & MediaActions;

export const useMediaStore = create<MediaStore>((set) => ({
    items: [],
    addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
    updateItem: (id, patch) => set((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
    clear: () => set({ items: [] }),
}));


