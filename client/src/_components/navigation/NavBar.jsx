import { Link } from "react-router-dom";
import useAuthStore from "../../store/use-auth";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import useCartStore from "@/store/use-cart";
import useModalStore from "../../store/use-modal";

const NavBar = () => {
  const { isAuthenticated, removeAccessToken } = useAuthStore();
  const { cart } = useCartStore();
  const { openModal } = useModalStore();

  return (
    <nav className="fixed top-0 left-0 z-30 w-full bg-[#fff0df]">
      <div className="flex justify-between items-center ml-16 p-2">
        {/* Logo */}
        <Link to="/">
          <h1 className="logo-var-1 text-4xl font-bold ">RESTOBAY</h1>
        </Link>

        {/* Login & Profile */}

        <div className="flex items-center space-x-4">
          <div
            className="bg-white flex items-center  px-3 py-1.5 rounded cursor-pointer"
            onClick={openModal}
          >
            <FastfoodIcon sx={{ color: "#ef5644" }} />
            <p className="ml-2 font-bold text-sm">{cart?.length}</p>
          </div>

          {isAuthenticated ? (
            <button
              className="btn-var-1  kanit-500 cursor-pointer"
              onClick={removeAccessToken}
            >
              <p>Logout</p>
            </button>
          ) : (
            <Link to="/login">
              <button className="btn-var-1 kanit-500 cursor-pointer">
                <p>Login</p>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
