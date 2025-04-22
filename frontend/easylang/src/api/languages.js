import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

// Получение модулей по языку
export const getLanguage = async (languageId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/languages/${languageId}/`);
      return response.data;
    } catch (error) {
      throw new Error("Ошибка при загрузке языка");
    }
};

// Получение всех языков
export const getLanguages = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/languages/`);
      return response.data;
    } catch (error) {
      throw new Error("Ошибка при загрузке языков");
    }
};