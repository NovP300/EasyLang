import React from "react";
import styles from "./Style (css)/Footer.module.css";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa6"; // FaXTwitter — из react-icons/fa6

const Footer = React.forwardRef((props, ref) => {
    return (

        <div className={styles.home}>
            <div className={styles.footerWrapper}>
                <div className={styles.footerTopLine}></div>
                <footer className={styles.footer} ref={ref}>
                    <div className={styles.footer_container_custom}>

                        {/* Левая колонка — Контакты */}
                        <div className={`${styles.footer_block} ${styles.first_column}`}>
                            <h2 className={styles.footer_title}>Контакты</h2>
                            <h4 className={styles.socials_title}>Наши соцсети</h4>
                            <div className={styles.socials}>
                                <FaXTwitter />
                                <FaInstagram />
                                <FaYoutube />
                                <FaLinkedin />
                            </div>
                            <div className={styles.legal}>
                                <p>ИНН 7731394040</p>
                                <p>ОГРН 5177746279409</p>
                                <p>Почтовый адрес: 117342, г. Екатеринбург,</p>
                                <p>ул. Мира, д. 47к3</p>
                                <p>ООО «Изи Ленг Инновейшнс»</p>
                            </div>
                        </div>

                        {/* Центр — Преподаватели */}
                        <div className={`${styles.footer_block} ${styles.lowered}`}>
                            <h4>Наши преподаватели</h4>
                            <p>Добрых Арина Александровна</p>
                            <p>Миншина Аделина Дамировна</p>
                            <p>Новоселова Полина Сергеевна</p>
                            <p>Шестакова Анастасия Германовна</p>
                            <p>Шарипов Данил Ильдарович</p>
                        </div>

                        {/* Правая колонка — Связь */}
                        <div className={`${styles.footer_block} ${styles.lowered}`}>
                            <h4>Обратная связь</h4>
                            <p>Телефон: +7(917)275-05-35</p>
                            <p>Email: easylang@gmail.com</p>
                            <hr />
                            <p>Служба клиентской поддержки работает</p>
                            <p>круглосуточно, без выходных.</p>
                            <p>Напишите или позвоните нам — всё расскажем.</p>
                        </div>

                    </div>
                </footer>
            </div>
        </div>
    );
});

export default Footer;
