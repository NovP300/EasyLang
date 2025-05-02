// frontend/components/ChangePasswordModal.jsx
import React, { useState } from "react";
import { refreshTokenAfterPasswordChange, changePassword } from "../api/auth";

const ChangePasswordModal = ({ isOpen, onClose, userEmail }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await changePassword(formData);
      await refreshTokenAfterPasswordChange(userEmail, formData.new_password);
      alert("Пароль успешно изменён!");
      setFormData({ old_password: "", new_password: "", repeat_password: "" });
      onClose();
    } catch (err) {
      const serverError = err.response?.data || {};
      const errorMessage =
        serverError.detail ||
        Object.values(serverError).flat().join(" ") ||
        err.message;

      console.error("Ошибка при смене пароля:", errorMessage);
      alert("Ошибка при смене пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Смена пароля</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="old_password"
            placeholder="Старый пароль"
            value={formData.old_password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="new_password"
            placeholder="Новый пароль"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="repeat_password"
            placeholder="Повторите новый пароль"
            value={formData.repeat_password}
            onChange={handleChange}
            required
          />
          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Сохраняем..." : "Сменить"}
            </button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
