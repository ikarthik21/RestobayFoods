import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import useModalStore from "../../store/use-modal";
import CancelIcon from "@mui/icons-material/Cancel";

// eslint-disable-next-line react/prop-types
function Modal({ children }) {
  const { isOpen, closeModal, setModalRef } = useModalStore();
  const localRef = useRef(null);

  // Set the modal reference when component mounts and when the ref changes
  useEffect(() => {
    if (localRef.current) {
      setModalRef(localRef.current);
    }
  }, [localRef, setModalRef]);

  // Setup click outside handler when modal is open
  useEffect(() => {
    if (!isOpen || !localRef.current) return;

    // Handler function for clicks
    const handleClickOutside = (event) => {
      // If the click is outside the modal (not on the modal or its children)
      if (localRef.current && !localRef.current.contains(event.target)) {
        closeModal();
      }
    };

    // Add the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when component unmounts or modal closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

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
          className="bg-[#fff0df] relative rounded-md p-2"
          ref={localRef}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col p-2">
            <div className="flex items-center justify-end mb-4">
              <div onClick={closeModal}>
                <CancelIcon
                  sx={{ color: "#ef5644", fontSize: "25px" }}
                  cursor={"pointer"}
                />
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
