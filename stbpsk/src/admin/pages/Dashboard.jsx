import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api.config';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('+7');
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');
  const [phoneInfo, setPhoneInfo] = useState('');
  const [citiesError, setCitiesError] = useState('');
  const [citiesSuccess, setCitiesSuccess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPhone(data.phone || '+7');
      setCities(data.deliveryCities || []);
    } catch (error) {
      console.error('Ошибка при получении контента:', error);
      setPhoneError('Ошибка при загрузке данных');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('+7')) {
      setPhone(value);
    }
  };

  const handleSavePhone = async () => {
    if (phone === '+7') {
      setPhoneInfo('Телефон не был изменен');
      return;
    }

    setLoading(true);
    setPhoneError('');
    setPhoneSuccess('');
    setPhoneInfo('');

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/admin/content/phone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении телефона');
      }

      setPhoneSuccess('Телефон успешно обновлен');
    } catch (error) {
      console.error('Ошибка при сохранении телефона:', error);
      setPhoneError('Ошибка при сохранении телефона');
    } finally {
      setLoading(false);
    }
  };

  const handleCityInputChange = async (e) => {
    const value = e.target.value;
    setNewCity(value);

    if (value.length >= 2) {
      try {
        const response = await fetch(`${API_URL}/cities/search?query=${encodeURIComponent(value)}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Ошибка при поиске городов:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = (city) => {
    if (!cities.includes(city.value)) {
      setCities([...cities, city.value]);
    }
    setNewCity('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemoveCity = (cityToRemove) => {
    setCities(cities.filter(city => city !== cityToRemove));
  };

  const handleSaveCities = async () => {
    if (!Array.isArray(cities)) {
      setCitiesError('Некорректный формат данных городов');
      return;
    }

    setLoading(true);
    setCitiesError('');
    setCitiesSuccess('');

    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      console.log('Отправляем города:', cities);
      
      const response = await fetch(`${API_URL}/admin/content/cities`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deliveryCities: cities })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при сохранении списка городов');
      }

      const data = await response.json();
      console.log('Получен ответ:', data);
      
      if (Array.isArray(data.deliveryCities)) {
        setCities(data.deliveryCities);
        setCitiesSuccess('Список городов успешно обновлен');
      } else {
        throw new Error('Некорректный формат данных в ответе сервера');
      }
    } catch (error) {
      console.error('Ошибка при сохранении списка городов:', error);
      setCitiesError(error.message || 'Ошибка при сохранении списка городов');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Панель администратора</h1>
        <div className="header-buttons">
          <a href="/" className="site-button">
            Перейти на сайт
          </a>
          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Управление контентом</h2>
          
          <div className="content-section">
            <div className="content-item">
              <h3>Контактный телефон</h3>
              <div className="phone-controls">
                <input
                  type="tel"
                  className="phone-input"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={18}
                />
                <button 
                  className="save-button"
                  onClick={handleSavePhone}
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
              {phoneError && <div className="error-message">{phoneError}</div>}
              {phoneSuccess && <div className="success-message">{phoneSuccess}</div>}
              {phoneInfo && <div className="info-message">{phoneInfo}</div>}
            </div>

            <div className="content-item">
              <h3>Города для доставки</h3>
              <div className="cities-controls">
                <div className="cities-input-group">
                  <input
                    type="text"
                    className="city-input"
                    value={newCity}
                    onChange={handleCityInputChange}
                    placeholder="Введите название города"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-list">
                      {suggestions.map((city, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="cities-list">
                  {cities.map((city, index) => (
                    <div key={index} className="city-tag">
                      {city}
                      <button
                        className="remove-city-button"
                        onClick={() => handleRemoveCity(city)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="save-button"
                  onClick={handleSaveCities}
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить список городов'}
                </button>
                {citiesError && <div className="error-message">{citiesError}</div>}
                {citiesSuccess && <div className="success-message">{citiesSuccess}</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 