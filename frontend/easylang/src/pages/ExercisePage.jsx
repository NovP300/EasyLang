import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { getExercisesByLesson } from "../api/exercises";
import ExerciseRenderer from "../components/Exercise/ExerciseRender";
import { markLessonCompleted } from "../api/progress";
import { getLessonBySlug } from "../api/lessons"; 

const GamePage = () => {
  const { slug } = useParams();

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [lessonId, setLessonId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExercisesByLesson(slug); // вернёт 6
        setQueue(data);

        const lesson = await getLessonBySlug(slug);
        setLessonId(lesson.id);
      } catch (err) {
        console.error("Ошибка загрузки заданий", err);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (completed && lessonId) {
      console.log(lessonId)
      markLessonCompleted(lessonId).catch((err) =>
        console.error("Ошибка при отметке урока как завершённого", err)
      );
    }
  }, [completed, lessonId]);


  const handleAnswer = (isCorrect) => {
    const current = queue[currentIndex];

    let updatedQueue = [...queue];
    if (!isCorrect) {
      // Добавим текущий вопрос в конец, если ошибка
      updatedQueue.push(current);
    }

    if (currentIndex + 1 >= queue.length) {
      setCompleted(true);

      

    } else {
      setCurrentIndex(currentIndex + 1);
    }

    setQueue(updatedQueue);
  };

  if (queue.length === 0) return <p>Загрузка заданий...</p>;
  if (completed) return <div className="p-4 text-center">✅ Все задания выполнены!</div>;

  const currentExercise = queue[currentIndex];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <ExerciseRenderer exercise={currentExercise} onAnswer={handleAnswer} />
    </div>
  );
};

export default GamePage;
