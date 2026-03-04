import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    timeout: 5000
});

apiClient.interceptors.response.use(
    (response) => (response),
    (error) => {
        if(error.response?.status === 401){
            console.error("Session expired. Please login in again");
        }
        return Promise.reject(error)
    }
)

export default apiClient;