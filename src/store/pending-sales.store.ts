import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PendingItem {
  productId: string;
  internalCode: string;
  catalogCode: string;
  description: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PendingService {
  id: number;
  description: string;
  amount: number;
}

export interface PendingSale {
  id: string;
  note: string; // "Toyota ipsum color verde 1025 ABC"
  savedAt: string;
  items: PendingItem[];
  services: PendingService[];
  globalDiscount: number;
  client?: {
    clientId: string;
    name: string;
    document?: string;
  };
}

interface PendingSalesState {
  sales: PendingSale[];
  save: (sale: Omit<PendingSale, "id" | "savedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const usePendingSalesStore = create<PendingSalesState>()(
  persist(
    (set) => ({
      sales: [],

      save: (sale) =>
        set((s) => ({
          sales: [
            ...s.sales,
            {
              ...sale,
              id: `pending-${Date.now()}`,
              savedAt: new Date().toISOString(),
            },
          ],
        })),

      remove: (id) =>
        set((s) => ({
          sales: s.sales.filter((sale) => sale.id !== id),
        })),

      clear: () => set({ sales: [] }),
    }),
    { name: "pending-sales" }
  )
);
