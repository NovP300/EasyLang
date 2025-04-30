import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getModulesByLanguage } from "../api/modules";
import { getLanguage } from "../api/languages";
import { useNavigate, useLocation } from "react-router-dom";
import ModuleItem from "../components/ModuleItem";
import useProgress from "../api/useProgress"; 
import { Link } from "react-router-dom";
import styles from "./Style (css)/CoursePage.module.css";

// Словарь, связывающий имя языка с его ID
const languageMapping = {
  english: 1,
  german: 2,
  french: 3,
  spanish: 4,
};

export default function CoursePage() {
  const { Name } = useParams();
  const languageId = languageMapping[Name.toLowerCase()];
  const navigate = useNavigate();
  const location = useLocation();

  // Состояния для модулей, описания языка, прогресса и загрузки
  const [modules, setModules] = useState([]);
  const [languageDescription, setLanguageDescription] = useState("");
  const [languageName, setLanguageName] = useState(""); // Для имени курса
  const { UseProgress, loading } = useProgress(); // Получаем прогресс

  // Загружаем модули и описание языка
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModulesByLanguage(languageId);
        setModules(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchLanguageDetails = async () => {
      try {
        const languageData = await getLanguage(languageId);
        setLanguageDescription(languageData.description); // Описание курса
        setLanguageName(languageData.name); // Название курса
      } catch (error) {
        console.error("Error fetching language details:", error);
      }
    };

    fetchModules();
    fetchLanguageDetails();
  }, [Name, languageId]);

  if (loading) return <div>Загрузка прогресса...</div>;

  return (
    <div className="p-4">
      {languageName && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Link to={`/languages/${Name}`}>Курс</Link>
          <Link to={`/progress?languageId=${languageId}`}>Прогресс</Link>
          <Link to="/review" state={{ background: location, languageId }}>
            Оставить отзыв
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Курс: {languageName}</h1>
      <div>{languageDescription}</div>

      {/* Выводим модули с прогрессом */}
      {modules.map((mod, index) => {
        const isLocked = index > 0 && !UseProgress.modules[index - 1]?.is_completed;
        
        return (
          <ModuleItem
            key={mod.id}
            module={mod}
            isLocked={isLocked} // Применяем статус заблокирован/разблокирован
            completedLessonIds={UseProgress.completed_lesson_ids} // Передаем завершенные уроки
            moduleClass={isLocked ? styles.lockedModule : styles.unlockedModule} // Применяем классы для модуля
          />
        );
      })}
    </div>
  );
}
