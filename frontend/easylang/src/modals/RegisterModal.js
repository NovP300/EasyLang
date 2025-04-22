import React, { useState, useEffect } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterModal = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен быть не короче 8 символов.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Введите корректный email.");
      return;
    }

    try {
      await register(email, username, password);
      navigate("/profile");
    } catch (error) {
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
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "90%",
        }}
      >
        <button onClick={handleClose} style={{ float: "right" }}>X</button>
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
        <button onClick={handleRegister}>Зарегистрироваться</button>
      </div>
    </div>
  );
};

export default RegisterModal;
