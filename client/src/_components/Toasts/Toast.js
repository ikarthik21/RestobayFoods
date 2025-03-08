import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({
  type,
  message,
  duration = 1500,
  position = "bottom-center"
}) => {
  const options = {
    autoClose: duration,
    position: position,
    closeButton: false,
    hideProgressBar: true,
    className: "custom-toast"
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast.info(message, options);
  }
};

export default Toast;
