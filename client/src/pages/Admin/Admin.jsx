import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import Orders from "../../_components/Admin/Orders";
import TableBookings from "../../_components/Admin/TableBookings";
import Menu from "../../_components/Admin/Menu";
import { useState } from "react";
import Users from "../../_components/Admin/Users";

const Admin = () => {
  const [component, setComponent] = useState("Food Orders");

  return (
    <BlockWrapper>
      <h1 className="anton  text-center tracking-wide text-2xl text-[#ef5644]">
        Admin Dashboard
      </h1>

      {/* Navigation */}
      <div className=" flex items-center  justify-center gap-4 mt-4">
        <button
          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            component === "Food Orders"
              ? "bg-[#ef5644] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setComponent("Food Orders")}
        >
          Food Orders
        </button>
        <button
          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            component === "Table Bookings"
              ? "bg-[#ef5644] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setComponent("Table Bookings")}
        >
          Table Bookings
        </button>
        <button
          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            component === "Users"
              ? "bg-[#ef5644] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setComponent("Users")}
        >
          Users
        </button>
        <button
          className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            component === "Edit Menu"
              ? "bg-[#ef5644] text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setComponent("Edit Menu")}
        >
          Edit Menu
        </button>
      </div>

      <div className="mt-4">
        {component === "Food Orders" && <Orders />}
        {component === "Table Bookings" && <TableBookings />}
        {component === "Users" && <Users />}
        {component === "Edit Menu" && <Menu />}
      </div>
    </BlockWrapper>
  );
};

export default Admin;
