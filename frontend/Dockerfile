# Используем официальный образ Node.js
FROM node:18-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json, если есть
COPY ./easylang/package.json ./easylang/package-lock.json* /app/

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY easylang /app/

# Открываем порт 3000 для React-приложения
EXPOSE 3000

# Запускаем приложение
CMD ["sh", "-c", "npm install && npm start"]
