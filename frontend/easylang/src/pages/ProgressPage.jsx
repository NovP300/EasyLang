import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./Style (css)/ProgressPage.module.css";
import img from "./pictures/makaka.png";
import { FaCheck, FaClone, FaBookOpen } from "react-icons/fa";
import { LiaBuffer } from "react-icons/lia";
import { IoMdBook } from "react-icons/io";
import { SlFlag } from "react-icons/sl";
import ModuleItem from "../components/ModuleItem";
import { getModulesByLanguage } from "../api/modules";
import { getProgressOverview, getDetailedProgress } from "../api/progress";
import useProgress from "../api/useProgress";

const languageMapping = {
  english: 1,
  german: 2,
  french: 3,
  spanish: 4,
};
// Склонение по числу: [единственное, от 2 до 4, от 5 и больше]
function getNoun(number, one, two, five) {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) return five;
  if (n1 > 1 && n1 < 5) return two;
  if (n1 === 1) return one;
  return five;
}

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

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);

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
        setPageLoading(false);
      }
    };

    if (languageId) fetchData();
  }, [languageId]);

  const { UseProgress, loading } = useProgress();
  const filteredModules = modules.filter(mod => !mod.is_test);
  const sortedModules = [...filteredModules].sort((a, b) => a.order - b.order);


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
            Здесь вы можете следить за своими достижениями, видеть завершенные модули и оставшиеся уроки
          </p>

          <div className={styles.progress_bar_container}>
            <div className={styles.progress_bar}>
              <div
                className={styles.progress_bar_fill}
                style={{
                  width: `${progress.total_lessons ? (progress.completed_lessons / progress.total_lessons) * 100 : 0}%`
                }}
              ></div>
              <div
                className={styles.progress_label}
                style={{
                  left: `${progress.total_lessons ? (progress.completed_lessons / progress.total_lessons) * 100 : 0}%`
                }}
              >
                {progress.completed_lessons}/{progress.total_lessons}
              </div>
            </div>
          </div>

          <div className={styles.congrats_section}>
            <img src={img} alt="Поздравляем" className={styles.congrats_image} />
            <div className={styles.congrats_text}>
              <p><b>Поздравляем!</b> Ваши старания и усердие приносят отличные результаты.</p>
              <p>Каждое новое занятие делает вас увереннее в языке, помогает лучше понимать и использовать его в повседневной жизни. А главное - вы не останавливаетесь и двигаетесь вперед!</p>
              <p>Не забывайте: даже небольшие шаги ведут к большому прогрессу. Продолжайте учиться, и скоро вы увидите, как легко сможете говорить и понимать язык!</p>
            </div>
          </div>
        </div>

        <div className={styles.progress_right}>
          <div className={styles.progress_info}>
            <h3><FaCheck className={styles.icon} /> Пройдено</h3>
            <ul>
              <li>
                <IoMdBook className={styles.icon} />
                <strong>{progress.completed_lessons}</strong> &nbsp;{getNoun(progress.completed_lessons, "урок", "урока", "уроков")}
              </li>
              <li>
                <LiaBuffer className={styles.icon} />
                <strong>{progress.completed_modules}</strong> &nbsp;{getNoun(progress.completed_modules, "модуль", "модуля", "модулей")}
              </li>
            </ul>
          </div>
          <div className={styles.progress_info}>
            <h3><SlFlag className={styles.icon} /> Осталось</h3>
            <ul>
              <li>
                <IoMdBook className={styles.icon} />
                <strong>{progress.total_lessons - progress.completed_lessons}</strong> &nbsp;{getNoun(progress.total_lessons - progress.completed_lessons, "урок", "урока", "уроков")}
              </li>
              <li>
                <LiaBuffer className={styles.icon} />
                <strong>{progress.total_modules - progress.completed_modules}</strong> &nbsp;{getNoun(progress.total_modules - progress.completed_modules, "модуль", "модуля", "модулей")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className={styles.modules_title}>Список модулей</h2>

      {sortedModules.map((mod, index) => {
      
              return (
                <ModuleItem
                  key={mod.id}
                  module={mod}
                  completedLessonIds={UseProgress.completed_lesson_ids || []}
                  hasSubscription={UseProgress.has_subscription}
                />
              );
            })}
    </div>
  );
}