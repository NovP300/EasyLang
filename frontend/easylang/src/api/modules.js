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


export const unlockLessonsUpToModule = async (languageId, moduleOrder) => {
  try {
    await axiosInstance.post(
      `${API_URL}/progress/unlock-up-to/${languageId}/${moduleOrder}/`
    );
  } catch (error) {
    console.error("Ошибка при разблокировке модулей", error);
    throw error;
  }
};