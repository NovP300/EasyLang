import React, { useState, useEffect } from "react";
import { changePassword, obtainNewTokens} from '../api/auth';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Смена пароля</h2>
        
        {success ? (
          <div className="alert alert-success">
            Пароль успешно изменён!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <input
                type="password"
                name="old_password"
                placeholder="Старый пароль"
                value={formData.old_password}
                onChange={handleChange}
                className={validationErrors.old_password ? "error" : ""}
                required
              />
              {validationErrors.old_password && (
                <span className="error-message">
                  {validationErrors.old_password}
                </span>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="new_password"
                placeholder="Новый пароль (минимум 8 символов)"
                value={formData.new_password}
                onChange={handleChange}
                className={validationErrors.new_password ? "error" : ""}
                required
                minLength="8"
              />
              {validationErrors.new_password && (
                <span className="error-message">
                  {validationErrors.new_password}
                </span>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="repeat_password"
                placeholder="Повторите новый пароль"
                value={formData.repeat_password}
                onChange={handleChange}
                className={validationErrors.repeat_password ? "error" : ""}
                required
              />
              {validationErrors.repeat_password && (
                <span className="error-message">
                  {validationErrors.repeat_password}
                </span>
              )}
            </div>

            <div className="modal-actions">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Сохраняем..." : "Сменить пароль"}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="btn-secondary"
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