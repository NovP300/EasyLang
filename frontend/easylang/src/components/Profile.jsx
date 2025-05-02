import React, { useState, useEffect } from "react";
import { getProfile, updateProfile} from "../api/profile";
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
  };

  const handleSubmit = async (e) => {

  
    const dataToSend = {
      ...formData,
      //gender: genderMap[formData.gender] || null,
      birth_date: formData.birth_date?.trim() === "" ? null : formData.birth_date
    };

    e.preventDefault();
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
            className={styles.input}
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Фамилия</label>
          <input
            className={styles.input}
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Логин</label>
          <input
            className={styles.input}
            type="text"
            name="username"
            value={formData.username}
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
            <option value="F">Женский</option>
            <option value="M">Мужской</option>
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

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            Сохранить
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Отмена
          </button>
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
