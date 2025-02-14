const apiConnecter = {
  get: async (endpoint, token = "") => {
    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.log("GET request failed", error);
      return error;
    }
  },

  post: async (endpoint, data, token = "", isFormData = false) => {
    try {
      const options = {
        method: "POST",
        headers: isFormData
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        body: isFormData ? data : JSON.stringify(data),
        credentials: "include",
      };

      const response = await fetch(`${endpoint}`, options);

      return await response.json();
    } catch (error) {
      console.log("POST request failed", error);
      return error;
    }
  },
  put: async (endpoint, data, token = "") => {
    try {
      const response = await fetch(`${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.log("PUT request failed", error);
      return error;
    }
  },

  delete: async (endpoint, token = "") => {
    try {
      const response = await fetch(`${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.log("DELETE request failed", error);
      return error;
    }
  },
};

export default apiConnecter;
