/**
 * Centralized API exports
 * All API services are created using the apiFactory pattern
 */

// CRUD Services
export * from '@/src/api/clients';
export * from '@/src/features/catalog/api/brands';
export * from '@/src/features/catalog/api/departments';
export * from '@/src/features/catalog/api/sellers';
export * from '@/src/api/discounts';
export * from '@/src/api/stores';
export * from '@/src/api/tenants';
export * from '@/src/api/cashflow';

// Complex Services (not using factory)
export * from '@/src/api/products';
export * from '@/src/api/sales';
export * from '@/src/api/transfers';
export * from '@/src/api/audit';
export * from '@/src/api/printers';
export * from '@/src/api/login';
export * from '@/src/api/restart';
export * from '@/src/api/registration';
export * from '@/src/api/conversions';

// Utilities
export * from '@/src/shared/api/utils';
export { default as httpClient } from '@/src/shared/api/httpClient';
