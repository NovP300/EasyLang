import React, { useState } from "react";
import styles from "./Style (css)/Payment.module.css"; // создашь или переиспользуешь стили
import { updateUserSubscription } from "../api/profile"; // функция, которую нужно будет сделать

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    email: "",
    plan: "1", // по умолчанию 1 месяц
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState('');

  const prices = {
    month: {
      label: "1 месяц - 329₽/мес, списание ежемесячно",
      amount: "К оплате: 329₽"
    },
    half_year: {
      label: "6 месяцев - 1494₽ (249₽/мес), списание раз в полгода",
      amount: "К оплате: 1494₽"
    },
    year: {
      label: "12 месяцев - 2388₽ (199₽/мес), списание раз в год",
      amount: "К оплате: 2388₽"
    }
  };

  const planDurations = {
    month: 1,
    half_year: 6,
    year: 12
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      // Убираем все нецифры и добавляем пробелы каждые 4 цифры
      const clean = value.replace(/\D/g, "").slice(0, 16);
      const formatted = clean.match(/.{1,4}/g)?.join(" ") || "";
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }

    else if (name === "expiry") {
      // Автоформатирование MM/YY
      const clean = value.replace(/\D/g, "").slice(0, 4);
      let formatted = clean;
      if (clean.length >= 3) {
        formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    }

    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Неверный номер карты";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = "Введите срок в формате ММ/ГГ";
    }

    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Неверный CVV";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный email";
    }

    if (!formData.plan) {
      newErrors.plan = "Выберите тариф";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {

      await updateUserSubscription(planDurations[formData.plan]);
      setMessage("Оплата прошла успешно! Подписка активирована.");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при обработке оплаты");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Оплата курса</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Номер карты</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX XXXX"
          />
          {errors.cardNumber && <p className={styles.error}>{errors.cardNumber}</p>}
        </div>

        <div className={styles.row}>
          <div className={styles.halfInput}>
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/ГГ"
            />
            {errors.expiry && <p className={styles.error}>{errors.expiry}</p>}
          </div>

          <div className={styles.halfInput}>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              maxLength={4}
              placeholder="CVV2/CVC2"
            />
            {errors.cvv && <p className={styles.error}>{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <label>Информация для оплаты</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email-адрес"
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div>
          <label>Тариф:</label>
          <select name="plan" value={formData.plan} onChange={handleChange} required>
            <option value="">Выберите тариф</option>
            <option value="month">{prices.month.label}</option>
            <option value="half_year">{prices.half_year.label}</option>
            <option value="year">{prices.year.label}</option>
          </select>
          {errors.plan && <p className={styles.error}>{errors.plan}</p>}

          {formData.plan && prices[formData.plan] && (
            <div style={{ marginTop: "15px", fontWeight: "bold" }}>
              {prices[formData.plan].amount}
            </div>
          )}
        </div>

        <button type="submit" className={styles.submit}>Оплатить</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
