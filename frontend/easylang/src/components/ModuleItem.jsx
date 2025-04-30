import { useState } from "react";
import LessonList from "./LessonList";
import styles from "./Style (css)/ModuleItem.module.css";

export default function ModuleItem({ module, isLocked, completedLessonIds, moduleClass }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mb-3 border p-3 rounded-xl shadow-md ${moduleClass}`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isLocked ? styles.lockedTitle : styles.unlockedTitle}`}>
          {module.title}
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-blue-600 hover:underline"
          disabled={isLocked} // Блокируем кнопку, если модуль заблокирован
        >
          {open ? "Скрыть уроки" : "Показать уроки"}
        </button>
      </div>
      {open && <LessonList moduleId={module.id} completedLessonIds={completedLessonIds} />}
    </div>
  );
}
