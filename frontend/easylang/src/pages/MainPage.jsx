import { Link, useLocation, useOutletContext } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Style (css)/MainPage.module.css";
import img1 from "./pictures/france.png";
import img2 from "./pictures/nemec.png";
import img3 from "./pictures/spanish.png";
import img4 from "./pictures/USA.png";
import img5 from "./pictures/fon1.jpg";
import { getAllReviews } from "../api/review";
import { getUserById } from "../api/profile";
import { FaStar, FaMedal } from "react-icons/fa";
import { submitFeedback } from '../api/feedback';
import { useNavigate} from "react-router-dom";

const languages = [
    {
        id: 1,
        name: "Английский",
        img: img4,
        description:
            "Самый востребованный язык в мире, ключ к международному общению, карьере и путешествиям. На нем говорят более 1,5 миллиарда человек, а 80% информации в интернете представлено на английском. Изучение английского поможет вам смотреть фильмы в оригинале и уверенно чувствовать себя за границей.",
        link: "english"
    },
    {
        id: 2,
        name: "Немецкий",
        img: img2,
        description:
            "Язык технологий, науки и бизнеса. Германия – один из лидеров мировой экономики, а знание немецкого открывает доступ к образованию и работе в Европе. Логичная грамматика и четкие правила помогут вам быстро освоить язык и использовать его для учебы, карьеры и общения с носителями.",
        link: "german"
    },
    {
        id: 3,
        name: "Французский",
        img: img1,
        description:
            "Язык моды, искусства, дипломатии и романтики. На нем говорят более 300 миллионов человек в разных уголках мира. Французский полезен для путешествий, работы в международных организациях и знакомства с богатой культурой Франции. Освоив его, вы сможете читать классику в оригинале и свободно общаться в Париже!",
        link: "french"
    },
    {
        id: 4,
        name: "Испанский",
        img: img3,
        description:
            "Второй по популярности язык в мире, на котором говорят более 500 миллионов человек. Это язык страсти, музыки, танцев и ярких путешествий по Испании и Латинской Америке. Благодаря простой грамматике и приятному звучанию испанский легко освоить, а знание его откроет двери в новую культуру и возможности!",
        link: "spanish"
    },
];

const faqData = [
    {
        question: "Как проходит обучение в вашей онлайн-школе?",
        answer:
            "Наши курсы состоят из интерактивных уроков, практических заданий и аутентичных материалов. Вы учитесь в удобное время, без строгих расписаний и преподавателей.",
    },
    {
        question: "Как определить свой уровень языка?",
        answer:
            "Перед началом обучения вы можете пройти тест, который поможет определить ваш уровень и выявить пробелы в знаниях.",
    },
    {
        question: "Сколько времени нужно, чтобы выучить язык?",
        answer:
            "Все зависит от ваших целей и регулярности занятий. В среднем, для достижения уверенного уровня общения потребуется от нескольких месяцев до года.",
    },
    {
        question: "Будут ли у меня сертификаты после прохождения курса?",
        answer:
            "После успешного завершения курса вы получите электронный сертификат, подтверждающий ваш уровень знаний.",
    },
    {
        question: "Подойдет ли мне этот курс, если у меня совсем нет опыта?",
        answer:
            "Конечно! У нас есть программы как для новичков, так и для продолжающих. Начните с базового уровня и постепенно переходите к более сложным темам.",
    },
];

