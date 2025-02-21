import "./App.css";
import Login from "./components/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/navbar/Navbar";
import { useState, useEffect } from "react";
import SaleCreate from "./components/saleCreate/SaleCreate";
import SaleList from "./components/saleList/SaleList";
import TransferList from "./components/transferList/TransferList";
import ClientList from "./components/clientList/ClientList";
import ProductList from "./components/productList/ProductList";
import BrandList from "./components/brandList/BrandList";
import SaleImport from "./components/saleImport/SaleImport";
import StoreProductList from "./components/storeProductList/StoreProductList";
import StoreList from "./components/storeList/StoreList";
import ProductImport from "./components/productImport/ProductImport";
import CashSummary from "./components/cashSummary/CashSummary";
import LogList from "./components/logList/LogList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user = localStorage.getItem("user");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? <CustomNavbar /> : ""}

      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/tiendas/" element={<StoreList />} />
            <Route path="/ventas/" element={<SaleList />} />
            <Route path="/vender/" element={<SaleCreate />} />
            <Route path="/importar-ventas/" element={<SaleImport />} />
            <Route path="/resumen-caja/" element={<CashSummary />} />
            <Route path="/distribuir/" element={<SaleCreate />} />
            <Route path="/traspasos/" element={<TransferList />} />
            <Route path="/clientes/" element={<ClientList />} />
            <Route path="/productos/" element={<ProductList />} />
            <Route path="/importar-productos/" element={<ProductImport />} />
            <Route path="/inventario/" element={<StoreProductList />} />
            <Route path="/marcas/" element={<BrandList />} />
            <Route path="/logs/" element={<LogList />} />
            {user.store_id  ? (<Route path="/" element={<SaleCreate />} />): (<Route path="/" element={<SaleCreate />} />)}
            {user.store_id  ? (<Route path="/*" element={<SaleCreate />} />): (<Route path="/*" element={<SaleCreate />} />)}
            
          </>
        ) : (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
