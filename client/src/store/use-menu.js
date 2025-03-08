import { create } from "zustand";

const useMenuStore = create((set) => ({
  menu: [],
  categories: [],
  selectedCategory: "All",
  isLoading: false,
  error: null,
  search: "",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setMenu: (menu) => set({ menu }),
  setCategories: (categories) => set({ categories }),
  setSearch: (search) => set({ search })
}));

export default useMenuStore;
