import { useParams, useNavigate, Link, useLocation} from 'react-router-dom';
import styles from './Style (css)/AboutTheCoursePage.module.css';
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { SiBuffer } from "react-icons/si";
import { FaRegSadCry } from "react-icons/fa";
import { getModulesByLanguage } from '../api/modules';
import { useState, useEffect } from 'react';
import { enrollToCourse} from '../api/enrollment';



const languages = [
  {
    id: 1,
    name: "Английский",
    link: "english",
    img: "/images/english.png",
    description: `Английский — язык, на котором говорят более 1,5 миллиарда человек по всему миру. Это язык фильмов, песен, мемов и Интернета. Благодаря знанию английского ты сможешь понимать своих кумиров без перевода, свободно путешествовать и открывать для себя мир без границ. Это не просто язык — это ключ к глобальному общению.`
  },
  {
    id: 2,
    name: "Немецкий",
    link: "german",
    img: "/images/german.png",
    description: `Немецкий — строгий, но удивительно логичный язык, на котором говорят более 100 миллионов человек. Он раскрывает мир немецкой точности, философии и классической музыки. Хочешь читать Гёте в оригинале или понимать, что поёт Rammstein? Немецкий откроет тебе дверь в совершенно особенную культуру.`
  },
  {
    id: 3,
    name: "Французский",
    link: "french",
    img: "/images/french.png",
    description: `Французский — язык романтики, искусства и утончённости. Более 300 миллионов человек по всему миру говорят на нём, и каждый слог звучит как музыка. Мечтаешь прогуляться по Парижу и заказать круассан без ошибок в произношении? Французский подарит тебе это и ещё больше — эстетику в словах и наслаждение от изучения.`
  },
  {
    id: 4,
    name: "Испанский",
    link: "spanish",
    img: "/images/spanish.png",
    description: `Испанский — яркий и эмоциональный язык, на котором говорят более 500 миллионов человек. Он звучит в танцах фламенко, песнях Шакиры и уличных беседах Барселоны. Это язык путешествий, страсти и настоящего темперамента. Начни учить испанский — и мир заговорит с тобой ярче.`
  },
];

function getDeclension(number, [one, few, many]) {
  const n = Math.abs(number) % 100;
  const lastDigit = n % 10;

  if (n > 10 && n < 20) return many;
  if (lastDigit > 1 && lastDigit < 5) return few;
  if (lastDigit === 1) return one;
  return many;
}

function AboutTheCoursePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedLanguage = languages.find(lang => lang.link === language);
  const [moduleCount, setModuleCount] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      if (selectedLanguage) {
        try {
          const modules = await getModulesByLanguage(selectedLanguage.id);
          setModuleCount(modules.length);
        } catch (error) {
          console.error("Ошибка при получении модулей:", error);
        }
      }
    };
    fetchModules();
  }, [selectedLanguage]);


  if (!selectedLanguage) return <p>Язык не найден <FaRegSadCry /></p>;

  const calculatedWeeks = moduleCount !== null ? Math.ceil(moduleCount * 1.5 / 1.5) : null;

  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  const handleEnroll = async () => {
    try {
      await enrollToCourse(selectedLanguage.id);
      navigate('/courses');
    } catch (error) {
      
      console.log("Ошибка сервера:", error.response?.data);
      const responseData = error.response?.data;

      let message = "Произошла ошибка при записи на курс";

      if (typeof responseData === "string") {
        message = responseData;
      } else if (typeof responseData?.detail === "string") {
        message = responseData.detail;
      } else if (typeof responseData?.error === "string") {
        message = responseData.error;
      }

      alert(message);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{selectedLanguage.name} язык</h1>
        <p className={styles.description}>
          {selectedLanguage.description}
        </p>
        {isAuthenticated ? (
          <button className={styles.enrollButton} onClick={handleEnroll}>
          Записаться на курс
          </button>
        ) : (
          <Link to="/register" state={{ background: location }} className={styles.enrollButton}>
            Записаться на курс
          </Link>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <span><SiBuffer className={styles.icon}/></span>
            <span><strong>{moduleCount !== null
            ? `${moduleCount} ${getDeclension(moduleCount, ['модуль', 'модуля', 'модулей'])}`
            : "Загрузка..."}</strong></span>
          </div>
          <div className={styles.infoItem}>
            <span><FaArrowTrendUp className={styles.icon}/></span>
            <div>
              <strong>{calculatedWeeks !== null
    ? `${calculatedWeeks} ${getDeclension(calculatedWeeks, ['неделя', 'недели', 'недель'])}`
    : "Загрузка..."}</strong><br />
              <span className={styles.subText}>длительность курса</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span><IoMdTime className={styles.icon}/></span>
            <div>
              <strong>1.5 часа в неделю</strong><br />
              <span className={styles.subText}>понадобится для освоения курса</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutTheCoursePage;
