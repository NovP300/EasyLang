import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getModulesByLanguage } from "../api/modules";
import { getLanguage } from "../api/languages"; 
import ModuleItem from "../components/ModuleItem";
import { Link, useNavigate, useLocation } from "react-router-dom";


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


  const [modules, setModules] = useState([]);
  const [languageDescription, setLanguageDescription] = useState("");
  const [languageName, setLanguageName] = useState(""); // Добавляем состояние для имени курса

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

        const languageData = await getLanguage(languageId); // Получаем данные о языке
        
        setLanguageDescription(languageData.description);  // Получаем описание курса
        

        setLanguageName(languageData.name); // Получаем название курса
      } catch (error) {
        console.error("Error fetching language details:", error);
      }
    };

    fetchModules();
    fetchLanguageDetails();
  }, [Name]);

  return (
    
    <div className="p-4">

      {languageName && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <Link to={`/languages/${Name}`}>Курс</Link>
                  <Link to={`/progress`} state={{ languageId }}>Прогресс</Link>
                  <Link to="/review" state={{ background: location, languageId }}>Оставить отзыв</Link>
                </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Курc: {languageName}</h1>
      <div>{languageDescription}</div>
      {modules.map((mod) => (
        <ModuleItem key={mod.id} module={mod} />
      ))}
    </div>
  );
}
