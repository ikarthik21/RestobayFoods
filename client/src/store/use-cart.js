import { create } from "zustand";
import restoApiInstance from "../service/api/api";
import useAuthStore from "./use-auth";

const useCartStore = create((set, get) => {
  const initialState = {
    cart: [],
    isLoading: false,
    isLoaded: false,
    error: null
  };
  const initializeCart = async () => {
    set({ isLoading: true, error: null });
    try {
      const { cart } = await restoApiInstance.getCart();
      set({ cart: cart || [], isLoaded: true, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({ error: error.message, isLoading: false });
    }
  };

  return {
    ...initialState,
    initializeCart,

    addToCart: async (item) => {
      set((state) => ({
        cart: (state.cart || []).some((i) => i.id === item.id)
          ? state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...state.cart, { ...item, quantity: 1 }]
      }));

      if (useAuthStore.getState().isAuthenticated) {
        try {
          const { type, message } = await restoApiInstance.cart({
            item_id: item.id,
            action: "add"
          });

          if (type === "error") throw new Error(message);
        } catch (error) {
          console.error("Failed to add item:", error.message);
        }
      }
    },

    removeFromCart: async (item_id) => {
      set((state) => ({
        cart: state.cart
          .map((i) =>
            i.id === item_id ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0) // Remove item if quantity reaches 0
      }));

      if (useAuthStore.getState().isAuthenticated) {
        try {
          const { type, message } = await restoApiInstance.cart({
            item_id,
            action: "remove"
          });

          if (type === "error") throw new Error(message);
        } catch (error) {
          console.error("Failed to remove item:", error.message);
        }
      }
    },

    getCart: () => {
      if (!get().isLoaded) {
        get().initializeCart(); // ✅ Fetch cart only if not loaded
      }
      return get().cart || [];
    },

    refreshCart: async () => {
      await get().initializeCart();  
    }
  };
});

useCartStore.getState().initializeCart();

export default useCartStore;
