import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/profile";
import { useNavigate } from "react-router-dom";
import styles from "./Style (css)/Profile.module.css";
import ChangePasswordModal from "../modals/ChangePasswordModal";

const Profile = () => {

  console.log("Компонент Profile загружен");



  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    gender: "Женский",
    birth_date: "",
    old_password: "",
    new_password: "",
    repeat_password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // Проверка наличия токена при загрузке
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      const data = await getProfile();
      if (!data) {
        navigate("/");
      } else {
        setUser(data);
        setFormData((prev) => ({
          ...prev,
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          gender: data.gender || "F",
          birth_date: data.birth_date || "",
        }));
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};


    if (!formData.first_name.trim()) {
      errors.first_name = "Имя обязательно.";
    } else if (formData.first_name.trim().length < 2) {
      errors.first_name = "Имя должно содержать минимум 2 буквы.";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Фамилия обязательна.";
    } else if (formData.last_name.trim().length < 2) {
      errors.last_name = "Фамилия должна содержать минимум 2 буквы.";
    }

    if (!formData.username.trim()) errors.username = "Логин обязателен.";

    if (!formData.email.trim()) {
      errors.email = "Email обязателен.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Неверный формат email.";
      }
    }

    if (formData.birth_date) {
      const today = new Date().toISOString().split("T")[0];
      if (formData.birth_date > today) {
        errors.birth_date = "Дата рождения не может быть в будущем.";
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const dataToSend = {
      ...formData,
      birth_date: formData.birth_date?.trim() === "" ? null : formData.birth_date,
    };

    try {
      await updateProfile(dataToSend);
      alert("Профиль успешно обновлён!");
    } catch (error) {
      alert("Ошибка при обновлении профиля.");
      console.error("Ошибка при сохранении:", error);
    }
  };



  const handleCancel = () => {
    navigate("/");
  };
  if (!user) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Мои данные</h2>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Имя</label>
          <input
            className={`${styles.input} ${formErrors.first_name ? styles.inputError : ""}`}
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {formErrors.first_name && <div className={styles.error}>{formErrors.first_name}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Фамилия</label>
          <input
            className={`${styles.input} ${formErrors.last_name ? styles.inputError : ""}`}
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {formErrors.last_name && <div className={styles.error}>{formErrors.last_name}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Логин</label>
          <input
            className={`${styles.input} ${formErrors.username ? styles.inputError : ""}`}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {formErrors.username && <div className={styles.error}>{formErrors.username}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email*</label>
          <input
            className={`${styles.input} ${formErrors.email ? styles.inputError : ""}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <div className={styles.error}>{formErrors.email}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Пол</label>
          <select
            className={styles.select}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="F">Женский</option>
            <option value="M">Мужской</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Дата рождения</label>
          <input
            className={`${styles.input} ${formErrors.birth_date ? styles.inputError : ""}`}
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
          {formErrors.birth_date && <div className={styles.error}>{formErrors.birth_date}</div>}
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>Сохранить</button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>Отмена</button>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setShowPasswordModal(true)}
          >
            Сменить пароль
          </button>
        </div>
      </form>


      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        userEmail={formData.email}
      />


    </div>
  );
};

export default Profile;
