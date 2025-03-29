import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Menu from "@/pages/Menu/Menu";
import Orders from "../pages/Orders/Orders";

const routesConfig = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/menu", element: <Menu /> },
  { path: "/orders", element: <Orders /> }
];

export default routesConfig;
