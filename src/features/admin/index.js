// Feature: admin — API pública (componentes)

export { default as StoreList } from './components/StoreList/StoreList';
export { default as CreateStoreModal } from './components/StoreList/CreateStoreModal';
export { default as Dashboard } from './components/Dashboard/Dashboard';
export { default as CancellationsDashboard } from './components/Dashboard/CancellationsDashboard';
export { default as StockVerificationDashboard } from './components/Dashboard/StockVerificationDashboard';
export { default as PendingTransfersDashboard } from './components/Dashboard/PendingTransfersDashboard';
export { default as ProductsDashboard } from './components/Dashboard/ProductsDashboard';
export { default as LogList } from './components/LogList/LogList';
export { default as ServiceList } from './components/ServiceList/ServiceList';
export { default as ProductAudit } from './components/ProductAudit/ProductAudit';
export { default as TransactionAudit } from './components/TransactionAudit/TransactionAudit';
export { default as RestartService } from './components/RestartService/RestartService';
export { default as Profile } from './components/Profile/Profile';

// Hooks
export { useStores } from './hooks/useStores';
export { useInvestment } from './hooks/useInvestment';
export { useCanCreateStore } from './hooks/useCanCreateStore';

// API
export * from './api/stores';
export * from './api/audit';
export * from './api/restart';
export * from './api/notifications';

