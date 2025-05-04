import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles/LoginModal.module.css";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background || location;

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      alert("Ошибка входа. Проверьте логин и пароль.");
    }
  };

  const handleClose = () => {
    navigate(background.pathname);
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={handleClose}>X</button>
        <h2>Вход</h2>
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
        <button className={styles.modal_button} onClick={handleLogin}>Войти</button>
        <div className={styles.forgot_password}>
          <a href="/forgot-password">Забыли пароль?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
