import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./styles/ReviewModal.module.css";
import { createReview, getReviewByUserAndLanguage, updateReview } from "../api/review";
import { getProfile } from "../api/profile";

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
  const [user, setUser] = useState(null);

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
      const reviewData = {
        response: reviewText,
        estimation: rating,
        is_moderated: true,
        moderation_status: "pending",
        user: user.id,
      };
      if (editMode) {
        // Если в режиме редактирования, обновляем отзыв
        await updateReview(existingReview.id, reviewData);
        alert("Отзыв отправлен на повторную модерацию.");
      } else {
        // Если новый отзыв, создаем его
        await createReview(languageId, reviewText, rating, user.id);
        alert("Отзыв отправлен на модерацию.");
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

  // Получаем информацию о пользователе
  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getProfile();
      if (profile) {
        setUser(profile);  // Сохраняем пользователя в state
      }
    };

    fetchUser();
  }, []);


  const renderModerationStatus = (status) => {
    switch (status) {
      case "pending":
        return <p className={styles.status_pending}>Отзыв на модерации</p>;
      case "approved":
        return <p className={styles.status_approved}>Отзыв одобрен</p>;
      case "rejected":
        return <p className={styles.status_rejected}>Отзыв отклонён. Вы можете отредактировать его.</p>;
      default:
        return null;
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={handleClose}>X</button>
        <h2>{editMode ? "Редактировать отзыв" : "Оставить отзыв"}</h2>

        {existingReview && !editMode ? (
          // Если отзыв существует и не в режиме редактирования
          <>
            <div className={styles.redac}>
              <p><strong>Ваш отзыв:</strong></p>
              <p>{existingReview.response}</p>
              <p><strong>Оценка:</strong> {existingReview.estimation} <kdb style={{ color: "gold" }}>★</kdb></p>
              {renderModerationStatus(existingReview.moderation_status)}
              <button onClick={() => setEditMode(true)} className={styles.modal_button}>
                Редактировать отзыв
              </button>
            </div>
          </>
        ) : (
          // В любом другом случае показываем форму для создания или редактирования отзыва
          <>
            <h3 className={styles.text1} >Ваше мнение важно для нас!</h3>
            <p>Оцените наш сайт</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={styles.star}
                  style={{ color: star <= rating ? "gold" : "gray"}}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <p>Расскажите, что вам понравилось в курсе и что можно улучшить</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Оставьте комментарий..."
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
