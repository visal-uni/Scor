import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    timeout: 5000
});

export default apiClient;