import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { getUserData } from "./api/utils";
import LoadingFallback from "./components/ui/LoadingFallback";

// Componentes críticos (carga inmediata)
import Login from "./components/layout/Login/Login";
import MainLayout from "./components/layout/MainLayout/MainLayout";

const lazyRetry = (importFn) =>
  lazy(() => importFn().catch(() => { window.location.reload(); return new Promise(() => {}); }));

// Wrapper para Suspense
const Lazy = ({ children }) => <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;

// Lazy loading para rutas
const SaleCreate = lazyRetry(() => import("./components/sales/SaleCreate/SaleCreate"));
const SaleList = lazyRetry(() => import("./components/sales/SaleList/SaleList"));
const TransferList = lazyRetry(() => import("./components/inventory/TransferList/TransferList"));
const StockUpdateRequestList = lazyRetry(() => import("./components/inventory/StockUpdateRequestList/StockUpdateRequestList"));
const ClientList = lazyRetry(() => import("./components/clients/ClientList/ClientList"));
const ProductList = lazyRetry(() => import("./components/products/ProductList/ProductList"));
const BrandList = lazyRetry(() => import("./components/catalog/BrandList/BrandList"));
const SaleImport = lazyRetry(() => import("./components/sales/SaleImport/SaleImport"));
const StoreProductList = lazyRetry(() => import("./components/products/StoreProductList/StoreProductList"));
const ProductAuditList = lazyRetry(() => import("./components/products/StoreProductAuditList/StoreProductAuditList"));
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
const CancellationsDashboard = lazyRetry(() => import("./components/admin/Dashboard/CancellationsDashboard"));
const ProductsDashboard = lazyRetry(() => import("./components/admin/Dashboard/ProductsDashboard"));
const DistributionList = lazyRetry(() => import("./components/inventory/DistributionList/DistributionList"));
const RestartService = lazyRetry(() => import("./components/admin/RestartService/RestartService"));
const Profile = lazyRetry(() => import("./components/admin/Profile/Profile"));

function App({ toggleTheme, themeMode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = getUserData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Route element={<MainLayout toggleTheme={toggleTheme} themeMode={themeMode} onLoginSuccess={handleLogin} />}>
            <Route path="/tiendas/" element={<Lazy><StoreList /></Lazy>} />
            <Route path="/ventas/" element={<Lazy><SaleList /></Lazy>} />
            <Route path="/vender/" element={<Lazy><SaleCreate /></Lazy>} />
            <Route path="/importar-ventas/" element={<Lazy><SaleImport /></Lazy>} />
            <Route path="/corte-caja/" element={<Lazy><CashSummary /></Lazy>} />
            <Route path="/movimientos-caja/" element={<Lazy><CashFlowList /></Lazy>} />
            <Route path="/distribuciones/" element={<Lazy><DistributionList /></Lazy>} />
            <Route path="/traspasos/" element={<Lazy><TransferList /></Lazy>} />
            <Route path="/solicitudes-ajustes-stock/" element={<Lazy><StockUpdateRequestList /></Lazy>} />
            <Route path="/clientes/" element={<Lazy><ClientList /></Lazy>} />
            <Route path="/productos/" element={<Lazy><ProductList /></Lazy>} />
            <Route path="/inventario/" element={<Lazy><StoreProductList /></Lazy>} />
            <Route path="/auditoria-inventario/" element={<Lazy><ProductAuditList /></Lazy>} />
            <Route path="/marcas/" element={<Lazy><BrandList /></Lazy>} />
            <Route path="/departamentos/" element={<Lazy><DepartmentList /></Lazy>} />
            <Route path="/historial-stock/" element={<Lazy><LogList /></Lazy>} />
            <Route path="/pagos/" element={<Lazy><TenantPaymentList /></Lazy>} />
            <Route path="/vendedores/" element={<Lazy><SellerList /></Lazy>} />
            <Route path="/servicios/" element={<Lazy><ServiceList /></Lazy>} />
            <Route path="/tablero-ventas/" element={<Lazy><Dashboard /></Lazy>} />
            <Route path="/tablero-ventas-ajustadas-cancelaciones/" element={<Lazy><CancellationsDashboard /></Lazy>} />
            <Route path="/tablero-productos/" element={<Lazy><ProductsDashboard /></Lazy>} />
            <Route path="/reasignacion/" element={<Lazy><ProductReassign /></Lazy>} />
            <Route path="/importar-productos/" element={<Lazy><ProductImport /></Lazy>} />
            <Route path="/importar-inventario/" element={<Lazy><StoreProductImport /></Lazy>} />
            <Route path="/auditoria-transacciones/" element={<Lazy><TransactionAudit /></Lazy>} />
            <Route path="/auditoria-productos/" element={<Lazy><ProductAudit /></Lazy>} />
            <Route path="/sincronizar/" element={<Lazy><RestartService /></Lazy>} />
            <Route path="/perfil/" element={<Lazy><Profile /></Lazy>} />
            {user?.store_id ? (
              <Route path="*" element={<Lazy><SaleCreate /></Lazy>} />
            ) : (
              <Route path="*" element={<Lazy><StoreList /></Lazy>} />
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
