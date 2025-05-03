import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./Style (css)/ProgressPage.module.css";
import img from "./pictures/girl.png";
import { FaCheck, FaClone, FaBookOpen } from "react-icons/fa";
import { SlFlag } from "react-icons/sl";
import ModuleItem from "../components/ModuleItem";
import { getModulesByLanguage } from "../api/modules";
import { getProgressOverview, getDetailedProgress } from "../api/progress";

const languageMapping = {
  english: 1,
  german: 2,
  french: 3,
  spanish: 4,
};

export default function ProgressPage() {
  const location = useLocation();
  const languageId = new URLSearchParams(location.search).get('languageId') || location.state?.languageId;
  const languageName = Object.keys(languageMapping).find(key => languageMapping[key] === Number(languageId));

  const [progress, setProgress] = useState({ 
    completed_lessons: 0, 
    total_lessons: 0,
    completed_modules: 0,
    total_modules: 0 
  });
  const [modules, setModules] = useState([]);
  const [detailedProgress, setDetailedProgress] = useState({ 
    completed_lesson_ids: [], 
    modules: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [overviewRes, detailedRes, modulesRes] = await Promise.all([
          getProgressOverview(),
          getDetailedProgress(),
          getModulesByLanguage(languageId)
        ]);

        // Фильтрация данных по текущему языку
        const langProgress = overviewRes[languageId] || {
          completed_lessons: 0,
          total_lessons: 0,
          completed_modules: 0,
          total_modules: 0
        };

        const langDetailedModules = detailedRes.modules.filter(
          mod => mod.language_id === Number(languageId)
        );

        setProgress(langProgress);
        setModules(modulesRes);
        setDetailedProgress({
          completed_lesson_ids: detailedRes.completed_lesson_ids,
          modules: langDetailedModules
        });
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    if (languageId) fetchData();
  }, [languageId]);

  const filteredModules = modules.filter(mod => mod.title !== 'Test');
  const filteredProgressModules = detailedProgress.modules.filter(mod => mod.title !== 'Test');

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className={styles.progress_page}>
      {languageName && (
        <div className={styles.tabNavigation}>
          <Link to={`/languages/${languageName}`} className={styles.tabLink}>Курс</Link>
          <Link 
            to={`/progress?languageId=${languageId}`} 
            className={`${styles.tabLink} ${location.pathname.includes("/progress") ? styles.activeTab : ""}`}
          >
            Прогресс
          </Link>
          <Link 
            to="/review" 
            state={{ background: location, languageId }} 
            className={styles.tabLink}
          >
            Оставить отзыв
          </Link>
        </div>
      )}

      <div className={styles.progress_wrapper}>
        <div className={styles.progress_left}>
          <h1>Твой прогресс</h1>
          <p className={styles.subtitle}>
            Здесь вы можете следить за своими достижениями в {languageName}.
          </p>
          
          <div className={styles.progress_bar_container}>
            <div className={styles.progress_bar}>
              <div 
                className={styles.progress_bar_fill} 
                style={{ 
                  width: `${progress.total_lessons ? 
                    (progress.completed_lessons / progress.total_lessons) * 100 : 0}%` 
                }}
              >
                {progress.completed_lessons}/{progress.total_lessons}
              </div>
            </div>
          </div>

          <div className={styles.congrats_section}>
            <img src={img} alt="Поздравляем" className={styles.congrats_image} />
            <div className={styles.congrats_text}>
              <p><b>Поздравляем!</b> Ваши старания приносят результаты.</p>
              <p>Каждое занятие делает вас увереннее в {languageName}.</p>
            </div>
          </div>
        </div>

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
              <li><FaBookOpen className={styles.icon}/> {progress.total_lessons - progress.completed_lessons} уроков</li>
              <li><FaClone className={styles.icon}/> {progress.total_modules - progress.completed_modules} модулей</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className={styles.modules_title}>Список модулей</h2>
      {filteredModules.map((mod, index) => {
        const prevModule = filteredModules[index - 1];
        const prevProgress = filteredProgressModules.find(m => m.id === prevModule?.id);
        const isLocked = index > 0 && !prevProgress?.is_completed;

        return (
          <ModuleItem
            key={mod.id}
            module={mod}
            isLocked={isLocked}
            completedLessonIds={detailedProgress.completed_lesson_ids}
            moduleClass={isLocked ? styles.lockedModule : styles.unlockedModule}
          />
        );
      })}
    </div>
  );
}