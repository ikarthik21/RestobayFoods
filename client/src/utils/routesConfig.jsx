import Home from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Menu from "@/pages/Menu/Menu";

const routesConfig = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/menu", element: <Menu /> }
];

export default routesConfig;
