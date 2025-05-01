import React from "react";
import styles from "./Style (css)/HeadFoot.module.css";
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = React.forwardRef((props, ref) => {
    return (
        <div className={styles.home}>
            <footer className={styles.footer} ref={ref}>
                <div className={styles.footer_container}>
                    <div className={styles.footer_column}>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <FaTwitter />
                            <FaInstagram />
                            <FaYoutube />
                            <FaLinkedin />
                        </div>
                    </div>
                    <div className={styles.footer_column}>
                        <h4>Сценарии использования</h4>
                        <ul>
                            <li>UI-дизайн</li>
                            <li>UX-дизайн</li>
                            <li>Вайрфрейминг</li>
                            <li>Диаграммы</li>
                            <li>Мозговой штурм</li>
                            <li>Онлайн-доска</li>
                            <li>Командная работа</li>
                        </ul>
                    </div>
                    <div className={styles.footer_column}>
                        <h4>Исследовать</h4>
                        <ul>
                            <li>Дизайн</li>
                            <li>Прототипирование</li>
                            <li>Функции для разработки</li>
                            <li>Дизайн-системы</li>
                            <li>Совместная работа</li>
                            <li>Процесс дизайна</li>
                            <li>FigJam</li>
                        </ul>
                    </div>
                    <div className={styles.footer_column}>
                        <h4>Ресурсы</h4>
                        <ul>
                            <li>Блог</li>
                            <li>Лучшие практики</li>
                            <li>Цвета</li>
                            <li>Цветовой круг</li>
                            <li>Поддержка</li>
                            <li>Разработчики</li>
                            <li>Библиотека ресурсов</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
});

export default Footer;
