import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "@/_components/navigation/NavBar.jsx";
import routesConfig from "@/utils/routesConfig";
import SideBar from "./_components/navigation/SideBar.jsx";
import Modal from "./_components/Modals/Modal.jsx";

function App() {
  return (
    <>
      <Router>
        <SideBar />
        <NavBar />
        <Modal />

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
    </>
  );
}

export default App;
