import axiosInstance from "./axiosInstance";
import axios from "axios";
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

// Функция получения новых токенов (логин)
export const obtainNewTokens = async (email, password) => {
  try {
    // Важно: используем чистый axios без интерцепторов для этого запроса
    const response = await axiosInstance.post(`${API_URL}/token/`, {
      email,
      password
    });

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  } catch (error) {
    await logout();
    throw new Error(error.response?.data?.detail || 'Ошибка входа');
  }
};

// Функция обновления токена
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    await logout();
    throw new Error('Сессия истекла');
  }

  try {
    
    const response = await axiosInstance.post(`${API_URL}/token/refresh/`, { refresh });
    const newAccessToken = response.data.access;
    localStorage.setItem('access_token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    await logout();
    throw new Error('Ошибка обновления сессии');
  }
};

// Функция для регистрации
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


export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/change-password/`, {
      old_password: passwordData.old_password,    // ← underscore
      new_password: passwordData.new_password,    // ← underscore
      repeat_password: passwordData.repeat_password // ← underscore
    });
    return response.data;
  } catch (error) {
    // Преобразуем ошибки Django REST в более удобный формат
    if (error.response?.data) {
      throw new Error(
        Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      );
    }
    throw new Error('Ошибка при смене пароля');
  }
};


