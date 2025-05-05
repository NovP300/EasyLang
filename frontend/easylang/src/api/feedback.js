import axiosInstance from './axiosInstance';

export const submitFeedback = async (formData) => {
  try {
    const response = await axiosInstance.post('/feedback/', formData);
    return {
      success: true,
      message: response.data.message || 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Произошла ошибка при отправке формы'
    };
  }
};

export const getAllFeedbacks = async () => {
  try {
    const response = await axiosInstance.get('/feedback/');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении заявок:', error);
    throw new Error('Не удалось загрузить заявки');
  }
};

export const updateFeedbackStatus = async (id, isDone) => {
  try {
    const response = await axiosInstance.patch(`/feedbacks/${id}/update-status/`, {
      is_done: isDone,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    throw new Error("Не удалось обновить статус заявки");
  }
};