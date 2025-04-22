import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

// Получение модулей по языку
export const getModulesByLanguage = async (languageId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/languages/${languageId}/modules/`);
      return response.data;
    } catch (error) {
      throw new Error("Ошибка при загрузке модулей");
    }
};

// Получение одного модуля (если нужно)
export const getModuleDetails = async (moduleId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/modules/${moduleId}/`);
      return response.data;
    } catch (error) {
      throw new Error("Ошибка при загрузке модуля");
    }
};