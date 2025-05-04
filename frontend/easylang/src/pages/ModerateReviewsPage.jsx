import React, { useEffect, useState } from "react";
import styles from "./Style (css)/ReviewsPage.module.css"; // переиспользуем стили
import { getAllReviews, updateReview } from "../api/review";
import { getUserById } from "../api/profile";
import { useNavigate } from "react-router-dom";

export default function ModerateReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        const pending = data.filter(r => r.is_moderated === true);

        const usersData = {};
        for (let review of pending) {
          const user = await getUserById(review.user);
          if (user) {
            usersData[review.user] = user;
          }
        }

        setReviews(pending);
        setUsers(usersData);
      } catch (error) {
        console.error("Ошибка при загрузке отзывов", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleModerate = async (reviewId, status) => {
    try {
      await updateReview(reviewId, {
        moderation_status: status,
        is_moderated: false,
      });
      setReviews(prev => prev.filter(r => r.id !== reviewId)); // убираем с экрана
    } catch (error) {
      console.error("Ошибка при модерации", error);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Отзывы на модерации</h1>
      {reviews.length === 0 ? (
        <p>Нет отзывов, ожидающих модерации.</p>
      ) : (
        <div className={styles.reviews}>
          {reviews.map((review) => {
            const user = users[review.user];
            return (
              <div className={styles.reviewCard} key={review.id}>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < review.estimation ? "gold" : "gray" }}>★</span>
                  ))}
                </div>

                <div className={styles.userInfo}>
                  <div className={styles.username}>{user?.username || "Пользователь"}</div>
                  <div className={styles.date}>{new Date(review.date).toLocaleDateString()}</div>
                </div>

                <div className={styles.comment}>{review.response}</div>

                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button
                    className={styles.modal_button}
                    onClick={() => handleModerate(review.id, "approved")}
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Принять
                  </button>
                  <button
                    className={styles.modal_button}
                    onClick={() => handleModerate(review.id, "rejected")}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
