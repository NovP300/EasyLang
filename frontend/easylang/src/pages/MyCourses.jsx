import styles from "./Style (css)/MyCourses.module.css";
import { Link, useNavigate  } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getProfile } from "../api/profile";
import { getProgressOverview, getDetailedProgress } from "../api/progress";
import { getEnrollments } from "../api/enrollment";


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

  const navigate = useNavigate();
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
        const [overview, detailed, enrollments] = await Promise.all([
          getProgressOverview(),
          getDetailedProgress(),
          getEnrollments()
        ]);
        
        console.log("Данные overview:", JSON.stringify(overview, null, 2));
        console.log("Данные detailed:", JSON.stringify(detailed, null, 2));

        setProgressData({
          overview,
          detailed,
          enrollments,
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
    if (!progressData) return { total: 0, completed: 0, started: 0, coursesData: [] };
  
    const enrolledLanguageIds = progressData.enrollments.map(e => e.language);
  
    const coursesData = Object.values(LANGUAGE_MAPPING)
      .filter(lang => enrolledLanguageIds.includes(lang.id))
      .map(lang => {
        const modules = progressData.detailed.modules.filter(m => m.language_id === lang.id);
        const totalModules = modules.length;
        const completedModules = modules.filter(m => m.is_completed).length;
  
        return {
          id: lang.id,
          title: lang.name,
          totalModules,
          completedModules,
        };
      });
  
    return {
      total: coursesData.length,
      completed: coursesData.filter(c => c.completedModules === c.totalModules && c.totalModules > 0).length,
      started: coursesData.filter(c => c.completedModules < c.totalModules && c.totalModules > 0).length,
      coursesData
    };
  };

  const { total, completed, started, coursesData } = calculateCourseStats();

  if (loading) {
    return <div className={styles.loader}>Загрузка данных...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const handleGoToCatalog = () => {
    navigate("/", { state: { scrollToLanguages: true } });
  };

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

        {coursesData.length === 0 ? (
          <div className={styles.emptyMessage}>
            <p>Вы еще не записаны ни на один курс.</p>
            <button onClick={handleGoToCatalog} className={styles.linkBtn}>
              Записаться на первый курс
            </button>
          </div>
        ) : (

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
        )}
      </section>
    </div>
  );
}