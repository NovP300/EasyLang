import { useState } from "react";
import LessonList from "./LessonList";

export default function ModuleItem({ module }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 border p-3 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {/* Убираем ссылку и просто отображаем название модуля */}
          {module.title}
        </h2>
        <button onClick={() => setOpen(!open)} className="text-sm text-blue-600 hover:underline">
          {open ? "Скрыть уроки" : "Показать уроки"}
        </button>
      </div>
      {open && <LessonList moduleId={module.id} />}
    </div>
  );
}
