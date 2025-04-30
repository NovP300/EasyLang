import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TestPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const languages = {
    english: { label: "Английский", id: 1, genitive: "английского" },
    german: { label: "Немецкий", id: 2, genitive: "немецкого" },
    french: { label: "Французский", id: 3, genitive: "французского" },
    spanish: { label: "Испанский", id: 4, genitive: "испанского" },
  };

  const levels = ["Я новичок", "Начальный", "Средний", "Продвинутый"];

  const goBack = () => setStep(prev => Math.max(1, prev - 1));
  const closeTest = () => navigate("/");

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
          {Object.entries(languages).map(([key, { label, id }]) => (
            <div key={id}>
              <button onClick={() => {
                setSelectedLanguage({ id, label, genitive: languages[key].genitive });
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
          <h2>Давай узнаем твой уровень {selectedLanguage?.genitive} языка </h2>
          <button onClick={() => setStep(3)}>Поехали</button>
        </div>
      )}

      {/* Шаг 3 */}
      {step === 3 && (
        <div>
          <h2>Как бы вы оценили свой уровень языка?</h2>
          {levels.map((level, i) => (
            <div key={i}>
              <button onClick={() => {
                setSelectedLevel(level);
                // Здесь можно подгрузить упражнения
                console.log("Выбран уровень:", level);
              }}>
                {level}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
