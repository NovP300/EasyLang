import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

// Функция для логина
export const login = async (email, password) => {
  const response = await axiosInstance.post(`${API_URL}/login/`, { email, password });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response.data;
};

// Функция для выхода
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Функция для обновления access-токена
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  try {
    const response = await axiosInstance.post(`${API_URL}/token/refresh/`, {
      refresh: refresh_token,
    });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Ошибка обновления токена", error);
    logout();
  }
};

export const register = async (email, username, password) => {
  const response = await axiosInstance.post(`${API_URL}/register/`, {
    email,
    username,
    password,
  });

  // Сохраняем токены в localStorage
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data.user;  // Если хочешь сразу получить данные пользователя
};