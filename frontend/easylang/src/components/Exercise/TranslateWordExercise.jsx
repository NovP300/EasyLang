import { useState } from "react";

const TranslateWordExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise;
  const { question, options, correct_answer } = data;
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleClick = (option) => {
    setSelected(option);
    const isCorrect = option === correct_answer;
    setFeedback(isCorrect ? "✅ Правильно!" : `❌ Неправильно. Правильно: ${correct_answer}`);
    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{header}</h2>
      <p className="mb-4 text-xl">{question}</p>
      <div className="grid gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            className={`p-2 border rounded ${selected === opt ? "bg-blue-200" : "bg-white"}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {feedback && <div className="mt-4">{feedback}</div>}
    </div>
  );
};

export default TranslateWordExercise;
