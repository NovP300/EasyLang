import React, { useEffect, useState } from "react";
import { getAllFeedbacks } from "../api/feedback"; // путь к функции
import styles from "./Style (css)/ReviewsPage.module.css"; // можно временно переиспользовать

export default function ModerateFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getAllFeedbacks();
        setFeedbacks(data);
        // Стартово все заявки как невыполненные
        const initialCompleted = {};
        data.forEach(f => { initialCompleted[f.id] = false });
        setCompleted(initialCompleted);
      } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const toggleCompleted = (id) => {
    setCompleted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Заявки с формы обратной связи</h1>
      {feedbacks.length === 0 ? (
        <p>Заявок пока нет.</p>
      ) : (
        <div className={styles.reviews}>
          {feedbacks.map(fb => (
            <div
              key={fb.id}
              className={styles.reviewCard}
              style={{
                opacity: completed[fb.id] ? 0.5 : 1,
                backgroundColor: completed[fb.id] ? "#f0f0f0" : "white"
              }}
            >
              <div><strong>Имя:</strong> {fb.name}</div>
              <div><strong>Возраст:</strong> {fb.age}</div>
              <div><strong>Телефон:</strong> {fb.phone}</div>
              <div><strong>Email:</strong> {fb.email}</div>
              <div><strong>Создана:</strong> {new Date(fb.created_at).toLocaleString()}</div>

              <label style={{ marginTop: "10px", display: "block" }}>
                <input
                  type="checkbox"
                  checked={completed[fb.id]}
                  onChange={() => toggleCompleted(fb.id)}
                />{" "}
                Выполнено
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
