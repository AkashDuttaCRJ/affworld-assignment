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

export { instance as axios };
