import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTestLessonsByLanguage } from "../api/lessons";

export default function TestPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [testLessons, setTestLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const languages = {
    english: { label: "Английский", id: 1, genitive: "английского" },
    german: { label: "Немецкий", id: 2, genitive: "немецкого" },
    french: { label: "Французский", id: 3, genitive: "французского" },
    spanish: { label: "Испанский", id: 4, genitive: "испанского" },
  };

  const levels = [
    { label: "Начальный", difficulty: 1 },
    { label: "Средний", difficulty: 2 },
    { label: "Продвинутый", difficulty: 3 },
  ];

  const goBack = () => setStep(prev => Math.max(1, prev - 1));
  const closeTest = () => navigate("/");

  // Загрузка тестовых уроков при выборе языка
  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedLanguage) return;
      setIsLoading(true);
      try {
        const lessons = await getTestLessonsByLanguage(selectedLanguage.id);
        setTestLessons(lessons);
      } catch (err) {
        console.error("Ошибка при загрузке тестовых уроков", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [selectedLanguage]);

  const handleLevelClick = (level) => {
    setSelectedLevel(level.label);
  
    console.log("Доступные уроки:", testLessons);
    console.log("Ожидаемый уровень сложности:", level.difficulty);
  
    const matchingLesson = testLessons.find(
        (lesson) => lesson.level === level.difficulty
      );
  
    console.log("Найденный урок:", matchingLesson);
  
    if (matchingLesson) {

      console.log("selectedLanguage.id:", selectedLanguage?.id);
      console.log("Навигация с параметрами:", {
      isTest: true,
      difficulty: matchingLesson.level,
      languageId: selectedLanguage?.id,
    });

      navigate(`/test/${matchingLesson.slug}/exercises`, { state: { isTest: true, difficulty: matchingLesson.level, languageId: selectedLanguage.id } });

    } else {
      alert("Не удалось найти подходящий урок для выбранного уровня.");
    }
  };

  return (
    <div>
      {/* Навигация */}
      <div>
        {step > 1 && <button onClick={goBack}>← Назад</button>}
        <button onClick={closeTest} style={{ float: "right" }}>Закрыть ✕</button>
      </div>

      {/* Шаг 1 */}
      {step === 1 && (
        <div>
          <h2>Выбери, какой язык хочешь изучать</h2>
          {Object.entries(languages).map(([key, { label, id, genitive }]) => (
            <div key={id}>
              <button onClick={() => {
                setSelectedLanguage({ id, label, genitive });
                setStep(2);
              }}>
                {label}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Шаг 2 */}
      {step === 2 && (
        <div>
          <h2>Давай узнаем твой уровень {selectedLanguage?.genitive} языка</h2>
          <button onClick={() => setStep(3)}>Поехали</button>
        </div>
      )}

      {/* Шаг 3 */}
      {step === 3 && (
        <div>
          <h2>Как бы вы оценили свой уровень языка?</h2>
          {isLoading ? (
            <p>Загрузка тестов...</p>
          ) : (
            levels.map((level, i) => (
              <div key={i}>
                <button onClick={() => handleLevelClick(level)}>
                  {level.label}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
