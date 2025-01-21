export const getUserData = () => JSON.parse(localStorage.getItem("user"));

export const getHeaders = (isMultipart = false) => {
  const user = getUserData();
  return {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    "Authorization": `Token ${user.token}`,
    "store-id": user.store_id,
  };
};

export const getApiUrl = (endpoint) => {
  return `${process.env.REACT_APP_API_URL}/api/${endpoint}/`;
};