import React from "react";

const Home = React.lazy(() => import("@/pages/Home"));
const Login = React.lazy(() => import("@/pages/Auth/Login"));
const Menu = React.lazy(() => import("@/pages/Menu/Menu"));
const Orders = React.lazy(() => import("../pages/Orders/Orders"));
const Tables = React.lazy(() => import("../pages/Tables/Tables"));
const MyTableBookings = React.lazy(() =>
  import("../pages/Tables/MyTableBookings")
);
const Admin = React.lazy(() => import("../pages/Admin/Admin"));
import PrivateRoute from "@/utils/PrivateRoute";

const routesConfig = [
  {
    path: "/",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Home />
      </React.Suspense>
    )
  },
  {
    path: "/home",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Home />
      </React.Suspense>
    )
  },
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Login />
      </React.Suspense>
    )
  },
  {
    path: "/menu",
    element: (
      <PrivateRoute>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Menu />
        </React.Suspense>
      </PrivateRoute>
    )
  },
  {
    path: "/orders",
    element: (
      <PrivateRoute>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Orders />
        </React.Suspense>
      </PrivateRoute>
    )
  },
  {
    path: "/table",
    element: (
      <PrivateRoute>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Tables />
        </React.Suspense>
      </PrivateRoute>
    )
  },
  {
    path: "/bookings/table",
    element: (
      <PrivateRoute>
        <React.Suspense fallback={<div>Loading...</div>}>
          <MyTableBookings />
        </React.Suspense>
      </PrivateRoute>
    )
  },
  {
    path: "/admin/dashboard",
    element: (
      <PrivateRoute>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Admin />
        </React.Suspense>
      </PrivateRoute>
    )
  }
];

export default routesConfig;
