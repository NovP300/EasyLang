import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./styles/LoginModal.module.css";
import { createReview } from "../api/review";

export default function ReviewModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background || location;
  const languageId = location.state?.languageId;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");


  const handleClose = () => {
    navigate(background.pathname);
  };

  const handleSubmit = async () => {
    if (rating === 0 || reviewText.trim() === "") {
      alert("Пожалуйста, поставьте оценку и напишите отзыв.");
      return;
    }

    try {
      await createReview(languageId, reviewText, rating);
      alert("Отзыв успешно отправлен!");
      navigate(background.pathname);
    } catch (error) {
      console.error(error);
      alert("Ошибка при отправке отзыва. Попробуйте снова.");
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={handleClose}>X</button>
        <h2>Оставить отзыв</h2>

        <div>
          {[1,2,3,4,5].map((star) => (
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
          Отправить
        </button>
      </div>
    </div>
  );
}
