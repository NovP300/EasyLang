import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

// Получение уроков по модулю
export const getLessonsByModule = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/modules/${moduleId}/lessons/`);
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при загрузке уроков");
  }
};

// Получение урока по ID
export const getLessonDetails = async (lessonId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/lessons/${lessonId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при загрузке урока");
  }
};

export const getLessonBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/lessons/${slug}/`);
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при загрузке урока по slug");
  }
};


export const getTestLessonsByLanguage = async (languageId) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/lessons/test/${languageId}/`);
    return res.data;
  } catch (err) {
    console.error("Ошибка загрузки тестовых уроков", err);
    return [];
  }
};