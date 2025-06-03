import React, { useState, useEffect } from 'react';
import './Home.css';
import locationIcon from '../assets/IconLocation.png';
import orderIcon from '../assets/free-icon-order-history-10967216.png';

const Home = () => {
  const [phone, setPhone] = useState('+7');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPhone();
    fetchCities();
  }, []);

  const fetchPhone = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/public/phone');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const data = await response.json();
      console.log('Полученные данные:', data); // Для отладки
      if (data.phone) {
        setPhone(data.phone);
      }
    } catch (error) {
      console.error('Ошибка при получении телефона:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/public/cities');
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const data = await response.json();
      if (data.cities && data.cities.length > 0) {
        setCities(data.cities);
        setSelectedCity(data.cities[0]);
      }
    } catch (error) {
      console.error('Ошибка при получении городов:', error);
    }
  };

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      <div className="top-bar">
        <div className="contact-info">
          <span className="working-hours">Круглосуточно:</span>
          <a href={`tel:${phone}`} className="phone-link">{phone}</a>
        </div>
        <div className="location-block" onClick={() => setIsModalOpen(true)}>
          <img src={locationIcon} alt="Location" className="location-icon" />
          <span className="selected-city">{selectedCity}</span>
          <span className={`arrow ${isModalOpen ? 'arrow-up' : ''}`}>▼</span>
        </div>
        <div className="orders-block">
          <img src={orderIcon} alt="Orders" className="order-icon" />
          <a href="#" className="orders-link">Заказы</a>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Выберите город</h3>
              <input
                type="text"
                placeholder="Поиск города..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="city-search"
              />
            </div>
            <div className="cities-list">
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  className={`city-item ${city === selectedCity ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsModalOpen(false);
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 