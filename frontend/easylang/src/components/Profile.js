import React, { useState, useEffect } from "react";
import { getProfile, logout } from "../api/profile";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  console.log("Компонент Profile загружен");

  const [user, setUser] = useState(null);
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
        navigate("/login"); // Если данные не получены, перенаправляем на логин
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    logout(); // Удаляем токен при выходе
    navigate("/"); // Перенаправляем на страницу логина
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Привет, {user.username}!</h1>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Выйти</button>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default Profile;
