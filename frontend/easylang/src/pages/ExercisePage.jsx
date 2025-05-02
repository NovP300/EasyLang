import { useEffect, useState, Link } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getExercisesByLesson } from "../api/exercises";
import ExerciseRenderer from "../components/Exercise/ExerciseRender";
import { markLessonCompleted } from "../api/progress";
import { getLessonBySlug } from "../api/lessons";
import { unlockLessonsUpToModule } from "../api/modules";

const GamePage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access_token");

  const isTest = location.state?.isTest || false;
  const testLevel = location.state?.difficulty || null;
  const passedLanguageId = location.state?.languageId || null;

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [lessonId, setLessonId] = useState(null);
  const [lessonMeta, setLessonMeta] = useState(null);
  const [errors, setErrors] = useState(0);
  const maxErrorsAllowed = 2;

  const [languageId, setLanguageId] = useState(null); // для обычного урока

  useEffect(() => {
    console.log("✅ ExercisePage открыт");
    console.log(location);  // для отладки
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExercisesByLesson(slug);
        setQueue(data);

        const lesson = await getLessonBySlug(slug);
        setLessonId(lesson.id);
        setLessonMeta(lesson);
        if (!isTest) {
          setLanguageId(lesson.module.language.id);
        }
      } catch (err) {
        console.error("Ошибка загрузки заданий", err);
      }
    };


    fetchData();
  }, [slug, isTest]);

  useEffect(() => {
    if (!isTest && completed && lessonId) {
      markLessonCompleted(lessonId)
        .then(() => navigate(`/progress?languageId=${languageId}`))
        .catch((err) =>
          console.error("Ошибка при отметке урока как завершённого", err)
        );
    }
  }, [completed, lessonId, isTest, navigate, languageId]);


  useEffect(() => {
    console.log("=== ОТЛАДКА: location.state и связанные параметры ===");
    console.log("location.state:", location.state);
    console.log("isTest:", isTest);
    console.log("testLevel:", testLevel);
    console.log("passedLanguageId:", passedLanguageId);
    console.log("languageId (обычный урок):", languageId);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("lessonId:", lessonId);
    console.log("completed:", completed);
    console.log("errors:", errors);
  }, [
    location.state,
    isTest,
    testLevel,
    passedLanguageId,
    languageId,
    isAuthenticated,
    lessonId,
    completed,
    errors,
  ]);




  const handleAnswer = (isCorrect) => {
    const current = queue[currentIndex];

    if (!isCorrect && isTest) {
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors > maxErrorsAllowed) {
        setCompleted(true);
        return;
      }
    }

    if (!isCorrect && !isTest) {
      setQueue((prevQueue) => [...prevQueue, current]);
    }

    if (currentIndex + 1 >= queue.length) {
      setCompleted(true);

      if (isTest && errors <= maxErrorsAllowed && isAuthenticated) {
        if (passedLanguageId && testLevel) {
          unlockLessonsUpToModule(passedLanguageId, testLevel)
            .then(() => console.log("Модули успешно разблокированы"))
            .catch((err) =>
              console.error("Ошибка при разблокировке модулей", err)
            );
        }
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (queue.length === 0) return <p>Загрузка заданий...</p>;

  if (completed) {
    if (isTest) {
      if (errors > maxErrorsAllowed) {
        return (
          <div className="p-4 text-center">
            ❌ Вы не прошли тест. Попробуйте пройти тест для другого уровня или начните с первого модуля.
          </div>
        );
      } else if (!isAuthenticated) {

        // Сохраняем данные теста перед редиректом
        localStorage.setItem('pendingTestResults', JSON.stringify({
          languageId: passedLanguageId,
          testLevel: testLevel, // или moduleOrder, в зависимости от вашей логики
          isAfterTest: true,
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 дней
        }));

        return (
          <div className="p-4 text-center space-y-4">
            <p>🎉 Молодец! Вы успешно прошли тест.</p>
            <p>Зарегистрируйтесь, чтобы сохранить результат и приступить к обучению!</p>
            <button
              onClick={() => navigate("/register", { state: { background: location } })}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Зарегистрироваться
            </button>
            <button
              onClick={() => navigate("/")}
              className="underline text-sm text-gray-600"
            >
              Позже
            </button>
          </div>
        );
      } else {
        return (
          <div className="p-4 text-center">
            ✅ Вы успешно прошли тест! Модули  разблокированы в соответсвии с пройденным тестом.
          </div>
        );
      }
    }

    return <div className="p-4 text-center">✅ Все задания выполнены!</div>;
  }

  const currentExercise = queue[currentIndex];



  return (
    <div className="p-4 max-w-xl mx-auto">
      <ExerciseRenderer exercise={currentExercise} onAnswer={handleAnswer} />
    </div>
  );
};

export default GamePage;
