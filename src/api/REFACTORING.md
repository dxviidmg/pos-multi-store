# API Refactoring Guide

## Changes Applied

### 1. Centralized HTTP Client (`httpClient.js`)
- Single axios instance with interceptors
- Automatic logging of requests/responses
- Global error handling (401 redirects to login)
- Consistent timeout configuration

### 2. Enhanced Utils (`utils.js`)
- JSDoc documentation for all functions
- `buildUrlWithParams()` helper to avoid repetition
- Null/undefined parameter filtering
- Better error messages

### 3. Consistent Error Handling
**Before:**
```javascript
try {
  const response = await axios.get(url);
  return response;
} catch (error) {
  return error; // ❌ Returns error as success
}
```

**After:**
```javascript
const response = await httpClient.get(url, {
  headers: getHeaders(),
});
return response; // ✅ Throws error, handled by interceptor
```

### 4. JSDoc Documentation
All functions now have:
- Description
- Parameter types and descriptions
- Return type
- Usage examples in README

### 5. Code Consistency
- Use `httpClient` instead of `axios`
- Use `buildUrlWithParams()` for query strings
- Remove try-catch (handled by interceptor)
- Template literals for URLs: `sale/${id}` not `"sale/" + id`

## Migration Pattern

### Old Pattern
```javascript
import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

export const getItems = async (params) => {
  const apiUrl = new URL(getApiUrl("items"));
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      apiUrl.searchParams.append(key, value);
    });
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};
```

### New Pattern
```javascript
import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Get items list with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Items list response
 */
export const getItems = async (params) => {
  const url = buildUrlWithParams(getApiUrl("items"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};
```

## Files to Migrate

All files migrated! ✅

1. ✅ `login.js` - Done
2. ✅ `sales.js` - Done
3. ✅ `products.js` - Done
4. ✅ `transfers.js` - Done
5. ✅ `stores.js` - Done
6. ✅ `clients.js` - Done
7. ✅ `departments.js` - Done
8. ✅ `cashflow.js` - Done
9. ✅ `tenants.js` - Done
10. ✅ `sellers.js` - Done
11. ✅ `brands.js` - Done
12. ✅ `discounts.js` - Done
13. ✅ `audit.js` - Done
14. ✅ `printers.js` - Done
15. ✅ `keepAlive.js` - Done
16. ✅ `restart.js` - Done

## Testing After Migration
1. Clear browser cache
2. Test each endpoint
3. Verify error handling (try with invalid token)
4. Check console for proper logging
5. Ensure 401 redirects to login

## Benefits
- ✅ Consistent error handling across all APIs
- ✅ Better debugging with centralized logging
- ✅ Less code duplication
- ✅ Automatic 401 handling
- ✅ Better IDE autocomplete with JSDoc
- ✅ Easier to maintain and test
