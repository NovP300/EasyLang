import { useState } from "react";
import { MEDIA_URL } from "../../config";
import styles from "./Style/FillAudioExercise.module.css";
import img1 from "./image/image4.png";

const FillAudioExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { audio, text, correct_answer } = data;
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const positiveWords = [
    "Супер!",
    "Молодец!",
    "Так держать!",
    "Потрясающе!",
    "Удивительно!",
    "Хорошо!",
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
  const parts = text.split("__");
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{header}</h2>

      <div className={styles.topSection}>
        <img src={img1} className={styles.bear} />
        <div className={styles.Icon}>
          <audio controls>
            <source src={`${MEDIA_URL}${audio}`} />
            Ваш браузер не поддерживает аудио.
          </audio>
        </div>
      </div>

      <div className={styles.sentenceBox}>
        <p className={styles.sentence}>
          {parts[0]}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.inputInline}
            placeholder="Введите слово"
          />
          {parts[1]}
        </p>
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

export default FillAudioExercise;
