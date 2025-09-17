import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:20000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
    }
})

// request interceptor
axiosInstance.interceptors.request.use((config)=>{
    const accesstoken=localStorage.getItem("token");
    if (accesstoken) {
        config.headers.Authorization=`Bearer ${accesstoken}`;
    }return config;
},(error)=>{
    return Promise.reject(error)
});

// response interceptor
axiosInstance.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if (error.response) {
        if (error.response.status===401) {
            window.location.href="/login";
        }else if (error.response.status===500) {
            console.error("Server error. Please try again later.");
            

        }

    }else if (error.code==="ECONNABORTED") {
        console.error("Request timeout. Please try again.");
        
    }
    return Promise.reject(error)
})

export default axiosInstance;