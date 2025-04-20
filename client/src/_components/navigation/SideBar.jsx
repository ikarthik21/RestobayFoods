import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Utensils, Table, Clock, Pizza } from "lucide-react";
const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/menu", icon: Utensils, label: "Menu" },
    { path: "/table", icon: Table, label: "Book Table" },
    { path: "/bookings/table", icon: Clock, label: "Table Bookings" },
    { path: "/orders", icon: Pizza, label: "Order History" }
  ];

  return (
    <aside
      className={`h-full bg-[#ef5644] fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out 
        ${isExpanded ? "w-60" : "w-16"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col items-center h-full pt-12">
        <nav className="flex flex-col items-start w-full space-y-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center text-white w-full px-4 py-2 hover:bg-red-600 transition-colors"
            >
              <item.icon size={28} className="min-w-7" />
              <span
                className={`ml-4 whitespace-nowrap ${
                  isExpanded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
