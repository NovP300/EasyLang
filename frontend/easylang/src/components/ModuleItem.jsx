import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LessonList from "./LessonList";
import styles from "./Style (css)/ModuleItem.module.css";
import { FaCheckCircle, FaPlus, FaMinus } from "react-icons/fa";
import { getLessonsByModule } from "../api/lessons";
import useProgress from "../api/useProgress";

export default function ModuleItem({ module,  completedLessonIds, moduleClass, hasSubscription}) {
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await getLessonsByModule(module.id);
      setLessons(data);
    };
    fetchLessons();
  }, [module.id]);

  const isModuleCompleted = module.is_completed || (
    lessons.length > 0 && lessons.every(lesson => completedLessonIds.includes(lesson.id))
  );

  const isLocked = module.paid && !hasSubscription;

  return (
    <div className={`${styles.moduleItem} ${moduleClass}`}>

        <div
          className={styles.moduleHeader}
          onClick={() => {
            if (isLocked) {
              navigate("/promo", { state: { background: location } });
            } else {
              setOpen(!open);
            }
          }}
        >

        <div className={`${styles.statusIcon} ${isModuleCompleted ? styles.completed : styles.incomplete}`}>
          <FaCheckCircle size={28} />
        </div>

        <div className={styles.moduleInfo}>
          <h2 className={`${styles.moduleTitle} ${isLocked ? styles.lockedTitle : styles.unlockedTitle}`}>
            {module.title}
          </h2>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={styles.expandIcon}
          disabled={isLocked}
        >
          {open ? <FaMinus /> : <FaPlus />}
        </button>
      </div>

      {open && (
        <>
          <p className={styles.moduleDescription}>{module.description}</p>
          <LessonList moduleId={module.id} completedLessonIds={completedLessonIds} />
        </>
      )}
    </div>
  );
}
