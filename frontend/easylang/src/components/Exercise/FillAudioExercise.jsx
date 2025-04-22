import { useState } from "react";
import { MEDIA_URL } from "../../config";   


const FillAudioExercise = ({ exercise, onAnswer }) => {
  const { header, data } = exercise; 
  const { audio, text, correct_answer } = data;
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = () => {
    const isCorrect = input.trim().toLowerCase() === correct_answer.toLowerCase();
    setFeedback(isCorrect ? "✅ Правильно!" : `❌ Неправильно. Правильно: ${correct_answer}`);
    setTimeout(() => {
      setInput("");
      setFeedback(null);
      onAnswer(isCorrect);
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{header}</h2>
      <audio controls src={`${MEDIA_URL}${audio}`} className="mb-4" />
      <p className="mb-2 text-xl">{text}</p>
      <input
        className="border p-2 mb-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите слово"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Ответить</button>
      {feedback && <div className="mt-4">{feedback}</div>}
    </div>
  );
};

export default FillAudioExercise;
