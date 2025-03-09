import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import useModalStore from "../../store/use-modal";

// eslint-disable-next-line react/prop-types
function Modal({ children }) {
  const { isOpen, closeModal, setModalRef, setupClickOutsideHandler } =
    useModalStore();
  const localRef = useRef(null);

  // Set the modal reference when component mounts and when the ref changes
  useEffect(() => {
    if (localRef.current) {
      setModalRef(localRef.current);
    }
  }, [localRef, setModalRef]);

  // Setup click outside handler when modal is open
  useEffect(() => {
    let cleanup;
    if (isOpen) {
      // Small timeout to ensure DOM is fully updated
      const timeoutId = setTimeout(() => {
        cleanup = setupClickOutsideHandler();
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        if (cleanup) cleanup();
      };
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [isOpen, setupClickOutsideHandler]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="z-50 fixed inset-0 overflow-y-auto flex justify-center items-center backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="z-50 h-full w-full flex items-center justify-center">
        <motion.div
          className="bg-[#fff0df] relative rounded-md p-2 border-2 border-[#1b1b20]"
          ref={localRef}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col p-2">
            <div className="flex items-center justify-end">
              <div onClick={closeModal} color={"white"} cursor={"pointer"}>
                close
              </div>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Modal;
