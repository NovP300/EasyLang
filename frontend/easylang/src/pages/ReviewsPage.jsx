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

    return (
        <div className={styles.container}>
            <button onClick={handleClose} className={styles.closeButton}>✕</button>
            <h1 className={styles.title}>Отзывы наших учеников</h1>

            {loading ? (
                <div className={styles.loading}>Загрузка...</div> // Блок для загрузки
            ) : (
                <div className={styles.reviews}>
                    {reviews.map((review) => {
                        const user = users[review.user]; // Ищем пользователя по id
                        const language = languages.find(lang => lang.id === review.language); // Ищем язык по id

                        return (
                            <div className={styles.reviewCard} key={review.id}>
                                <div className={styles.rating}>
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            color={index < parseFloat(review.estimation) ? "#facc15" : "#d1d5db"}
                                        />
                                    ))}
                                </div>

                                <div className={styles.userInfo}>
                                    <div>
                                        <div className={styles.username}>
                                            {user ? user.username : "Имя пользователя"} {/* Показываем имя пользователя */}
                                        </div>
                                        <div className={styles.date}>
                                            {new Date(review.date).toLocaleDateString()} {/* Форматируем дату */}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.comment}>{review.response}</div>

                                {/* Добавляем название языка (если нужно) */}
                                {language && <div className={styles.language}>{language.name}</div>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
