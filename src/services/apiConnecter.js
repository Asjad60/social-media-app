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
      const result = await response.json();

      if (response.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        throw new Error(
          result.message || `Request failed with status ${response.status}`
        );
      }

      return result;
    } catch (error) {
      // // Handle Rate Limiting
      console.log("error from apiConnector", error);
      // toast.error(error.message || "Something went wrong!");
      // return { error: true, message: error.message };
    }
  },

  get: async (endpoint, token = "") =>
    apiConnecter.request("GET", endpoint, null, token),

  post: async (endpoint, data, token = "", isFormData = false) =>
    apiConnecter.request("POST", endpoint, data, token, isFormData),

  put: async (endpoint, data, token = "") =>
    apiConnecter.request("PUT", endpoint, data, token),

  delete: async (endpoint, token = "") =>
    apiConnecter.request("DELETE", endpoint, null, token),
};

export default apiConnecter;
