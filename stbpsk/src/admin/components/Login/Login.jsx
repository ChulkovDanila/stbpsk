import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Проверяем наличие токена при загрузке компонента
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!username.trim()) {
      setError('Пожалуйста, введите имя пользователя');
      return false;
    }
    if (!password.trim()) {
      setError('Пожалуйста, введите пароль');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токен в зависимости от выбора "Запомнить меня"
        if (rememberMe) {
          localStorage.setItem('adminToken', data.token);
        } else {
          sessionStorage.setItem('adminToken', data.token);
        }
        // Перенаправляем на dashboard
        navigate('/admin/dashboard');
      } else {
        switch (response.status) {
          case 400:
            setError('Необходимо указать имя пользователя и пароль');
            break;
          case 401:
            setError('Неверное имя пользователя или пароль');
            break;
          case 403:
            setError('Доступ запрещен. У вас нет прав для входа в панель администратора');
            break;
          case 404:
            setError('Пользователь не найден');
            break;
          case 429:
            setError('Слишком много попыток входа. Попробуйте позже');
            break;
          default:
            setError(data.message || 'Произошла ошибка при входе. Попробуйте позже');
        }
      }
    } catch (err) {
      if (!navigator.onLine) {
        setError('Отсутствует подключение к интернету. Проверьте ваше соединение');
      } else if (err.name === 'TypeError') {
        setError('Не удалось подключиться к серверу. Проверьте, запущен ли сервер');
      } else {
        setError('Произошла непредвиденная ошибка. Попробуйте позже');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left-section"></div>
      <div className="right-section"></div>
      <div className="login-container">
        <h1 className="login-title">ПАНЕЛЬ УПРАВЛЕНИЯ</h1>
        <h2 className="login-subtitle">Вход в систему</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Имя пользователя" 
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute('readonly')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Пароль" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoComplete="off"
              readOnly
              onFocus={(e) => e.target.removeAttribute('readonly')}
              required
              disabled={isLoading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="login-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Запомнить меня</label>
            </div>
            <div className="forgot-password-container">
              <a href="#" className="forgot-password">Забыли пароль?</a>
            </div>
          </div>
          <div className="button-container">
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 