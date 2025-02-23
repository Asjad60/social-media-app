const apiConnecter = {
  request: async (
    method,
    endpoint,
    data = null,
    token = "",
    isFormData = false
  ) => {
    try {
      const headers = isFormData
        ? { Authorization: `Bearer ${token}` }
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

      const options = {
        method,
        headers,
        credentials: "include",
      };

      if (data) {
        options.body = isFormData ? data : JSON.stringify(data);
      }

      const response = await fetch(endpoint, options);

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        throw new Error(
          "Too many requests. Please try after " + retryAfter + " seconds"
        );
      }

      if (response.status === 204) {
        return null;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Request failed with status ${response.status}`
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  get: async (endpoint, token = "") =>
    apiConnecter.request("GET", endpoint, null, token),

  post: async (endpoint, data, token = "", isFormData = false) =>
    apiConnecter.request("POST", endpoint, data, token, isFormData),

  put: async (endpoint, data, token = "") =>
    apiConnecter.request("PUT", endpoint, data, token),

  delete: async (endpoint, data, token = "") =>
    apiConnecter.request("DELETE", endpoint, data, token),
};

export default apiConnecter;
