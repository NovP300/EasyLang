import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

// Получить все курсы, на которые записан пользователь
export const getEnrollments = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/enrollments/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке записей на курсы:", error);
    throw new Error("Не удалось загрузить записи на курсы");
  }
};

// Записаться на курс (languageId — ID курса)
export const enrollToCourse = async (languageId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/enrollments/`, {
      language: languageId,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при записи на курс:", error);
    //throw new Error("Не удалось записаться на курс");
    throw error;
  }
};
