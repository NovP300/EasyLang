import axiosInstance from "./axiosInstance";
import { API_URL } from "../config";
import { refreshToken } from "./auth";
import { unlockLessonsUpToModule } from "./modules";

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


export const applyTestResults = async () => {
  const savedData = localStorage.getItem('pendingTestResults');
  if (!savedData) return { applied: false };

  try {
    const { languageId, testLevel } = JSON.parse(savedData);
    
    // Вызываем оригинальную функцию без обработки response
    await unlockLessonsUpToModule(languageId, testLevel);
    
    return { applied: true, languageId };
  } catch (error) {
    console.error("Не удалось применить тестовые результаты:", error);
    return { applied: false, error: error.message };
  }
};