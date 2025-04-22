import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";

export const getExercisesByLesson = async (lessonSlug, limit = 6) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/lessons/${lessonSlug}/exercises/?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при загрузке упражнений");
  }
};