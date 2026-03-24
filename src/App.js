import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { getUserData } from "./api/utils";
import useKeepAlive from "./api/keepAlive";
import LoadingFallback from "./components/ui/LoadingFallback";

// Componentes críticos (carga inmediata)
import Login from "./components/layout/Login/Login";
import MainLayout from "./components/layout/MainLayout/MainLayout";

const lazyRetry = (importFn) =>
  lazy(() => importFn().catch(() => { window.location.reload(); return new Promise(() => {}); }));

// Lazy loading para rutas
const SaleCreate = lazyRetry(() => import("./components/sales/SaleCreate/SaleCreate"));
const SaleList = lazyRetry(() => import("./components/sales/SaleList/SaleList"));
const TransferList = lazyRetry(() => import("./components/inventory/TransferList/TransferList"));
const ClientList = lazyRetry(() => import("./components/clients/ClientList/ClientList"));
const ProductList = lazyRetry(() => import("./components/products/ProductList/ProductList"));
const BrandList = lazyRetry(() => import("./components/catalog/BrandList/BrandList"));
const SaleImport = lazyRetry(() => import("./components/sales/SaleImport/SaleImport"));
const StoreProductList = lazyRetry(() => import("./components/products/StoreProductList/StoreProductList"));
const StoreList = lazyRetry(() => import("./components/admin/StoreList/StoreList"));
const ProductImport = lazyRetry(() => import("./components/products/ProductImport/ProductImport"));
const CashSummary = lazyRetry(() => import("./components/sales/CashSummary/CashSummary"));
const LogList = lazyRetry(() => import("./components/admin/LogList/LogList"));
const TenantPaymentList = lazyRetry(() => import("./components/finance/TenantPaymentList/TenantPaymentList"));
const CashFlowList = lazyRetry(() => import("./components/finance/CashFlowList/CashFlowList"));
const SellerList = lazyRetry(() => import("./components/catalog/SellerList/SellerList"));
const DepartmentList = lazyRetry(() => import("./components/catalog/DepartmentList/DepartmentList"));
const StoreProductImport = lazyRetry(() => import("./components/products/StoreProductImport/StoreProductImport"));
const ServiceList = lazyRetry(() => import("./components/admin/ServiceList/ServiceList"));
const ProductReassign = lazyRetry(() => import("./components/products/ProductReassign/ProductReassign"));
const TransactionAudit = lazyRetry(() => import("./components/admin/TransactionAudit/TransactionAudit"));
const ProductAudit = lazyRetry(() => import("./components/admin/ProductAudit/ProductAudit"));
const Dashboard = lazyRetry(() => import("./components/admin/Dashboard/Dashboard"));
const DistributionList = lazyRetry(() => import("./components/inventory/DistributionList/DistributionList"));
const RestartService = lazyRetry(() => import("./components/admin/RestartService/RestartService"));
const TenantProfile = lazyRetry(() => import("./components/admin/TenantProfile/TenantProfile"));

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
            <Route path="/movimientos-caja/" element={<Suspense fallback={<LoadingFallback />}><CashFlowList /></Suspense>} />
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
            <Route path="/auditoria-transacciones/" element={<Suspense fallback={<LoadingFallback />}><TransactionAudit /></Suspense>} />
            <Route path="/auditoria-productos/" element={<Suspense fallback={<LoadingFallback />}><ProductAudit /></Suspense>} />
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
