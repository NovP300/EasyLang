import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLessonBySlug } from "../api/lessons";
import { Link } from "react-router-dom";

const MEDIA_URL = "http://localhost:80/media/";


const IntroBlock = ({ text }) => (
  <div className="intro-block">
    <h2 className="text-xl font-semibold">Введение</h2>
    <p>{text}</p>
  </div>
);

const InformationBlock = ({ title, text, audio }) => (
  <div className="information-block">
    <h3 className="font-bold">{title}</h3>
    <p>{text}</p>
    {audio && <audio controls src={`${MEDIA_URL}${audio}`}>Ваш браузер не поддерживает аудио</audio>}
  </div>
);

const VocabularyBlock = ({ items }) => (
  <div className="vocabulary-block">
    <h3 className="font-bold">Словарь урока</h3>
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <strong>{item.fl}</strong> - {item.ru} <em>({item.pronounce})</em>
        </li>
      ))}
    </ul>
  </div>
);

const PictureBlock = ({ text, media }) => (
  <div className="picture-block">
    <h3 className="font-bold">Картинка</h3>
    <p>{text}</p>
    <img src={`${MEDIA_URL}${media}`} alt={`Путь к картинке: ${MEDIA_URL}${media}`} className="w-full" />
  </div>
);


const reverseLanguageMapping = {
  1: "english",
  2: "german",
  3: "french",
  4: "spanish",
};




export default function LessonPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLessonBySlug(slug);
        setLesson(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLesson();
  }, [slug]);

  if (error) return <div className="p-4 text-red-600">Ошибка: {error}</div>;
  if (!lesson) return <div className="p-4">Загрузка...</div>;

  const languageId = lesson.module?.language?.id;
  const languageName = reverseLanguageMapping[languageId];

  return (
    <div className="p-4">
        {languageName && (
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Link to={`/languages/${languageName}`}>Курс</Link>
            <button disabled>Прогресс</button>
            <button onClick={() => alert("Оставить отзыв - модалка появится позже")}>
              Оставить отзыв
            </button>
          </div>
        )}

      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p>Сложность: {lesson.difficulty_level}/3</p>
      
      {/* Рендерим теорию */}
      <div className="theory mt-4">
        {lesson.theory.map((block, index) => {
          switch (block.type) {
            case "intro":
              return <IntroBlock key={index} text={block.text} />;
            case "information":
              return (
                <InformationBlock
                  key={index}
                  title={block.title}
                  text={block.text}
                  audio={block.audio}
                />
              );
            case "vocabulary":
              return <VocabularyBlock key={index} items={block.items} />;
            case "picture":
              return <PictureBlock key={index} text={block.text} media={block.media} />;
            default:
              return null;
          }
        })}
      </div>
      <Link to={`/lessons/${lesson.slug}/exercises`}>Приступить к упражнениям</Link>
    </div>
  );
}
