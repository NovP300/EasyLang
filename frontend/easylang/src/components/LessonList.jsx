import { useEffect, useState } from "react";
import { getLessonsByModule } from "../api/lessons";
import { Link } from "react-router-dom";
import styles from "./Style (css)/ModuleItem.module.css";

export default function LessonList({ moduleId, completedLessonIds }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsByModule(moduleId);
        setLessons(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchLessons();
  }, [moduleId]);

  return (
    <ul className="mt-2 ml-4 list-disc">
      {lessons.map((lesson) => {
        const isCompleted = completedLessonIds.includes(lesson.id);

        return (
          <li key={lesson.id}>
            <Link
              to={`/lessons/${lesson.slug}`}
              className={`hover:underline ${
                isCompleted
                  ? styles.completedLesson // Если урок завершен
                  : styles.incompleteLesson // Если урок не завершен
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
