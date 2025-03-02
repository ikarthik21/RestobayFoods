import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "@/_components/navigation/NavBar.jsx";
import routesConfig from "@/utils/routesConfig";
import SideBar from "./_components/navigation/SideBar.jsx";
function App() {
  return (
    <div>
      <Router>
        <SideBar />
        <NavBar />

        <Routes>
          {routesConfig.map((route) => (
            <Route
              key={route.path}
              exact
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
