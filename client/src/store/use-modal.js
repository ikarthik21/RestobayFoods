import { create } from "zustand";

const useModalStore = create((set, get) => ({
  isOpen: false,
  component: null,
  modalRef: { current: null },
  openModal: (component) => set({ isOpen: true, component }),
  closeModal: () => set({ isOpen: false, component: null }),
  setModalRef: (ref) => set({ modalRef: { current: ref } }),

  setupClickOutsideHandler: () => {
    const handleClickOutside = (event) => {
      const { modalRef, closeModal, isOpen } = get();

      if (!isOpen || !modalRef || !modalRef.current) return;

      if (!modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }
}));

export default useModalStore;
