// Feature: clients — API pública

// Componentes
export { default as ClientList } from './components/ClientList/ClientList';
export { default as ClientModal } from './components/ClientModal/ClientModal';
export { default as ClientSelected } from './components/ClientSelected/ClientSelected';
export { default as SearchClient } from './components/SearchClient/SearchClient';
export { default as DiscountModal } from './components/DiscountModal/DiscountModal';

// Hooks
export { useClients } from './hooks/useClients';
export { useDiscounts } from './hooks/useDiscounts';
export { useCreateClient, useUpdateClient } from './hooks/useClientMutations';

// API
export * from './api/clients';
export * from './api/discounts';
