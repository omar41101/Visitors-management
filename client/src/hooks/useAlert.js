import { useState, useCallback } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const showAlert = useCallback((message, type = 'info', autoClose = true, autoCloseTime = 5000) => {
    setAlert({
      isVisible: true,
      message,
      type,
      autoClose,
      autoCloseTime
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  }, []);

  const showSuccess = useCallback((message, autoClose = true, autoCloseTime = 5000) => {
    showAlert(message, 'success', autoClose, autoCloseTime);
  }, [showAlert]);

  const showError = useCallback((message, autoClose = true, autoCloseTime = 5000) => {
    showAlert(message, 'error', autoClose, autoCloseTime);
  }, [showAlert]);

  const showWarning = useCallback((message, autoClose = true, autoCloseTime = 5000) => {
    showAlert(message, 'warning', autoClose, autoCloseTime);
  }, [showAlert]);

  const showInfo = useCallback((message, autoClose = true, autoCloseTime = 5000) => {
    showAlert(message, 'info', autoClose, autoCloseTime);
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useAlert; 