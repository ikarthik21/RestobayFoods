import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) =>
      state.cart.find((i) => i.id === item.id)
        ? {
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          }
        : { cart: [...state.cart, { ...item, quantity: 1 }] }
    ),
  removeFromCart: (item_id) =>
    set((state) => ({
      cart: state.cart
        .map((i) => (i.id === item_id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0) // Remove items with quantity 0
    }))
}));

export default useCartStore;
