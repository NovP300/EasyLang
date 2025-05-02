import { useState } from "react";
import styles from './Style/WordOrderExercise.module.css';

const WordOrderExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { text, options, correct_answer } = data;
  const [selected, setSelected] = useState([]);
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
  const handleWordClick = (word) => {
    if (selected.includes(word)) {
      setSelected(selected.filter((w) => w !== word));
    } else {
      setSelected([...selected, word]);
    }
  };

  const handleRemoveWord = (word) => {
    setSelected(selected.filter((w) => w !== word));
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selected) === JSON.stringify(correct_answer);
    const randomPraise = positiveWords[Math.floor(Math.random() * positiveWords.length)];
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? randomPraise : correct_answer.join(" "),
    });
    /*setTimeout(() => {
      setSelected([]);
      setFeedback(null);
      onAnswer(isCorrect);
    }, 2000);*/
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.header}>{header}</h2>
      <div className={styles.topSection}>
        <p style={{ fontSize: "20px", fontWeight: "500" }}>{text}</p>
      </div>

      {/* Выбранные слова */}
      <div className={styles.selectedContainer}>
        <div className={styles.line}></div>
        <div className={styles.selectedWords}>
          {selected.map((word, index) => (
            <button
              key={index}
              onClick={() => handleRemoveWord(word)}
              className={styles.selectedWord}
            >
              {word}
            </button>
          ))}
        </div>
        <div className={styles.line}></div>
      </div>

      {/* Доступные слова */}
      <div className={styles.optionsContainer}>
        {options
          .filter((word) => !selected.includes(word))
          .map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className={styles.wordButton}
            >
              {word}
            </button>
          ))}
      </div>
      
      {!feedback && (
        <div className={styles.buttonsRow}>
          <button className={styles.skipButton}>Пропустить</button>
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

export default WordOrderExercise;
