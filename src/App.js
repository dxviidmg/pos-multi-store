import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { getUserData } from "./api/utils";
import useKeepAlive from "./api/keepAlive";
import LoadingFallback from "./components/ui/LoadingFallback";

// Componentes críticos (carga inmediata)
import Login from "./components/layout/Login/Login";
import MainLayout from "./components/layout/MainLayout/MainLayout";

// Lazy loading para rutas
const SaleCreate = lazy(() => import("./components/sales/SaleCreate/SaleCreate"));
const SaleList = lazy(() => import("./components/sales/SaleList/SaleList"));
const TransferList = lazy(() => import("./components/inventory/TransferList/TransferList"));
const ClientList = lazy(() => import("./components/clients/ClientList/ClientList"));
const ProductList = lazy(() => import("./components/products/ProductList/ProductList"));
const BrandList = lazy(() => import("./components/catalog/BrandList/BrandList"));
const SaleImport = lazy(() => import("./components/sales/SaleImport/SaleImport"));
const StoreProductList = lazy(() => import("./components/products/StoreProductList/StoreProductList"));
const StoreList = lazy(() => import("./components/admin/StoreList/StoreList"));
const ProductImport = lazy(() => import("./components/products/ProductImport/ProductImport"));
const CashSummary = lazy(() => import("./components/sales/CashSummary/CashSummary"));
const LogList = lazy(() => import("./components/admin/LogList/LogList"));
const TenantPaymentList = lazy(() => import("./components/finance/TenantPaymentList/TenantPaymentList"));
const CashFlowList = lazy(() => import("./components/finance/CashFlowList/CashFlowList"));
const SellerList = lazy(() => import("./components/catalog/SellerList/SellerList"));
const DepartmentList = lazy(() => import("./components/catalog/DepartmentList/DepartmentList"));
const StoreProductImport = lazy(() => import("./components/products/StoreProductImport/StoreProductImport"));
const ServiceList = lazy(() => import("./components/admin/ServiceList/ServiceList"));
const ProductReassign = lazy(() => import("./components/products/ProductReassign/ProductReassign"));
const AuditDashboard = lazy(() => import("./components/admin/AuditDashboard/AuditDashboard"));
const Dashboard = lazy(() => import("./components/admin/Dashboard/Dashboard"));
const DistributionList = lazy(() => import("./components/inventory/DistributionList/DistributionList"));
const RestartService = lazy(() => import("./components/admin/RestartService/RestartService"));
const TenantProfile = lazy(() => import("./components/admin/TenantProfile/TenantProfile"));

function App({ toggleTheme, themeMode }) {
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
          <Route element={<MainLayout toggleTheme={toggleTheme} themeMode={themeMode} />}>
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
            <Route path="/tenant-profile/" element={<Suspense fallback={<LoadingFallback />}><TenantProfile /></Suspense>} />
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
