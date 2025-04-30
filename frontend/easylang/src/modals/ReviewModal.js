import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles/LoginModal.module.css";
import { createReview, getReviewByUserAndLanguage, updateReview } from "../api/review";

export default function ReviewModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background || location;
  const languageId = location.state?.languageId;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Функция для закрытия модалки
  const handleClose = () => {
    navigate(background.pathname, { state: { languageId } });
  };

  // Функция для отправки отзыва
  const handleSubmit = async () => {
    if (rating === 0 || reviewText.trim() === "") {
      alert("Пожалуйста, поставьте оценку и напишите отзыв.");
      return;
    }

    try {
      const reviewData = { response: reviewText, estimation: rating };
      if (editMode) {
        // Если в режиме редактирования, обновляем отзыв
        await updateReview(existingReview.id, reviewData);
        alert("Отзыв успешно обновлен!");
      } else {
        // Если новый отзыв, создаем его
        await createReview(languageId, reviewText, rating);
        alert("Отзыв успешно отправлен!");
      }
      navigate(background.pathname); // Закрываем модалку после отправки отзыва
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке отзыва. Попробуйте снова.");
    }
  };

  // Загрузка отзыва, если он существует
  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        const review = await getReviewByUserAndLanguage(languageId);
        if (review) {
          setExistingReview(review);
          setRating(review.estimation);
          setReviewText(review.response);
        }
      } catch (error) {
        console.error("Ошибка при загрузке отзыва", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingReview();
  }, [languageId]);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={handleClose}>X</button>
        <h2>{editMode ? "Редактировать отзыв" : "Оставить отзыв"}</h2>

        {existingReview && !editMode ? (
          // Если отзыв существует и не в режиме редактирования
          <>
            <div>
              <p><strong>Ваш отзыв:</strong></p>
              <p>{existingReview.response}</p>
              <p><strong>Оценка:</strong> {existingReview.estimation} ★</p>
              <button onClick={() => setEditMode(true)} className={styles.modal_button}>
                Редактировать отзыв
              </button>
            </div>
          </>
        ) : (
          // В любом другом случае показываем форму для создания или редактирования отзыва
          <>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ cursor: "pointer", color: star <= rating ? "gold" : "gray", fontSize: "24px" }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Напишите отзыв..."
              className={styles.input}
              style={{ height: "100px" }}
            />

            <button className={styles.modal_button} onClick={handleSubmit}>
              {editMode ? "Обновить отзыв" : "Отправить отзыв"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
