import { useState } from "react";
import { MEDIA_URL } from "../../config";
import styles from "./Style/TranslateImageExercise.module.css";

const TranslateImageExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { image, correct_answer } = data;
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const positiveWords = [
    "Супер!",
    "Молодец!",
    "Умница!",
    "Так держать!",
    "Потрясающе!",
    "Удивительно!",
    "Ты вообще красотка!"
  ];
  const handleSubmit = () => {
    const isCorrect = input.trim().toLowerCase() === correct_answer.toLowerCase();
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? positiveWords[Math.floor(Math.random() * positiveWords.length)]
        : correct_answer,
    });
    /*setTimeout(() => {
      setInput("");
      setFeedback(null);
      onAnswer(isCorrect);
    }, 1500);*/
  };
  const handleNext = () => {
    setInput("");
    setFeedback(null);
    onAnswer(feedback.correct);
  };
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{header}</h2>
      <div className={styles.topSection}>
        <img src={`${MEDIA_URL}${image}`} alt="exercise" className={styles.bear} />
      </div>
      <div className={styles.sentenceBox}>
        <input
          className={styles.inputInline}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите перевод"
        />
      </div>
      {!feedback && (
        <div className={styles.buttonsRow}>
          
          <button onClick={handleSubmit} className={styles.submitButton}>
            Проверить
          </button>
        </div>
      )}
      {feedback && (
        <div
          className={`${styles.feedbackBox} ${feedback.correct ? styles.correct : styles.incorrect
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

export default TranslateImageExercise;
