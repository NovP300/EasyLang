import React from "react";
import styles from "./Style (css)/ReviewsPage.module.css";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const reviews = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    user: "Имя пользователя",
    date: "Дата отзыва",
    comment: "Комментарий",
    rating: 3,
    avatar: "https://via.placeholder.com/40" // заменишь на настоящие аватарки
}));

export default function ReviewsPage() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1); // вернуться на предыдущую страницу
    };

    return (
        <div className={styles.container}>
            <button onClick={handleClose} className={styles.closeButton}>✕</button>
            <h1 className={styles.title}>Отзывы наших учеников</h1>
            <div className={styles.reviews}>
                {reviews.map((review) => (
                    <div className={styles.reviewCard} key={review.id}>
                        <div className={styles.rating}>
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    color={index < review.rating ? "#facc15" : "#d1d5db"}
                                />
                            ))}
                        </div>
                        <div className={styles.userInfo}>
                            <img src={review.avatar} alt="avatar" className={styles.avatar} />
                            <div>
                                <div className={styles.username}>{review.user}</div>
                                <div className={styles.date}>{review.date}</div>
                            </div>
                        </div>
                        <div className={styles.comment}>{review.comment}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
