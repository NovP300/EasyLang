import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Style (css)/HeadFoot.module.css";

import { logout } from "../api/profile";

const Header = ({ scrollToSection, aboutRef, pricingRef, languagePR, faqRef, reviewsRef, contactsRef }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const location = useLocation();
    const isMainPage = location.pathname === "/";
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isAuthenticated = Boolean(localStorage.getItem("access_token"));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.home}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.logo}>EasyLang</div>
                    <div className={styles.menu_icon} onClick={toggleMenu}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                    </div>
                    {isMainPage ? (
                        <ul className={`${styles.nav_links} ${menuOpen ? styles.nav_active : ""}`}>
                            <li><button onClick={() => scrollToSection(aboutRef)}>О нас</button></li>
                            <li><button onClick={() => scrollToSection(languagePR)}>Каталог языков</button></li>
                            <li><button onClick={() => scrollToSection(pricingRef)}>Тарифы</button></li>
                            <li><button onClick={() => scrollToSection(faqRef)}>Вопросы</button></li>
                            <li><button onClick={() => scrollToSection(reviewsRef)}>Отзывы</button></li>
                            <li><button onClick={() => scrollToSection(contactsRef)}>Контакты</button></li>
                        </ul>
                    ) : (
                        <ul className={`${styles.nav_links} ${menuOpen ? styles.nav_active : ""}`}>
                            <li>
                                <button className={styles.nav_button} onClick={() => navigate("/")}>
                                    Главная
                                </button>
                            </li>
                            <li>
                                <button className={styles.nav_button} onClick={() => navigate("/reviews")}>
                                    Отзывы
                                </button>
                            </li>
                            {/* добавь другие ссылки, если надо */}
                        </ul>

                    )}

                    {!isAuthenticated ? (
                        <div className={styles.auth_buttons}>
                            <Link to="/login" state={{ background: location }}>
                                <button className={styles.login_btn}>Войти</button>
                            </Link>
                            <Link to="/register" state={{ background: location }}>
                                <button className={styles.signup_btn}>Зарегистрироваться</button>
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.auth_buttons}>
                            <div className={styles.profile_wrapper} ref={profileMenuRef}>
                                <button className={`${styles.profile_btn} ${menuOpen ? styles.profile_btn_active : ''}`}
                                    onClick={() => setMenuOpen((prev) => !prev)}>
                                    Профиль
                                </button>
                                <div className={`${styles.dropdown_menu} ${menuOpen ? styles.dropdown_open : ''}`}>
                                    <hr className={styles.divider} />
                                    <button className={styles.dropdown_item} onClick={() => navigate("/profile")}>
                                        Мой профиль
                                    </button>
                                    <button className={styles.dropdown_item} onClick={() => navigate("/courses")}>
                                        Мои курсы
                                    </button>
                                    <button className={styles.dropdown_item} onClick={handleLogout}>
                                        Выйти
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </header>
        </div>
    );
};

export default Header;
