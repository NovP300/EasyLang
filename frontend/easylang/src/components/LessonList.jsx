import { useEffect, useState } from "react";
import { getLessonsByModule } from "../api/lessons";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../config";

export default function LessonList({ moduleId }) {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsByModule(moduleId);
        setLessons(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchProgress = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axiosInstance.get(`${API_URL}/progress/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const lessonIds = response.data.map((item) => item.lesson.id);
        setCompletedLessons(lessonIds);
      } catch (error) {
        console.error("Ошибка при загрузке прогресса:", error.message);
      }
    };

    fetchLessons();
    fetchProgress();
  }, [moduleId]);



  return (
    <ul className="mt-2 ml-4 list-disc">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);

        return (
          <li key={lesson.id}>
            <Link
              to={`/lessons/${lesson.slug}`}
              className={`hover:underline ${
                isCompleted
                  ? "text-green-600 visited:text-green-600 font-semibold"
                  : "text-blue-700 visited:text-blue-700"
              }`}
            >
              Урок: {lesson.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
