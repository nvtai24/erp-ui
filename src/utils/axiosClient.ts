import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7012/api",  // Update with your API base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosClient;
