import { useParams, useNavigate } from 'react-router-dom';
import styles from './Style (css)/AboutTheCoursePage.module.css';
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { SiBuffer } from "react-icons/si";
import { FaRegSadCry } from "react-icons/fa";

const languages = [
  { id: 1, name: "Английский", link: "english", img: "/images/english.png" },
  { id: 2, name: "Немецкий", link: "german", img: "/images/german.png" },
  { id: 3, name: "Французский", link: "french", img: "/images/french.png" },
  { id: 4, name: "Испанский", link: "spanish", img: "/images/spanish.png" },
];

function AboutTheCoursePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const selectedLanguage = languages.find(lang => lang.link === language);

  if (!selectedLanguage) return <p>Язык не найден <FaRegSadCry /></p>;
  const handleEnroll = () => {
    navigate(`/languages/${language}`);
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{selectedLanguage.name} язык</h1>
        <p className={styles.description}>
          Является официальным или широко используемым языком в более чем 70 странах.
          Это не просто язык, а инструмент, который даёт больше возможностей в жизни,
          работе и обучении.
        </p>
        <button className={styles.enrollButton} onClick={handleEnroll}>Записаться на курс</button>
      </div>
      <div className={styles.right}>
        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <span><SiBuffer className={styles.icon}/></span>
            <span><strong>15 модулей</strong></span>
          </div>
          <div className={styles.infoItem}>
            <span><FaArrowTrendUp className={styles.icon}/></span>
            <div>
              <strong>8 недель</strong><br />
              <span className={styles.subText}>длительность курса</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span><IoMdTime className={styles.icon}/></span>
            <div>
              <strong>2 часа в неделю</strong><br />
              <span className={styles.subText}>понадобится для освоения курса</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutTheCoursePage;
