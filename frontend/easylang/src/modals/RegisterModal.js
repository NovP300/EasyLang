import React, { useState, useEffect } from "react";
import { register } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles/LoginModal.module.css";
import { Link } from "react-router-dom";
import { applyTestResults } from "../api/progress";


const languageMapping = {
  english: 1,
  german: 2,
  french: 3,
  spanish: 4,
};


const RegisterModal = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background || location;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleClose = () => {
    navigate(background.pathname);
  };

  const handleRegister = async () => {
    if (!email || !username || !password || !repeatPassword) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен быть не короче 8 символов.");
      return;
    }

    if (password !== repeatPassword) {
      alert("Пароли не совпадают.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Введите корректный email.");
      return;
    }

    try {
      // 1. Регистрация
      await register(email, username, password);
  
      // 2. Пытаемся применить тестовые результаты
      const { applied, languageId, error } = await applyTestResults();
      const savedTest = JSON.parse(localStorage.getItem('pendingTestResults'));
  
      // 3. Редирект с учётом контекста
      if (applied && savedTest?.isAfterTest) {
        const languageSlug = Object.keys(languageMapping).find(
          key => languageMapping[key] === languageId
        ) || 'english';
        
        navigate(`/languages/${languageSlug}`, {
          state: { fromTest: true }
        });
      } else {
        navigate("/profile", {
          state: {
            message: applied 
              ? "Регистрация успешна!" 
              : `Регистрация успешна, но: ${error || "не удалось применить прогресс теста"}`,
          }
        });
      }
  
      // 4. Очистка независимо от результата
      localStorage.removeItem('pendingTestResults');
  
    } 
    catch (error) {
      const data = error.response?.data;
      const errors = [];

      if (data?.email) errors.push(`Email: ${data.email.join(" ")}`);
      if (data?.username) errors.push(`Имя пользователя: ${data.username.join(" ")}`);
      if (data?.password) errors.push(`Пароль: ${data.password.join(" ")}`);
      if (data?.non_field_errors) errors.push(data.non_field_errors.join(" "));
      if (!errors.length && data?.detail) errors.push(data.detail);

      alert(errors.length ? errors.join("\n") : "Ошибка регистрации. Проверьте данные.");
    }
  };



  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={handleClose}>X</button>
        <h2>Регистрация</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button className={styles.modal_button} onClick={handleRegister}>Зарегистрироваться</button>

        <div className={styles.forgot_password}>
          <Link to="/login" state={{ background }}>
            У меня уже есть аккаунт
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterModal;
