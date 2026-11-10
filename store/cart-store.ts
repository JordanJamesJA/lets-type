import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const getStock = (productId: string) =>
  products.find((product) => product.id === productId)?.stock ?? 0;

const clampQuantity = (quantity: number, stock: number) => {
  if (!Number.isFinite(quantity)) return 0;

  return Math.min(Math.max(0, Math.floor(quantity)), stock);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const stock = getStock(product.id);
          const amount = clampQuantity(quantity, stock);

          if (amount === 0) return state;

          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );

          if (!existing) {
            return {
              items: [...state.items, { product, quantity: amount }],
            };
          }

          return {
            items: state.items.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: clampQuantity(existing.quantity + amount, stock),
                  }
                : item,
            ),
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== productId,
          ),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId
                ? {
                    ...item,
                    quantity: clampQuantity(quantity, getStock(productId)),
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "lets-type-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);