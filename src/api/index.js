/**
 * Centralized API exports
 * All API services are created using the apiFactory pattern
 */

// CRUD Services
export * from './clients';
export * from './brands';
export * from './departments';
export * from './sellers';
export * from './discounts';
export * from './stores';
export * from './tenants';
export * from './cashflow';

// Complex Services (not using factory)
export * from './products';
export * from './sales';
export * from './transfers';
export * from './audit';
export * from './printers';
export * from './login';
export * from './restart';

// Utilities
export * from './utils';
export { default as httpClient } from './httpClient';
