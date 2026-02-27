# API Layer Documentation

## Overview
This directory contains all API service modules for the POS Multi-Store application. Each module handles HTTP requests to specific backend endpoints.

## Architecture

### Core Files
- `utils.js` - Shared utilities (headers, URL builders, user data)
- `httpClient.js` - Centralized axios instance with interceptors

### Service Modules
Each service module exports functions that interact with specific API endpoints:

- `login.js` - Authentication
- `products.js` - Product management (CRUD, imports, stock)
- `sales.js` - Sales operations and dashboard
- `transfers.js` - Inventory transfers between stores
- `stores.js` - Store management
- `clients.js` - Customer management
- `sellers.js` - Seller/employee management
- `departments.js` - Department/category management
- `brands.js` - Brand management
- `discounts.js` - Discount management
- `cashflow.js` - Cash flow tracking
- `tenants.js` - Multi-tenant operations
- `audit.js` - Audit logs
- `printers.js` - Printer configuration
- `keepAlive.js` - Session management
- `restart.js` - System restart operations

## Usage

### Basic Example
```javascript
import { getProducts, createProduct } from '@/api/products';

// Fetch products with filters
const response = await getProducts({ search: 'laptop', page: 1 });

// Create new product
const newProduct = await createProduct({
  name: 'Product Name',
  price: 100,
  // ... other fields
});
```

### Error Handling
All API functions throw errors that should be caught:

```javascript
try {
  const response = await getProducts();
  // Handle success
} catch (error) {
  // Handle error
  console.error(error.message);
}
```

## Standards

### Function Naming
- `get{Resource}` - Fetch single or list
- `create{Resource}` - Create new resource
- `update{Resource}` - Update existing resource
- `delete{Resource}` - Delete resource
- `import{Resource}` - Bulk import operations

### Response Format
All functions return the axios response object:
```javascript
{
  data: {...},      // Response data from backend
  status: 200,      // HTTP status code
  statusText: 'OK', // Status message
  headers: {...},   // Response headers
  config: {...}     // Request configuration
}
```

### Authentication
Most endpoints require authentication. The `getHeaders()` utility automatically includes:
- Authorization token
- Store ID
- Content-Type

## Environment Variables
Required in `.env`:
```
REACT_APP_API_URL=http://your-api-url
REACT_APP_PRINTER_URL=http://your-printer-url
```

## Best Practices
1. Always use try-catch for error handling
2. Use query parameters for filtering/pagination
3. Use FormData for file uploads (set `isMultipart: true`)
4. Log errors appropriately (use logger utility)
5. Don't store sensitive data in localStorage without encryption
