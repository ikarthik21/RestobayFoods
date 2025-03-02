const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#fff0df]">
      <div className="flex justify-between items-center ml-16 p-2">
        {/* Logo */}
        <div className="">
          <h1 className="logo-var-1 text-4xl font-bold ">RESTOBAY</h1>
        </div>

        {/* Login & Profile */}
        <div>
          <button className="btn-var-1 cursor-pointer">
            <p>Login</p>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
