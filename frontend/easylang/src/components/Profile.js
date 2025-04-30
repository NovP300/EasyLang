import React, { useState, useEffect } from "react";
import { getProfile, logout } from "../api/profile";
import { useNavigate } from "react-router-dom";
import styles from "./Style (css)/Profile.module.css";

const Profile = () => {
  console.log("Компонент Profile загружен");

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "Женский",
    birth_date: "",
    old_password: "",
    new_password: "",
    repeat_password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка наличия токена при загрузке
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login"); // Если токен отсутствует, перенаправляем на страницу логина
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
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          gender: data.gender || "Женский",
          birth_date: data.birth_date || "",
        }));
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Форма отправлена"); // Проверка
    console.log("Данные для отправки:", formData);
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
          <label className={styles.label}>Имя*</label>
          <input
            className={styles.input}
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Фамилия*</label>
          <input
            className={styles.input}
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email*</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Пол</label>
          <select
            className={styles.select}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Женский">Женский</option>
            <option value="Мужской">Мужской</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Дата рождения</label>
          <input
            className={styles.input}
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Старый пароль</label>
          <input
            className={styles.input}
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Новый пароль</label>
          <input
            className={styles.input}
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Повторите пароль</label>
          <input
            className={styles.input}
            type="password"
            name="repeat_password"
            value={formData.repeat_password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            Сохранить
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
