import { create } from "zustand";
import restoApiInstance from "../service/api/api";

const useCartStore = create((set, get) => {
  // Function to initialize cart automatically when the store is created
  const initializeCart = async () => {
    set({ isLoading: true, error: null });
    try {
      const { cart } = await restoApiInstance.getCart();
      set({ cart, isLoaded: true, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({ error: error.message, isLoading: false });
    }
  };

  initializeCart();

  return {
    cart: [],
    isLoading: false,
    isLoaded: false,
    error: null,

    addToCart: async (item) => {
      console.log(item);

      set((state) => ({
        cart: state.cart.some((i) => i.id === item.id)
          ? state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...state.cart, { ...item, quantity: 1 }]
      }));

      try {
        const { type, message } = await restoApiInstance.cart({
          item_id: item.id,
          action: "add"
        });

        if (type === "error") throw new Error(message);
      } catch (error) {
        console.error("Failed to add item:", error.message);
      }
    },

    removeFromCart: async (item_id) => {
      set((state) => ({
        cart: state.cart
          .map((i) =>
            i.id === item_id ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0) // Remove if quantity is 0
      }));

      try {
        const { type, message } = await restoApiInstance.cart({
          item_id,
          action: "remove"
        });

        if (type === "error") throw new Error(message);
      } catch (error) {
        console.error("Failed to remove item:", error.message);
      }
    },

    getCart: () => get().cart // Getter for the cart state
  };
});

export default useCartStore;
