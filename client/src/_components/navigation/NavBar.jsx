import { Link } from "react-router-dom";
import useAuthStore from "../../store/use-auth";

const NavBar = () => {
  const { isAuthenticated, removeAccessToken } = useAuthStore();
  return (
    <nav className="fixed top-0 left-0 z-30 w-full bg-[#fff0df]">
      <div className="flex justify-between items-center ml-16 p-2">
        {/* Logo */}
        <Link to="/">
          <h1 className="logo-var-1 text-4xl font-bold ">RESTOBAY</h1>
        </Link>

        {/* Login & Profile */}

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
    </nav>
  );
};

export default NavBar;
