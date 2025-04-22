import axios from "axios";
import { API_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Настройка interceptor для добавления токена в каждый запрос
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    // Добавляем токен в заголовок только для текущего axiosInstance
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.log('Токен не найден');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
