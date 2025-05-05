import { useParams } from 'react-router-dom';
import styles from "./Style (css)/AboutTheCoursePage.module.css"; // если у тебя есть CSS модули

// Данные о языках (можно позже вынести в отдельный файл)
const languages = [
  { id: 1, name: "Английский", link: "english", img: "/images/english.png" },
  { id: 2, name: "Немецкий", link: "german", img: "/images/german.png" },
  { id: 3, name: "Французский", link: "french", img: "/images/french.png" },
  // Добавь свои языки
];

function AboutTheCoursePage() {
  const { language } = useParams();

  // Найдём инфу о выбранном языке
  const selectedLanguage = languages.find(lang => lang.link === language);

  if (!selectedLanguage) {
    return <p>Язык не найден 😢</p>;
  }

  return (
    <div className={styles.aboutCourse}>
      <h1>О курсе: {selectedLanguage.name}</h1>
      <img src={selectedLanguage.img} alt={selectedLanguage.name} />
      <p>Здесь будет подробная информация о курсе {selectedLanguage.name}.</p>
    </div>
  );
}

export default AboutTheCoursePage;