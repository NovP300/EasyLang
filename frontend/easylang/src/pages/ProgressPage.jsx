import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../config";
import ModuleItem from "../components/ModuleItem";
import { useLocation } from "react-router-dom";
import { getModulesByLanguage } from "../api/modules";
import { Link } from "react-router-dom";
import styles from "./Style (css)/ProgressPage.module.css";
import img from "./pictures/girl.png";
import { FaCheck, FaClone, FaBookOpen } from "react-icons/fa";
import { SlFlag } from "react-icons/sl";
import useProgress from "../api/useProgress"; 

const languageMapping = {
  english: 1,
  german: 2,
  french: 3,
  spanish: 4,
};

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [modules, setModules] = useState([]);
  const location = useLocation();
  const languageId = new URLSearchParams(location.search).get('languageId') || location.state?.languageId || 'defaultLanguageId';
  const languageName = Object.keys(languageMapping).find(key => languageMapping[key] === Number(languageId));


    // Состояния для модулей, описания языка, прогресса и загрузки
  const { UseProgress, loading } = useProgress(); // Получаем прогресс

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/progress/overview/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setProgress(res.data);
      } catch (error) {
        console.error("Ошибка при загрузке прогресса", error);
      }
    };
    const fetchModules = async () => {
      try {
        const data = await getModulesByLanguage(languageId);
        setModules(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchModules();
    fetchProgress();
  }, []);

  const filteredModules = modules.filter(mod => mod.title !== 'Test');
  const filteredProgressModules = UseProgress.modules.filter(mod => mod.title !== 'Test');

  if (!progress) return <p>Загрузка...</p>;
  if (loading) return <div>Загрузка прогресса...</div>;
  console.log(`languageId in link: ${languageId}`);
  console.log(location.search);
  console.log(languageName);

  return (
    
    <div className={styles.progress_page}>
      <div className={styles.progress_navigation}>
      <Link to={`/languages/${languageName}`}>Курс</Link>
        <Link to={`/progress?languageId=${languageId}`}>Прогресс</Link>
        <Link to={`/review`} state={{ background: location, languageId }}>
          Оставить отзыв
        </Link>
      </div>

      <div className={styles.progress_wrapper}>
        {/* Левая часть */}
        <div className={styles.progress_left}>
          <h1>Твой прогресс</h1>
          <p className={styles.subtitle}>
            Здесь вы можете следить за своими достижениями, видеть завершенные модули и оставшиеся уроки.
          </p>
          {/* Ползунок прогресса */}
          <div className={styles.progress_bar_container}>
            <div className={styles.progress_bar}>
              <div className={styles.progress_bar_fill} style={{ width: `${(progress.completed_lessons / progress.total_lessons) * 100}%` }}>
                {progress.completed_lessons}/{progress.total_lessons}
              </div>
            </div>
          </div>
          {/* Картинка и текст */}
          <div className={styles.congrats_section}>
            <img src={img} alt="Поздравляем" className={styles.congrats_image} />
            <div className={styles.congrats_text}>
              <p><b>Поздравляем!</b> Ваши старания и усердие приносят отличные результаты.</p>
              <p>Каждое новое занятие делает вас увереннее в языке, помогает лучше понимать и использовать его в жизни.</p>
              <p>Не забывайте: даже небольшие шаги ведут к большому прогрессу!</p>
            </div>
          </div>
        </div>

        {/* Правая часть */}
        <div className={styles.progress_right}>
          <div className={styles.progress_info}>
            <h3><FaCheck className={styles.icon} /> Пройдено</h3>
            <ul>
              <li><FaBookOpen className={styles.icon}/> {progress.completed_lessons} уроков</li>
              <li><FaClone className={styles.icon}/> {progress.completed_modules} модулей</li>
            </ul>
          </div>
          <div className={styles.progress_info}>
            <h3><SlFlag className={styles.icon} /> Осталось</h3>
            <ul>
              <li><FaBookOpen className={styles.icon}/> {progress.total_lessons - progress.completed_lessons} урок</li>
              <li><FaClone className={styles.icon}/> {progress.total_modules - progress.completed_modules} модуля</li>
            </ul>
          </div>
        </div>
      </div>
      <h2 className={styles.modules_title}>Список модулей</h2>

      


      {filteredModules.map((mod, index) => {
        const prevModule = filteredModules[index - 1];
        const prevProgress = filteredProgressModules.find((m) => m.id === prevModule?.id);
        const isLocked = index > 0 && !prevProgress?.is_completed;

        return (
          <ModuleItem
            key={mod.id}
            module={mod}
            isLocked={isLocked}
            completedLessonIds={UseProgress.completed_lesson_ids}
            moduleClass={isLocked ? styles.lockedModule : styles.unlockedModule}
          />
        );
      })}
    </div>
  );
}
