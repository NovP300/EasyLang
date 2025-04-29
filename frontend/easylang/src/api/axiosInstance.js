import axios from "axios";
import { API_URL } from "../config";
import { refreshToken, logout } from "./auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Добавляем access_token в заголовки всех запросов
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("Токен не найден");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватываем ответы, чтобы обновлять access_token при 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Повторяем исходный запрос
      } else {
        logout(); // refresh тоже истёк или недействителен
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
