import { create } from "zustand";

const useModalStore = create((set, get) => ({
  // State
  isOpen: false,
  modalRef: { current: null },

  // Actions
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),

  // Set reference to modal element
  setModalRef: (ref) => set({ modalRef: { current: ref } }),

  // Setup click outside handler
  setupClickOutsideHandler: () => {
    const handleClickOutside = (event) => {
      const { modalRef, closeModal, isOpen } = get();

      // Safety checks to ensure we have valid references
      if (!isOpen || !modalRef || !modalRef.current) return;

      // Check if click was outside the modal
      if (!modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Return cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }
}));

export default useModalStore;
