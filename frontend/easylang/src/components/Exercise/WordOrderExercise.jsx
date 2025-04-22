import { useState } from "react";

const WordOrderExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { text, options, correct_answer } = data;
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handleWordClick = (word) => {
    if (!selected.includes(word)) {
      setSelected([...selected, word]);
    }
  };

  const handleRemoveWord = (word) => {
    setSelected(selected.filter((w) => w !== word));
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selected) === JSON.stringify(correct_answer);
    setFeedback(isCorrect ? "✅ Правильно!" : `❌ Неправильно. Правильный порядок: ${correct_answer.join(" ")}`);
    setTimeout(() => {
      setSelected([]);
      setFeedback(null);
      onAnswer(isCorrect);
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{header}</h2>
      <p className="mb-2">{text}</p>

      {/* Выбранные слова */}
      <div className="mb-4 flex flex-wrap gap-2">
        {selected.map((word, index) => (
          <button
            key={index}
            onClick={() => handleRemoveWord(word)}
            className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300 transition"
          >
            {word} ✖
          </button>
        ))}
      </div>

      {/* Кнопки со словами */}
      <div className="mb-4 flex flex-wrap gap-2">
        {options.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordClick(word)}
            disabled={selected.includes(word)}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition disabled:opacity-50"
          >
            {word}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Ответить
      </button>

      {feedback && <div className="mt-4 text-center font-semibold">{feedback}</div>}
    </div>
  );
};

export default WordOrderExercise;
