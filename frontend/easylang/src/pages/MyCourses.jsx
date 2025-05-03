import styles from "./Style (css)/MyCourses.module.css";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getProfile } from "../api/profile";
import { getProgressOverview, getDetailedProgress } from "../api/progress";

const LANGUAGE_MAPPING = {
  english: { id: 1, name: "Английский" },
  german: { id: 2, name: "Немецкий" },
  french: { id: 3, name: "Французский" },
  spanish: { id: 4, name: "Испанский" }
};

function getCourseWord(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'курсов';
  if (lastDigit === 1) return 'курс';
  if (lastDigit >= 2 && lastDigit <= 4) return 'курса';
  return 'курсов';
}

export default function MyCourses() {
  const [profile, setProfile] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Убрали статический courses, будем использовать динамические данные

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      console.log("Начало загрузки данных прогресса...");
      try {
        const [overview, detailed] = await Promise.all([
          getProgressOverview(),
          getDetailedProgress()
        ]);
        
        console.log("Данные overview:", JSON.stringify(overview, null, 2));
        console.log("Данные detailed:", JSON.stringify(detailed, null, 2));

        setProgressData({
          overview,
          detailed,
          languages: Object.values(LANGUAGE_MAPPING)
        });
      } catch (error) {
        console.error("Полная ошибка:", error);
        console.error("Ответ сервера:", error.response?.data);
        setError("Не удалось загрузить данные прогресса");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const calculateCourseStats = () => {
    // 1. Проверяем, что данные прогресса загружены
    if (!progressData) return { total: 0, completed: 0, started: 0, coursesData: [] };
  
    // 2. Проходим по всем языкам из LANGUAGE_MAPPING
    const coursesData = Object.values(LANGUAGE_MAPPING).map(lang => {
      // 3. Фильтруем модули текущего языка (по language_id)
      const modules = progressData.detailed.modules.filter(m => m.language_id === lang.id);
      
      // 4. Считаем общее количество модулей для языка
      const totalModules = modules.length;
      
      // 5. Считаем количество завершенных модулей
      const completedModules = modules.filter(m => m.is_completed).length;
      
      // 6. Проверяем, начат ли курс (хотя бы 1 урок пройден)
      const hasStarted = modules.some(m => m.completed_lessons > 0);
  
      // 7. Возвращаем статистику для текущего языка
      return {
        id: lang.id,
        title: lang.name,
        totalModules,
        completedModules,
        hasStarted,
      };
    });
  
    // 8. Фильтруем только активные курсы (начатые или завершенные)
    const activeCourses = coursesData.filter(c => c.hasStarted || c.completedModules > 0);
    
    // 9. Считаем общую статистику:
    return {
      total: activeCourses.length, // Всего активных курсов
      completed: activeCourses.filter(c => c.completedModules === c.totalModules).length, // Завершенные
      started: activeCourses.filter(c => c.completedModules < c.totalModules).length, // Начатые
      coursesData: activeCourses, // Данные для отображения
    };
  };

  const { total, completed, started, coursesData } = calculateCourseStats();

  if (loading) {
    return <div className={styles.loader}>Загрузка данных...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      {/* Секция профиля */}
      <section className={styles.profileSection}>
        <h2 className={styles.profileName}>{profile?.username || 'Пользователь'}</h2>
        <p className={styles.profileStats}>
          Количество пройденных курсов: {completed}
        </p>
        <p className={styles.profileStats}>
          Количество начатых курсов: {started}
        </p>
      </section>

      {/* Секция курсов */}
      <section className={styles.courseSection}>
        <h3 className={styles.courseHeader}>
          Всего {total} {getCourseWord(total)}
        </h3>

        <div className={styles.courseList}>
          {coursesData.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.iconBox}>
                <FaCheckCircle 
                  size={30} 
                  color={course.completedModules === course.totalModules ? "#4CAF50" : "#cccccc"} 
                />
              </div>

              <div className={styles.courseInfo}>
                <h4 className={styles.courseTitle}>{course.title}</h4>
                <p className={styles.progressText}>
                  {course.totalModules > 0 
                    ? `Пройдено ${course.completedModules} модулей из ${course.totalModules}`
                    : 'Нет доступных модулей'}
                </p>
              </div>

              <div className={styles.linkBox}>
                <Link 
                  to={`/languages/${Object.keys(LANGUAGE_MAPPING).find(
                    key => LANGUAGE_MAPPING[key].id === course.id
                  ) || 'english'}`} 
                  className={styles.linkBtn}
                >
                  Перейти к материалам курса
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}