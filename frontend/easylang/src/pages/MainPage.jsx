import { Link, useLocation } from "react-router-dom";
import styles from "./Style (css)/MainPage.module.css";
import React, { useState } from "react";
import img1 from "./pictures/france.png";
import img2 from "./pictures/nemec.png";
import img3 from "./pictures/spanish.png";
import img4 from "./pictures/USA.png";

const languages = [
    {
        name: "Английский",
        img: img2,
        description:
            "Самый востребованный язык в мире, ключ к международному общению, карьере и путешествиям. На нем говорят более 1,5 миллиарда человек, а 80% информации в интернете представлено на английском. Изучение английского поможет вам смотреть фильмы в оригинале и уверенно чувствовать себя за границей.",
    },
    {
        name: "Немецкий",
        img: img3,
        description:
            "Язык технологий, науки и бизнеса. Германия – один из лидеров мировой экономики, а знание немецкого открывает доступ к образованию и работе в Европе. Логичная грамматика и четкие правила помогут вам быстро освоить язык и использовать его для учебы, карьеры и общения с носителями.",
    },
    {
        name: "Французский",
        img: img1,
        description:
            "Язык моды, искусства, дипломатии и романтики. На нем говорят более 300 миллионов человек в разных уголках мира. Французский полезен для путешествий, работы в международных организациях и знакомства с богатой культурой Франции. Освоив его, вы сможете читать классику в оригинале и свободно общаться в Париже!",
    },
    {
        name: "Испанский",
        img: img4,
        description:
            "Второй по популярности язык в мире, на котором говорят более 500 миллионов человек. Это язык страсти, музыки, танцев и ярких путешествий по Испании и Латинской Америке. Благодаря простой грамматике и приятному звучанию испанский легко освоить, а знание его откроет двери в новую культуру и возможности!",
    },
];

