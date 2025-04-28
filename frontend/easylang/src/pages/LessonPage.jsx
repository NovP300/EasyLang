import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLessonBySlug } from "../api/lessons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from './Style (css)/LessonPage.module.css';

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
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className={styles.pageContainer}>
      {languageName && (
        <div className={styles.navButtons}>
          <Link to={`/languages/${languageName}`}>Курс</Link>
          <Link to={`/progress`} state={{ languageId }}>Прогресс</Link>
          <Link to="/review" state={{ background: location, languageId }}>Оставить отзыв</Link>
        </div>
      )}

      <h1 className={styles.pageTitle}>{lesson.title}</h1>
      <p className={styles.difficulty}>Сложность: {lesson.difficulty_level}/3</p>

      {/* Рендерим теорию */}
      <div className="theory">
        {lesson.theory.map((block, index) => {
          switch (block.type) {
            case "intro":
              <div className={styles.block}>
                <h2>Введение</h2>
                <p>{block.text}</p>
              </div>
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
