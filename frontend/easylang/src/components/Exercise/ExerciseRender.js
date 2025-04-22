import TranslateWordExercise from "./TranslateWordExercise";
import TranslateImageExercise from "./TranslateImageExercise";
import FillTranslationExercise from "./FillTranslationExercise";
import FillAudioExercise from "./FillAudioExercise";
import WordOrderExercise from "./WordOrderExercise";
import AudioOrderExercise from "./AudioOrderExercise";

const ExerciseRenderer = ({ exercise, onAnswer }) => {
  const { type } = exercise;

  switch (type) {
    case "translate_word":
      return <TranslateWordExercise exercise={exercise} onAnswer={onAnswer} />;
    case "translate_image":
      return <TranslateImageExercise exercise={exercise} onAnswer={onAnswer} />;
    case "fill_translation":
      return <FillTranslationExercise exercise={exercise} onAnswer={onAnswer} />;
    case "fill_audio":
      return <FillAudioExercise exercise={exercise} onAnswer={onAnswer} />;
    case "word_order":
      return <WordOrderExercise exercise={exercise} onAnswer={onAnswer} />;
    case "audio_order":
      return <AudioOrderExercise exercise={exercise} onAnswer={onAnswer} />;
    default:
      return <div>❌ Неизвестный тип упражнения</div>;
  }
};


export default ExerciseRenderer;
