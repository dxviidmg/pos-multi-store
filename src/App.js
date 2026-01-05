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
import TenantPaymentList from "./components/tenantPaymentList/TenantPaymentList";
import CashFlowList from "./components/cashFlowList/CashFlowList";
import SellerList from "./components/sellerList/SellerList";
import { getUserData } from "./components/apis/utils";
import DepartmentList from "./components/departmentList/DepartmentList";
import StoreProductImport from "./components/storeProductImport/StoreProductImport";
import ServiceList from "./components/serviceList/ServiceList";
import ProductReassign from "./components/productReassign/ProductReassign";
import useKeepAlive from "./components/apis/keepAlive";
import AuditDashboard from "./components/auditDashboard/AuditDashboard";
import Dashboard from "./components/dashboard/Dashboard";
import DistributionList from "./components/distributionList/DistributionList";
import RestartRervice from "./components/restartService/RestartService";

function App() {

  useKeepAlive()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user = getUserData();

  useEffect(() => {
    const user = getUserData();
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
            <Route path="/corte-caja/" element={<CashSummary />} />
            <Route path="/movimientos/" element={<CashFlowList />} />
            <Route path="/distribuir/" element={<SaleCreate />} />
            <Route path="/distribuciones/" element={<DistributionList />} />
            <Route path="/traspasos/" element={<TransferList />} />
            <Route path="/clientes/" element={<ClientList />} />
            <Route path="/productos/" element={<ProductList />} />
            <Route path="/importar-productos/" element={<ProductImport />} />
            <Route path="/inventario/" element={<StoreProductList />} />
            <Route path="/importar-inventario/" element={<StoreProductImport />} />
            <Route path="/marcas/" element={<BrandList />} />
            <Route path="/departamentos/" element={<DepartmentList />} />
            <Route path="/reasignacion/" element={<ProductReassign />} />
            <Route path="/logs/" element={<LogList />} />
            <Route path="/pagos/" element={<TenantPaymentList />} />
            <Route path="/vendedores/" element={<SellerList />} />
            <Route path="/servicios/" element={<ServiceList />} />
            <Route path="/tablero-auditoria/" element={<AuditDashboard />} />
            <Route path="/tablero/" element={<Dashboard />} />
            <Route path="/sincronizar/" element={<RestartRervice />} />
            {user.store_id ? (<Route path="/*" element={<SaleCreate />} />): (<Route path="/*" element={<StoreList />} />)}
          </>
        ) : (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