export default function MainPage() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    const aboutRef = useRef(null);
    const pricingRef = useRef(null);
    const languagePR = useRef(null);
    const faqRef = useRef(null);
    const reviewsRef = useRef(null);

    const { setHeaderProps, contactsRef } = useOutletContext();

    const scrollToSection = (ref) => {
        setMenuOpen(false); // Закрываем бургер-меню при переходе
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setHeaderProps({
            scrollToSection,
            aboutRef,
            pricingRef,
            languagePR,
            faqRef,
            reviewsRef,
            contactsRef,
        });

        // Опционально: очищаем после ухода со страницы
        return () => {
            setHeaderProps({});
        };
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');


    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };

    //ФОРМАААА
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedLanguage, setSelectedLanguage] = useState(null);

    //ВАЛИДАЦИЯ ФОРМЫ ЗАЯВОК
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Введите имя';
        if (!formData.age || isNaN(formData.age) || formData.age < 5 || formData.age > 120) {
            newErrors.age = 'Введите возраст от 5 до 120 лет';
        }
        if (!formData.phone || !/^(\+7|8)[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Формат: +79991234567';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const result = await submitFeedback(formData);
            setSubmitStatus(result);

            if (result.success) {
                setFormData({
                    name: '',
                    age: '',
                    phone: '',
                    email: ''
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState({});

    const isAuthenticated = Boolean(localStorage.getItem("access_token"));

    useEffect(() => {

        const fetchReviewsAndUsers = async () => {
            try {
                // Загружаем отзывы
                const reviewsData = await getAllReviews();
                console.log("Загруженные отзывы:", reviewsData);  // Отладка

                const approvedSorted = reviewsData
                    .filter((r) => r.moderation_status === "approved")                 // только одобренные
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setReviews(approvedSorted.slice(0, 3));

                // Загружаем данные о пользователях
                const usersData = {};
                for (let review of reviewsData) {
                    console.log(`Загружаем профиль для пользователя с ID: ${review.user}`);  // Отладка, какой user загружается
                    // Теперь мы должны загрузить профиль по ID, используя API
                    const user = await getUserById(review.user);  // Функция для получения пользователя по его ID
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

    const navigate = useNavigate();
    const handleStartClick = () => {
        if (isAuthenticated) {
          navigate("/payment");
        } else {
          navigate("/register" , { state: { background: location } });
        }
      };

    return (
        <div className={styles.home}>
            {/* EasyLang — учите языки в своем ритме! */}
            <section className={styles.hero_section}>
            <img src={img5} alt="Фон" className={styles.hero_bg_img} />
                <div className={styles.hero_overlay}>
                    <h1 className={styles.home_title}>EasyLang — учите языки в своем ритме!</h1>
                    <p className={styles.home_text}>
                        Изучайте иностранные языки легко и в удобное время!
                        EasyLang — это интерактивные курсы, <br /> практические задания и современный подход к обучению без преподавателей. <br />
                        Учитесь в своем ритме и достигайте результатов!
                    </p>
                    <Link to="/test">
                        <button className={styles.try_free_btn}>Попробовать бесплатно</button>
                    </Link>
                    <div className={styles.login_link}>
                        <Link to="/login" state={{ background: location }}>У меня уже есть аккаунт</Link>
                    </div>
                </div>
            </section>

            {/* Начните изучать английский язык прямо сейчас! */}
            <section className={styles.start_learning_section}>
                <h2 className={styles.start_learning_title}>Начните изучать английский язык прямо сейчас!</h2>
                <div className={styles.buttons_row}>
                    <button onClick={() => openModal('Начните с теста, чтобы понять, с чего лучше стартовать.')}>
                        Определим ваш уровень и пробелы в знаниях
                    </button>
                    <button onClick={() => openModal('Выбирайте темы и форматы, которые подходят именно вам.')}>
                        Персонализированные курсы
                    </button>
                    <button onClick={() => openModal('Практикуйте грамматику, лексику и произношение в увлекательной форме.')}>
                        Интерактивные задания
                    </button>
                    <button onClick={() => openModal('Учитесь на примерах из реальной жизни: статьи, видео, подкасты и диалоги носителей языка.')}>
                        Аутентичные материалы
                    </button>
                    <button onClick={() => openModal('Учитесь когда и где удобно, без строгих расписаний.')}>
                        Гибкий график
                    </button>
                    <button onClick={() => openModal('Следите за своими успехами и получайте награды за достижения!')}>
                        Прогресс и мотивация
                    </button>
                </div>

                {isAuthenticated ? (<button className={styles.start_btn} onClick={() => scrollToSection(languagePR)}>Начать заниматься</button>)
                    : (
                        <Link to="/login" state={{ background: location }}>
                            <button className={styles.start_btn}>Начать заниматься</button>
                        </Link>
                    )}
            </section>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <p>{modalContent}</p>
                        <button onClick={closeModal}>Закрыть</button>
                    </div>
                </div>
            )}

            {/* Что вас приведет к результату? */}
            <section className={styles.results_section} ref={aboutRef}>
                <div className={styles.results_content}>
                    <h2 className={styles.results_title}>Что вас приведет к <br />результату?</h2>
                    <div className={styles.results_columns}>
                        <ul className={styles.results_column}>
                            <li><FaMedal className={styles.icon} /> Погружение в язык – учитесь через живые примеры, диалоги и аутентичные материалы.</li>
                            <li><FaMedal className={styles.icon} /> Постепенная сложность – задания и темы усложняются по мере роста ваших навыков.</li>
                            <li><FaMedal className={styles.icon} /> Развитие всех навыков – прокачивайте чтение, письмо, аудирование и лексику в комплексе.</li>
                        </ul>

                        <ul className={styles.results_column}>
                            <li><FaMedal className={styles.icon} /> Практика через повторение – закрепляйте знания с помощью тестов, заданий и мини-игр.</li>
                            <li><FaMedal className={styles.icon} /> Осознанное обучение – понимайте, как и зачем используется каждое правило и конструкция.</li>
                            <li><FaMedal className={styles.icon} /> Поддержка мотивации – отслеживайте прогресс, получайте награды и достигайте новых целей!</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.auth_form}>
                    <h3 className={styles.auth_title}>Получите программу и консультацию</h3>

                    {submitStatus && (
                        <div className={submitStatus.success ? styles.successMessage : styles.errorMessage}>
                            {submitStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                placeholder="Имя"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={errors.name ? styles.errorInput : ''}
                            />
                            {errors.name && <span className={styles.error}>{errors.name}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="number"
                                placeholder="Возраст"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className={errors.age ? styles.errorInput : ''}
                                min="5"
                                max="120"
                            />
                            {errors.age && <span className={styles.error}>{errors.age}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="tel"
                                placeholder="Телефон (+79991234567)"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={errors.phone ? styles.errorInput : ''}
                            />
                            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? styles.errorInput : ''}
                            />
                            {errors.email && <span className={styles.error}>{errors.email}</span>}
                        </div>

                        <button
                            type="submit"
                            className={styles.submit_btn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Отправка...' : 'Оставить заявку'}
                        </button>
                    </form>
                </div>
            </section>

            <section className={styles.languageSection} ref={languagePR}>
                <h2 className={styles.title}>Выбери язык, который хочешь изучать</h2>

                {/* Контейнер для языков (фиксированные размеры) */}
                <div className={styles.languageWrapper}>
                    <div className={styles.languageContainer}>
                        {languages.map(lang => (
                            <Link
                                key={lang.id}
                                to={`/about-the-course/${lang.link}`}
                                className={styles.languageButton}
                            >
                                <img src={lang.img} alt={lang.name} />
                                <span>{lang.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Блок с тестом */}
                <div className={styles.testContainer}>
                    <p className={styles.testText}>
                        Сомневаешься в своём уровне и не знаешь с чего начать?
                    </p>
                    <button className={styles.testButton}>
                        <Link className={styles.testLink} to={"/test"}>Пройти тест</Link>
                    </button>
                </div>
            </section>

            <section className={styles.pricing} ref={pricingRef}>
                <section className={styles.pricing_section}>
                    <h2 className={styles.pricing_title}>Тарифы</h2>
                    <div className={styles.pricing_container}>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Стартовый</h3>
                            <p className={styles.card_description}>
                                Вас ждут бесплатные задания: десятки упражнений на лексику, грамматику, произношение
                            </p>
                            <p className={styles.card_price}>бесплатно</p>
                            <button className={styles.card_button}  onClick={() => navigate("/test")}>Попробовать</button>
                        </div>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Премиум</h3>
                            <p className={styles.card_description}>
                                Максимальный доступ ко всем упражнениям и материалам на сайте, занимайтесь сколько хотите
                            </p>
                            <p className={styles.card_price}>от 329 р/мес</p>
                            <button className={styles.card_button} onClick={handleStartClick}>Начать заниматься</button>
                        </div>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Премиум полгода</h3>
                            <p className={styles.card_description}>
                                Максимальный доступ ко всем упражнениям и материалам на сайте, занимайтесь сколько хотите
                            </p>
                            <p className={styles.card_price}>от 1299 р/мес</p>
                            <button className={styles.card_button} onClick={handleStartClick}>Начать заниматься</button>
                        </div>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Премиум год</h3>
                            <p className={styles.card_description}>
                                Максимальный доступ ко всем упражнениям и материалам на сайте, занимайтесь сколько хотите
                            </p>
                            <p className={styles.card_price}>от 2388 р/мес</p>
                            <button className={styles.card_button} onClick={handleStartClick}>Начать заниматься</button>
                        </div>
                    </div>
                </section>
            </section>

            {/* Часто задаваемые вопросы */}
            <section className={styles.faqSection} ref={faqRef}>
                <h2>Часто задаваемые вопросы</h2>
                {faqData.map((item, idx) => (
                    <div key={idx}>
                        <div
                            className={styles.faqItem}
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                            <span>{item.question}</span>
                            <span>{openIndex === idx ? "−" : "+"}</span>
                        </div>
                        {openIndex === idx && (
                            <div className={styles.faqAnswer}>{item.answer}</div>
                        )}
                    </div>
                ))}
            </section>

            {/* Отзывы наших учеников */}
            <section className={styles.reviewSection} ref={reviewsRef}>
                <h2>Отзывы наших учеников</h2>

                {loading ? (
                    <div>Загрузка...</div> // Заменяем на блок с текстом "Загрузка"
                ) : (
                    <div className={styles.reviewGrid}>
                        {reviews.map((review) => {
                            // Ищем язык по id
                            const language = languages.find(lang => lang.id === review.language);
                            return (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.rating}>
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                color={index < parseFloat(review.estimation) ? "#facc15" : "#d1d5db"}
                                            />
                                        ))}
                                    </div>

                                    <div className={styles.user}>
                                        {/* Проверяем, если пользователь есть в state */}
                                        {users[review.user] && (
                                            <>
                                                <div>
                                                    {users[review.user].username} <br />
                                                    <small>{new Date(review.date).toLocaleDateString()}</small> {/* Форматируем дату */}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.comment}>{review.response}</div>

                                    {/* Отображаем название языка */}
                                    {language && <div className={styles.language}>Курс: {language.name}</div>}
                                </div>
                            );
                        })}
                    </div>
                )}

                <Link to="/reviews">
                    <button className={styles.btnCom}>Больше отзывов</button>
                </Link>
            </section>

        </div>
    );
}