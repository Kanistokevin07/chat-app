import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

api.interceptors.response.use(response => response, async error => {
    if(error.response?.status === 401){
        // later refresh token logic
        console.log("Unauthorized");
    }

    return Promise.reject(error);
});

api.interceptors.request.use(
    (config)=>{
        const token = useAuthStore.getState().accessToken;

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

export default api;