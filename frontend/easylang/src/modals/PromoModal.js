import React, { useEffect } from "react";
import styles from "./styles/PromoModal.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoLockOpenOutline } from "react-icons/io5";
import { TiBook } from "react-icons/ti";
import { LuPenLine } from "react-icons/lu";

 

const PromoModal = () => {
    useEffect(() => {
        console.log("PromoModal загружен");
    }, []);
    const navigate = useNavigate();

    const handleGoToPayments = () => {
        navigate("/", { state: { scrollToPayments: true } });
      };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    Запишитесь на полный курс по приятной цене
                </h2>

                <div className={styles.benefitBlock}>
                    <div className={styles.benefitItem}>
                        <IoLockOpenOutline className={styles.benefitIcon} />
                        Доступ ко всем обучающим модулям
                    </div>
                    <div className={styles.benefitItem}>
                        <TiBook className={styles.benefitIcon} />
                        &nbsp;Больше практических занятий и &nbsp;упражнений для закрепления знаний
                    </div>
                    <div className={styles.benefitItem}>
                        <LuPenLine className={styles.benefitIcon} />
                        Эксклюзивные материалы и интерактивные тесты
                    </div>
                </div>

                <p className={styles.subText}>
                    Откройте для себя максимум возможностей и достигайте результата быстрее!
                </p>

                <div className={styles.buttons}>
                    <button
                        className={styles.primaryButton}
                        onClick={handleGoToPayments}
                    >
                        Перейти к тарифам
                    </button>
                    <button
                        className={styles.secondaryButton}
                        onClick={() => navigate(-1)}
                    >
                        Продолжить бесплатно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoModal;
