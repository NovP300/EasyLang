import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../config";

export default function useProgress() {
  const [UseProgress, setProgress] = useState({
    completed_lesson_ids: [],
    modules: [],
    has_subscription: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/progress/detailed/`);
        const { completed_lesson_ids, modules, subscription } = response.data;
        setProgress({
          completed_lesson_ids,
          modules,
          has_subscription: subscription ?? false
        });
      } catch (error) {
        console.error("Ошибка при загрузке прогресса:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return { UseProgress, loading };
}
