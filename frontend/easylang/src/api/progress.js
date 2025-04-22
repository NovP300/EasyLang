import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";
import { refreshToken } from "./auth";

export const markLessonCompleted = async (lessonId) => {
  await refreshToken(); // На всякий случай обновим токен

  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Пользователь не авторизован");
  }

  return await axiosInstance.post(
    `${API_URL}/progress/`,
    { lesson: lessonId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
