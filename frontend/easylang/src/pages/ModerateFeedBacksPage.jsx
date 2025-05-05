import React, { useEffect, useState } from "react";
import { getAllFeedbacks, updateFeedbackStatus } from "../api/feedback";
import styles from "./Style (css)/ReviewsPage.module.css";

export default function ModerateFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const toggleCompleted = async (id, currentStatus) => {
    try {
      await updateFeedbackStatus(id, !currentStatus);
      await fetchFeedbacks(); // обновляем список после изменения
    } catch (error) {
      alert("Не удалось изменить статус заявки");
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (filter === "completed") return fb.is_done;
    if (filter === "pending") return !fb.is_done;
    return true;
  });

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Заявки с формы обратной связи</h1>

      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${filter === "all" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("all")}
        >
          Все
        </button>
        <button
          className={`${styles.filterButton} ${filter === "pending" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("pending")}
        >
          Активные
        </button>
        <button
          className={`${styles.filterButton} ${filter === "completed" ? styles.activeFilter : ""}`}
          onClick={() => setFilter("completed")}
        >
          Выполненные
        </button>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p>Заявок пока нет.</p>
      ) : (
        <div className={styles.reviews}>
          {filteredFeedbacks.map(fb => (
            <div
              key={fb.id}
              className={styles.reviewCard}
              style={{
                opacity: fb.is_done ? 0.5 : 1,
                backgroundColor: fb.is_done ? "#f0f0f0" : "white"
              }}
            >
              <div><strong>Имя:</strong> {fb.name}</div>
              <div><strong>Возраст:</strong> {fb.age}</div>
              <div><strong>Телефон:</strong> {fb.phone}</div>
              <div><strong>Email:</strong> {fb.email}</div>
              <div><strong>Создана:</strong> {new Date(fb.created_at).toLocaleString()}</div>

              <button
                className={styles.toggleButton}
                onClick={() => toggleCompleted(fb.id, fb.is_done)}
              >
                {fb.is_done ? "Сделать активной" : "Отметить выполненной"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
