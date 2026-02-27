import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { getUserData } from "./api/utils";
import useKeepAlive from "./api/keepAlive";
import LoadingFallback from "./components/commons/LoadingFallback";

// Componentes críticos (carga inmediata)
import Login from "./components/login/Login";
import MiniDrawer from "./components/navbar/SideBar";

// Lazy loading para rutas
const SaleCreate = lazy(() => import("./components/saleCreate/SaleCreate"));
const SaleList = lazy(() => import("./components/saleList/SaleList"));
const TransferList = lazy(() => import("./components/transferList/TransferList"));
const ClientList = lazy(() => import("./components/clientList/ClientList"));
const ProductList = lazy(() => import("./components/productList/ProductList"));
const BrandList = lazy(() => import("./components/brandList/BrandList"));
const SaleImport = lazy(() => import("./components/saleImport/SaleImport"));
const StoreProductList = lazy(() => import("./components/storeProductList/StoreProductList"));
const StoreList = lazy(() => import("./components/storeList/StoreList"));
const ProductImport = lazy(() => import("./components/productImport/ProductImport"));
const CashSummary = lazy(() => import("./components/cashSummary/CashSummary"));
const LogList = lazy(() => import("./components/logList/LogList"));
const TenantPaymentList = lazy(() => import("./components/tenantPaymentList/TenantPaymentList"));
const CashFlowList = lazy(() => import("./components/cashFlowList/CashFlowList"));
const SellerList = lazy(() => import("./components/sellerList/SellerList"));
const DepartmentList = lazy(() => import("./components/departmentList/DepartmentList"));
const StoreProductImport = lazy(() => import("./components/storeProductImport/StoreProductImport"));
const ServiceList = lazy(() => import("./components/serviceList/ServiceList"));
const ProductReassign = lazy(() => import("./components/productReassign/ProductReassign"));
const AuditDashboard = lazy(() => import("./components/auditDashboard/AuditDashboard"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const DistributionList = lazy(() => import("./components/distributionList/DistributionList"));
const RestartService = lazy(() => import("./components/restartService/RestartService"));

function App() {
  useKeepAlive();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = getUserData();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <Route element={<MiniDrawer />}>
            <Route path="/tiendas/" element={<Suspense fallback={<LoadingFallback />}><StoreList /></Suspense>} />
            <Route path="/ventas/" element={<Suspense fallback={<LoadingFallback />}><SaleList /></Suspense>} />
            <Route path="/vender/" element={<Suspense fallback={<LoadingFallback />}><SaleCreate /></Suspense>} />
            <Route path="/importar-ventas/" element={<Suspense fallback={<LoadingFallback />}><SaleImport /></Suspense>} />
            <Route path="/corte-caja/" element={<Suspense fallback={<LoadingFallback />}><CashSummary /></Suspense>} />
            <Route path="/movimientos/" element={<Suspense fallback={<LoadingFallback />}><CashFlowList /></Suspense>} />
            <Route path="/distribuciones/" element={<Suspense fallback={<LoadingFallback />}><DistributionList /></Suspense>} />
            <Route path="/traspasos/" element={<Suspense fallback={<LoadingFallback />}><TransferList /></Suspense>} />
            <Route path="/clientes/" element={<Suspense fallback={<LoadingFallback />}><ClientList /></Suspense>} />
            <Route path="/productos/" element={<Suspense fallback={<LoadingFallback />}><ProductList /></Suspense>} />
            <Route path="/inventario/" element={<Suspense fallback={<LoadingFallback />}><StoreProductList /></Suspense>} />
            <Route path="/marcas/" element={<Suspense fallback={<LoadingFallback />}><BrandList /></Suspense>} />
            <Route path="/departamentos/" element={<Suspense fallback={<LoadingFallback />}><DepartmentList /></Suspense>} />
            <Route path="/logs/" element={<Suspense fallback={<LoadingFallback />}><LogList /></Suspense>} />
            <Route path="/pagos/" element={<Suspense fallback={<LoadingFallback />}><TenantPaymentList /></Suspense>} />
            <Route path="/vendedores/" element={<Suspense fallback={<LoadingFallback />}><SellerList /></Suspense>} />
            <Route path="/servicios/" element={<Suspense fallback={<LoadingFallback />}><ServiceList /></Suspense>} />
            <Route path="/tablero/" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
            <Route path="/reasignacion/" element={<Suspense fallback={<LoadingFallback />}><ProductReassign /></Suspense>} />
            <Route path="/importar-productos/" element={<Suspense fallback={<LoadingFallback />}><ProductImport /></Suspense>} />
            <Route path="/importar-inventario/" element={<Suspense fallback={<LoadingFallback />}><StoreProductImport /></Suspense>} />
            <Route path="/auditoria/" element={<Suspense fallback={<LoadingFallback />}><AuditDashboard /></Suspense>} />
            <Route path="/sincronizar/" element={<Suspense fallback={<LoadingFallback />}><RestartService /></Suspense>} />
            {user?.store_id ? (
              <Route path="*" element={<Suspense fallback={<LoadingFallback />}><SaleCreate /></Suspense>} />
            ) : (
              <Route path="*" element={<Suspense fallback={<LoadingFallback />}><StoreList /></Suspense>} />
            )}
          </Route>
        ) : (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
  
}

export default App;
