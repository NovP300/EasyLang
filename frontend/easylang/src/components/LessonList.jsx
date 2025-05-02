import { useEffect, useState } from "react";
import { getLessonsByModule } from "../api/lessons";
import { Link } from "react-router-dom";
import styles from "./Style (css)/ModuleItem.module.css";
import { FaCheckCircle } from "react-icons/fa";

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
    <ul className={styles.lessonList}>
      {lessons.map((lesson) => {
        const isCompleted = completedLessonIds.includes(lesson.id);

        return (
          <li key={lesson.id} className={styles.lessonItem}>
            <div
              className={`${styles.statusIcon} ${
                isCompleted ? styles.completed : styles.incomplete
              }`}
            >
              <FaCheckCircle size={23} />
            </div>
            <Link
              to={`/lessons/${lesson.slug}`}
              className={`${styles.lessonLink} ${
                isCompleted ? styles.completed : styles.incomplete
              }`}
            >
              {lesson.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}