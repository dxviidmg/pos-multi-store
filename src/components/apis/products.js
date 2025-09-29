import axios from "axios";
import { getApiUrl, getHeaders } from "./utils";

const timedRequest = async (axiosCall, meta = {}) => {
  const localString = localStorage.getItem("monitoring");
  let local = localString ? JSON.parse(localString) : {};
  const start = performance.now();
  try {
    const response = await axiosCall();
    const end = performance.now();

    const duration = Math.round((end - start) / 1000);

    local[duration] = (local[duration] || 0) + 1;

    localStorage.setItem("monitoring", JSON.stringify(local));
    console.log(`[OK] ${meta.name || "request"}: ${duration} ms`);
    return response;
  } catch (error) {
    const end = performance.now();
    const duration = Math.round((end - start) / 1000);

    local[duration] = (local[duration] || 0) + 1;

    localStorage.setItem("monitoring", JSON.stringify(local));
    console.log(`[FAIL] ${meta.name || "request"}: ${duration} s`);
    throw error;
  }
};

// --- Ejemplo aplicado ---
export const getStoreProducts = async (params, config = {}) => {
  const apiUrl = new URL(getApiUrl("store-product"));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      apiUrl.searchParams.append(key, value);
    });
  }

  return timedRequest(
    () =>
      axios.get(apiUrl, {
        headers: getHeaders(),
        ...config,
      }),
    { name: "getStoreProducts" }
  );
};

export const getProducts = async (params) => {
  const apiUrl = new URL(getApiUrl("product"));
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
    return error;
  }
};

export const createProduct = async (data) => {
  const apiUrl = new URL(getApiUrl("product"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (data) => {
  if (typeof data.image === "string") {
    delete data.image;
  }
  const apiUrl = new URL(getApiUrl("product/" + data.id));

  try {
    const response = await axios.patch(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const addProducts = async (data) => {
  const apiUrl = new URL(getApiUrl("products/add"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getStoreProductLogs = async (params) => {
  const apiUrl = new URL(getApiUrl("store-product-logs"));

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
    return error;
  }
};

export const getStoreProductLogsChoices = async () => {
  const apiUrl = new URL(getApiUrl("store-product-logs/choices"));

  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateStoreProduct = async (data) => {
  const apiUrl = new URL(getApiUrl("store-product/" + data.id));

  try {
    const response = await axios.patch(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const importProductsValidation = async (data) => {
  const apiUrl = getApiUrl("products/import-validation");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const importProducts = async (data) => {
  const apiUrl = getApiUrl("products/import");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteProducts = async (data) => {
  const apiUrl = new URL(getApiUrl("products/delete"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const upperCodeProducts = async (data) => {
  const apiUrl = new URL(getApiUrl("products/upper-code"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const importStoreProductsValidation = async (data) => {
  const apiUrl = getApiUrl("store-products/import-validation");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const importStoreProducts = async (data) => {
  const apiUrl = getApiUrl("store-products/import");
  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getImportCanIncludeQuantity = async () => {
  const apiUrl = getApiUrl("store-products/import/can-include-quantity");
  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(true),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const reassignProducts = async (data) => {
  const apiUrl = new URL(getApiUrl("products/reassign"));

  try {
    const response = await axios.post(apiUrl, data, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getStoreProductsAsync = async () => {
  const apiUrl = new URL(getApiUrl("async-store-product"));

  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getTaskResult = async (id) => {
  const apiUrl = new URL(getApiUrl("task-result/" + id));

  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getStockOtherStores = async (code) => {
  const apiUrl = new URL(
    getApiUrl("products/stock-other-stores/?code=" + code, false)
  );

  try {
    const response = await axios.get(apiUrl, {
      headers: getHeaders(),
    });
    return response;
  } catch (error) {
    return error;
  }
};
