import React from 'react';
import './Info.css';
import adressIcon from '../assets/IconLocation.png';
import CatalogButton from '../components/CatalogButton/CatalogButton';

const Info = () => {
  const handleAddressClick = () => {
    const address = 'Московская обл., г. Электросталь, ул. Горького, 41А';
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank');
  };

  return (
    <div className="info">
      <div className="top-bar">
        <div className="contact-info">
          <div className="working-hours">
            <span>Круглосуточно</span>
            <a href="tel:+74951234567" className="phone-link">+7 (495) 123-45-67</a>
          </div>
        </div>
        <button className="adress-button" onClick={handleAddressClick}>
          <img src={adressIcon} alt="Адрес" className="order-icon" />
          <span>Московская обл., г. Электросталь, ул. Горького, 41А</span>
        </button>
      </div>
      <div className="catalog-block">
        <CatalogButton />
      </div>
    </div>
  );
};

export default Info; 