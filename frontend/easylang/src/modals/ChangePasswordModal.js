import React, { useState, useEffect } from "react";
import { changePassword, obtainNewTokens } from '../api/auth';
import styles from "./styles/ChangePasswordModal.module.css";

const ChangePasswordModal = ({ isOpen, onClose, userEmail }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    old_password: "",
    new_password: "",
    repeat_password: ""
  });

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      old_password: "",
      new_password: "",
      repeat_password: "",
    });
    setError(null);
    setSuccess(false);
    setValidationErrors({
      old_password: "",
      new_password: "",
      repeat_password: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Сбрасываем ошибку при изменении поля
    setValidationErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.old_password) {
      errors.old_password = "Введите текущий пароль";
      isValid = false;
    }

    if (!formData.new_password) {
      errors.new_password = "Введите новый пароль";
      isValid = false;
    } else if (formData.new_password.length < 8) {
      errors.new_password = "Пароль должен быть не менее 8 символов";
      isValid = false;
    }

    if (formData.new_password !== formData.repeat_password) {
      errors.repeat_password = "Пароли не совпадают";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
        repeat_password: formData.repeat_password
      });

      await obtainNewTokens(userEmail, formData.new_password);

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (err) {
      let errorMessage = "Ошибка при смене пароля";

      if (err.message.includes("Неверный текущий пароль")) {
        setValidationErrors(prev => ({
          ...prev,
          old_password: "Неверный текущий пароль"
        }));
      } else {
        errorMessage = err.message || errorMessage;
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Смена пароля</h2>

        {success ? (
          <div className={styles.alertSuccess}>
            Пароль успешно изменён!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className={styles.alertError}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <input
                type="password"
                name="old_password"
                placeholder="Старый пароль"
                value={formData.old_password}
                onChange={handleChange}
                className={`${styles.input} ${validationErrors.old_password ? styles.inputError : ""}`}
                required
              />
              {validationErrors.old_password && (
                <span className={styles.errorMessage}>
                  {validationErrors.old_password}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="password"
                name="new_password"
                placeholder="Новый пароль (минимум 8 символов)"
                value={formData.new_password}
                onChange={handleChange}
                className={`${styles.input} ${validationErrors.new_password ? styles.inputError : ""}`}
                required
                minLength="8"
              />
              {validationErrors.new_password && (
                <span className={styles.errorMessage}>
                  {validationErrors.new_password}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="password"
                name="repeat_password"
                placeholder="Повторите новый пароль"
                value={formData.repeat_password}
                onChange={handleChange}
                className={`${styles.input} ${validationErrors.repeat_password ? styles.inputError : ""}`}
                required
              />
              {validationErrors.repeat_password && (
                <span className={styles.errorMessage}>
                  {validationErrors.repeat_password}
                </span>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                type="submit"
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading ? "Сохраняем..." : "Сменить пароль"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className={styles.btnSecondary}
                disabled={loading}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;