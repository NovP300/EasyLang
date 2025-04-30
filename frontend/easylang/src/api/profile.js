import axiosInstance from "./axiosInstance";
import { refreshToken } from "./auth";
import { API_URL } from "../config";

// Функция для получения профиля пользователя
export const getProfile = async () => {
  let token = localStorage.getItem("access_token"); // Используем access_token
  if (!token) return null;

  try {
    const response = await axiosInstance.get(`${API_URL}/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    // Если токен истёк, пробуем обновить и повторить запрос
    if (error.response && error.response.status === 401) {
      token = await refreshToken();
      if (token) {
        return await getProfile(); // Рекурсивно пытаемся снова
      }
    }
    console.error("Ошибка получения профиля:", error);
    return null;
  }
};


export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/users/${userId}/`); // Используем новый эндпоинт
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    return null;
  }
};

// Функция для выхода пользователя
export function logout() {
  localStorage.removeItem("access_token");  // Используем access_token
  localStorage.removeItem("refresh_token");
}
