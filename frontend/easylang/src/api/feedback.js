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