import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../config";
import ModuleItem from "../components/ModuleItem";
import { useLocation } from "react-router-dom";
import { getModulesByLanguage } from "../api/modules";
import { Link } from "react-router-dom";


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
  const { languageId } = location.state || {};

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

  if (!progress) return <p>Загрузка...</p>;

  return (
    <div className="p-4">

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <Link to={`/languages/${Object.keys(languageMapping).find(key => languageMapping[key] === languageId) || ''}`}>
        Курс
      </Link>
        <Link to={`/progress`}>Прогресс</Link>
        <button onClick={() => alert("Оставить отзыв - модалка появится позже")}>
          Оставить отзыв
        </button>
      </div>



      <h2 className="text-xl font-bold mb-4">Твой прогресс</h2>
      <p>✅ Пройдено уроков: {progress.completed_lessons} / {progress.total_lessons}</p>
      <p>📦 Пройдено модулей: {progress.completed_modules} / {progress.total_modules}</p>

      <h2>Список модулей</h2>

      {modules.map((mod) => (
        <ModuleItem key={mod.id} module={mod} />
      ))}


    </div>
  );
}
