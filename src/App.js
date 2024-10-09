import "./App.css";
import Login from "./components/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import CustomNavbar from "./components/navbar/Navbar";
import { useState, useEffect } from "react";
import Sale from "./components/sale/Sale";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Chequear si hay un token en el almacenamiento local
    const storedToken = localStorage.getItem("user");
    if (storedToken) {
      // Si hay un token, establecer el estado de inicio de sesión y actualizar el token
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? <CustomNavbar /> : ""}

      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/sale" element={<Sale />} />
          </>
        ) : (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;