export default function MainPage() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
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

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState({});

    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите имя';
        }
        if (!formData.age.trim() || isNaN(formData.age) || formData.age < 1) {
            newErrors.age = 'Введите корректный возраст';
        }
        if (!formData.phone.trim() || !/^\+?\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Введите корректный номер телефона';
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert('Заявка отправлена!');
        }
    };
    return (
        <div className={styles.home}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    {/* Логотип */}
                    <div className={styles.logo}>EasyLang</div>

                    {/* Иконка бургера */}
                    <div className={styles.menu_icon} onClick={toggleMenu}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                    </div>
                    <ul className={`${styles.nav_links} ${menuOpen ? styles.nav_active : ""}`}>
                        <li>
                            <Link to="/about" onClick={() => setMenuOpen(false)}>
                                О нас
                            </Link>
                        </li>
                        <li>
                            <Link to="/languages" onClick={() => setMenuOpen(false)}>
                                Каталог языков
                            </Link>
                        </li>
                        <li>
                            <Link to="/pricing" onClick={() => setMenuOpen(false)}>
                                Тарифы
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" onClick={() => setMenuOpen(false)}>
                                Вопросы
                            </Link>
                        </li>
                        <li>
                            <Link to="/reviews" onClick={() => setMenuOpen(false)}>
                                Отзывы
                            </Link>
                        </li>
                        <li>
                            <Link to="/contacts" onClick={() => setMenuOpen(false)}>
                                Контакты
                            </Link>
                        </li>
                    </ul>

                    {/* Кнопки входа и регистрации */}
                    <div className={styles.auth_buttons}>
                        <Link to="/login" state={{ background: location }}>
                            <button className={styles.login_btn}>Войти</button>
                        </Link>
                        <Link to="/register" state={{ background: location }}>
                            <button className={styles.signup_btn}>Зарегистрироваться</button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* EasyLang — учите языки в своем ритме! */}
            <section className={styles.hero_section}>
                <div className={styles.hero_overlay}>
                    <h1 className={styles.home_title}>EasyLang — учите языки в своем ритме!</h1>
                    <p className={styles.home_text}>
                        Изучайте иностранные языки легко и в удобное время!
                        EasyLang — это интерактивные курсы, <br /> практические задания и современный подход к обучению без преподавателей. <br />
                        Учитесь в своем ритме и достигайте результатов!
                    </p>
                    <Link to="#">
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
                <Link to="/login" state={{ background: location }}>
                    <button className={styles.start_btn}>Начать заниматься</button>
                </Link>
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
            <section className={styles.results_section}>
                <div className={styles.results_content}>
                    <h2 className={styles.results_title}>Что вас приведет к <br />результату?</h2>
                    <div className={styles.results_columns}>
                        <ul className={styles.results_column}>
                            <li>📖 Погружение в язык – учитесь через живые примеры, диалоги и аутентичные материалы.</li>
                            <li>📈 Постепенная сложность – задания и темы усложняются по мере роста ваших навыков.</li>
                            <li>📝 Развитие всех навыков – прокачивайте чтение, письмо, аудирование и лексику в комплексе.</li>
                        </ul>
                        <ul className={styles.results_column}>
                            <li>🔄 Практика через повторение – закрепляйте знания с помощью тестов, заданий и мини-игр.</li>
                            <li>💡 Осознанное обучение – понимайте, как и зачем используется каждое правило и конструкция.</li>
                            <li>🎯 Поддержка мотивации – отслеживайте прогресс, получайте награды и достигайте новых целей!</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.auth_form}>
                    <h3 className={styles.auth_title}>Получите программу и консультацию</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Имя"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <span className={styles.error}>{errors.name}</span>}

                        <input
                            type="text"
                            placeholder="Возраст"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                        {errors.age && <span className={styles.error}>{errors.age}</span>}

                        <input
                            type="text"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {errors.phone && <span className={styles.error}>{errors.phone}</span>}

                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <span className={styles.error}>{errors.email}</span>}

                        <button type="submit" className={styles.submit_btn}>Оставить заявку</button>
                    </form>
                </div>
            </section>

            <section className={styles.languageSection}>
                <h2 className={styles.title}>Выбери язык, который хочешь изучать</h2>

                {/* Контейнер для языков (фиксированные размеры) */}
                <div className={styles.languageWrapper}>
                    {!selectedLanguage ? (
                        <div className={styles.languageContainer}>
                            {languages.map(lang => (
                                <button key={lang.id} className={styles.languageButton} onClick={() => setSelectedLanguage(lang)}>
                                    <img src={lang.img} alt={lang.name} />
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Описание языка (появляется внутри того же контейнера) */
                        <div className={styles.languageDescription}>
                            {/* Левая часть: картинка + название */}
                            <div className={styles.languageInfo}>
                                <img className={styles.languageImage} src={selectedLanguage.img} alt={selectedLanguage.name} />
                                <h3 className={styles.languageTitle}>{selectedLanguage.name}</h3>
                            </div>

                            {/* Правая часть: описание */}
                            <p className={styles.languageText}>{selectedLanguage.description}</p>

                            {/* Кнопка-стрелка справа */}
                            <button className={styles.nextButton} onClick={() => setSelectedLanguage(null)}>➡️</button>
                        </div>
                    )}
                </div>

                {/* Блок с тестом */}
                <div className={styles.testContainer}>
                    <p className={styles.testText}>
                        Сомневаешься в своём уровне и не знаешь с чего начать?
                    </p>
                    <button className={styles.testButton}>Пройти тест</button>
                </div>
            </section>

            <section className={styles.pricing}>
                <section className={styles.pricing_section}>
                    <h2 className={styles.pricing_title}>Тарифы</h2>
                    <div className={styles.pricing_container}>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Стартовый</h3>
                            <p className={styles.card_description}>
                                Вас ждут бесплатные задания: десятки упражнений на лексику, грамматику, произношение
                            </p>
                            <p className={styles.card_price}>бесплатно</p>
                            <button className={styles.card_button}>Попробовать</button>
                        </div>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Премиум</h3>
                            <p className={styles.card_description}>
                                Максимальный доступ ко всем упражнениям и материалам на сайте, занимайтесь сколько хотите
                            </p>
                            <p className={styles.card_price}>от 329 р/мес</p>
                            <button className={styles.card_button}>Начать заниматься</button>
                        </div>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Премиум полгода</h3>
                            <p className={styles.card_description}>
                                Максимальный доступ ко всем упражнениям и материалам на сайте, занимайтесь сколько хотите
                            </p>
                            <p className={styles.card_price}>от 1299 р/мес</p>
                            <button className={styles.card_button}>Начать заниматься</button>
                        </div>
                        <div className={styles.pricing_card}>
                            <h3 className={styles.card_title}>Премиум год</h3>
                            <p className={styles.card_description}>
                                Максимальный доступ ко всем упражнениям и материалам на сайте, занимайтесь сколько хотите
                            </p>
                            <p className={styles.card_price}>от 2388 р/мес</p>
                            <button className={styles.card_button}>Начать заниматься</button>
                        </div>
                    </div>
                </section>
            </section>

        </div>
    );
}