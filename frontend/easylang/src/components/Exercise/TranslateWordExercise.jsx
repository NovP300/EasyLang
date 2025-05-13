import { useState } from "react";
import styles from "./Style/TranslateWordExercise.module.css";
import img1 from "./image/image5.png";

const TranslateWordExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { question, options, correct_answer } = data;
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const positiveWords = [
    "Супер!",
    "Молодец!",
    "Так держать!",
    "Потрясающе!",
    "Удивительно!",
    "Хорошо!",
  ];

  const handleClick = (option) => {
    setSelected(option);
    const isCorrect = option === correct_answer;
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? positiveWords[Math.floor(Math.random() * positiveWords.length)]
        : correct_answer,
    });
    /*setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      onAnswer(isCorrect);
    }, 1500);*/
  };
  
  const handleNext = () => {
    setSelected(null);
    setFeedback(null);
    onAnswer(feedback.correct);
  };
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{header}</h2>
      <div className={styles.topSection}>
        <img src={img1} alt="Bear" className={styles.bear} />
        <div className={styles.Icon}>
          <p className="text-xl font-semibold">{question}</p>
        </div>
      </div>

      <div className={styles.optionsContainer}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            className={`${styles.wordButton} ${
              selected === opt ? styles.selectedWord : ""
            }`}
            disabled={feedback}
          >
            {opt}
          </button>
        ))}
      </div>
      {feedback && (
        <div
          className={`${styles.feedbackBox} ${
            feedback.correct ? styles.correct : styles.incorrect
          }`}
        >
          <div className={styles.feedbackHeader}>
            {feedback.correct ? feedback.message : "Правильный ответ:"}
          </div>

          {!feedback.correct && (
            <div className={styles.feedbackText}>{feedback.message}</div>
          )}

          <div className={styles.feedbackButtonWrapper}>
            <button className={styles.nextButton} onClick={handleNext}>
              Далее
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslateWordExercise;
