import { useState } from "react";
import { MEDIA_URL } from "../../config";
import styles from "./Style/AudioOrderExercise.module.css";
import img1 from "./image/image4.png";

const AudioOrderExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { audio, options, correct_answer } = data;

  const [selected, setSelected] = useState([]); // { word, index }
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

  const handleWordClick = (word, index) => {
    setSelected([...selected, { word, index }]);
  };

  const handleRemoveWord = (indexToRemove) => {
    setSelected(selected.filter(({ index }) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    const selectedWords = selected.map((item) => item.word);
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(correct_answer);
    const randomPraise = positiveWords[Math.floor(Math.random() * positiveWords.length)];

    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? randomPraise
        : correct_answer.join(" "),
    });
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{header}</h2>

      <div className={styles.topSection}>
        <img src={img1} alt="Bear" className={styles.bear} />
        <div className={styles.audioIcon}>
          <audio controls>
            <source src={`${MEDIA_URL}${audio}`} />
            Ваш браузер не поддерживает аудио.
          </audio>
        </div>
      </div>

      {/* Выбранные слова */}
      <div className={styles.selectedContainer}>
        <div className={styles.line}></div>
        <div className={styles.selectedWords}>
          {selected.map(({ word, index }) => (
            <button
              key={index}
              onClick={() => handleRemoveWord(index)}
              className={styles.selectedWord}
            >
              {word}
            </button>
          ))}
        </div>
        <div className={styles.line}></div>
      </div>

      {/* Варианты слов */}
      <div className={styles.optionsContainer}>
        {options.map((word, index) => {
          const isSelected = selected.some((item) => item.index === index);
          if (isSelected) return null;

          return (
            <button
              key={index}
              onClick={() => handleWordClick(word, index)}
              className={styles.wordButton}
            >
              {word}
            </button>
          );
        })}
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
          className={`${styles.feedbackBox} ${feedback.correct ? styles.correct : styles.incorrect}`}
        >
          <div className={styles.feedbackHeader}>
            {feedback.correct ? feedback.message : "Правильный ответ:"}
          </div>

          {!feedback.correct && (
            <div className={styles.feedbackText}>
              {feedback.message}
            </div>
          )}

          <div className={styles.feedbackButtonWrapper}>
            <button
              className={styles.nextButton}
              onClick={() => {
                setSelected([]);
                setFeedback(null);
                onAnswer(feedback.correct);
              }}
            >
              Далее
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioOrderExercise;
