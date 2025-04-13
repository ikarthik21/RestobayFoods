import { create } from "zustand";

const useMenuStore = create((set) => ({
  menu: [],
  categories: [],
  selectedCategory: "All",
  selectedItem: null,
  isLoading: false,
  error: null,
  search: "",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setMenu: (menu) => set({ menu }),
  setCategories: (categories) => set({ categories }),
  setSearch: (search) => set({ search }),
  setSelectedItem: (item) => set({ selectedItem: item })
}));

export default useMenuStore;
