import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json", // Accept JSON responses
    "Content-Type": "application/json", // Send JSON data by default
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    setTimeout(() => {
      if (error.response.status === 401 && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }, 1000);
  }
);

export { instance as axios };
