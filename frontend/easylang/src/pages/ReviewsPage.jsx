import React, { useState, useEffect } from "react";
import styles from "./Style (css)/ReviewsPage.module.css";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllReviews } from "../api/review";
import { getUserById } from "../api/profile";



const languages = [
    {
        id: 1,
        name: "Английский",

    },
    {
        id: 2,
        name: "Немецкий",

    },
    {
        id: 3,
        name: "Французский",

    },
    {
        id: 4,
        name: "Испанский",

    },
];





export default function ReviewsPage() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);


    useEffect(() => {
        const fetchReviewsAndUsers = async () => {
            try {
                // Загружаем все отзывы
                const reviewsData = await getAllReviews();
                console.log("Загруженные отзывы:", reviewsData);  // Отладка

                const approvedSorted = reviewsData
                    .filter((r) => r.moderation_status === "approved")                 // только одобренные
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setReviews(approvedSorted); // Устанавливаем все отзывы

                // Загружаем данные о пользователях
                const usersData = {};
                for (let review of reviewsData) {
                    console.log(`Загружаем профиль для пользователя с ID: ${review.user}`);  // Отладка, какой user загружается
                    const user = await getUserById(review.user);  // Получаем пользователя по его ID
                    console.log("Полученный профиль пользователя:", user);  // Отладка

                    if (user) {
                        usersData[review.user] = user;  // Сохраняем информацию о пользователе
                    }
                }
                setUsers(usersData); // Обновляем состояние с пользователями
            } catch (error) {
                console.error("Ошибка при загрузке отзывов или пользователей", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewsAndUsers();
    }, []);

    const handleClose = () => {
        navigate(-1); // Вернуться на предыдущую страницу
    };

    const filteredReviews = reviews.filter((review) => {
        const matchesRating = selectedRating !== null ? Number(review.estimation) === selectedRating : true;
        const matchesLanguage = selectedLanguage !== null ? review.language === selectedLanguage : true;
        return matchesRating && matchesLanguage;
    });

    return (
        <div className={styles.container}>
            <button onClick={handleClose} className={styles.closeButton}>✕</button>
            <h1 className={styles.title}>Отзывы наших учеников</h1>

            {/* Фильтры */}
            <div className={styles.filtersWrapper}>
                <div className={styles.filterGroup}>
                    <span className={styles.filterTitle}>Оценка:</span>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <button
                            key={star}
                            className={`${styles.filterButton} ${selectedRating === star ? styles.activeFilter : ""}`}
                            onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                        >
                            <FaStar className={styles.starIcon} /> {star}
                        </button>
                    ))}
                </div>

                <div className={styles.filterGroup}>
                    <span className={styles.filterTitle}>Язык курса:</span>
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            className={`${styles.filterButton} ${selectedLanguage === lang.id ? styles.activeFilter : ""}`}
                            onClick={() => setSelectedLanguage(selectedLanguage === lang.id ? null : lang.id)}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Отзывы */}
            {loading ? (
                <div className={styles.loading}>Загрузка...</div>
            ) : (
                <div className={styles.reviews}>
                    {filteredReviews.map((review) => {
                        const language = languages.find(lang => lang.id === review.language);

                        return (
                            <div className={styles.reviewCard} key={review.id}>
                                {/* Звёздочки */}
                                <div className={styles.rating}>
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            color={index < parseFloat(review.estimation) ? "#facc15" : "#d1d5db"}
                                        />
                                    ))}
                                </div>

                                {/* Имя пользователя и дата */}
                                <div className={styles.userInfo}>
                                    <div className={styles.username}>
                                        {review.username || "Имя пользователя"}
                                    </div>
                                    <div className={styles.date}>
                                        {review.formatted_date || ""}
                                    </div>
                                </div>

                                <div className={styles.comment}>{review.response}</div>

                                {/* Название языка */}
                                {language && <div className={styles.language}>{language.name}</div>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
