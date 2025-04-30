import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

// Получить все отзывы
export const getAllReviews = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/reviews/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при загрузке отзывов");
  }
};

// Получить отзыв по ID
export const getReviewById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/reviews/${id}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при загрузке отзыва");
  }
};

// Создать новый отзыв
export const createReview = async (languageId, responseText, estimation) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/reviews/`, {
      language: languageId,
      response: responseText,
      estimation: estimation,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при отправке отзыва");
  }
};

// Обновить отзыв
export const updateReview = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/reviews/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при обновлении отзыва");
  }
};


export const getReviewByUserAndLanguage = async (languageId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/reviews/my/${languageId}/`, {
      params: { language: languageId },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    console.error(error);
    throw new Error("Ошибка при загрузке отзыва пользователя");
  }
};

