import React from 'react';
import './CatalogButton.css';
import catalogIcon from '../../assets/Group 1.svg';
import searchButton from '../../assets/Subtract.svg';
import likeIcon from '../../assets/free-icon-like-3641323.png';
import taskIcon from '../../assets/free-icon-task-list-11278271.png';
import accountIcon from '../../assets/free-icon-my-account-17200091.png';
import cartIcon from '../../assets/free-icon-shopping-cart-11303089.png';

const CatalogButton = () => {
  const handleSearchClick = () => {
    alert('Сайт находится в разработке. Функция поиска будет доступна в ближайшее время. Спасибо за понимание!');
  };

  return (
    <div className="search-container">
      <button className="catalog-button">
        <img src={catalogIcon} alt="Каталог" className="catalog-icon" />
        <span>Каталог</span>
      </button>
      <div className="search-box">
        <input type="text" className="search-input" placeholder="Фанера ФК 18мм | 1525 х 1525" />
        <div className="search-svg-wrapper" onClick={handleSearchClick}>
          <img src={searchButton} alt="Найти" className="search-button" />
          <span className="search-text">Найти</span>
        </div>
      </div>
      <div className="icons-container">
        <div className="icon-item">
          <img src={likeIcon} alt="Избранное" />
          <span>Избранное</span>
        </div>
        <div className="icon-item">
          <img src={taskIcon} alt="Список задач" />
          <span>Смета</span>
        </div>
        <div className="icon-item">
          <img src={accountIcon} alt="Аккаунт" />
          <span>Войти</span>
        </div>
        <div className="icon-item">
          <img src={cartIcon} alt="Корзина" />
          <span>Корзина</span>
        </div>
      </div>
    </div>
  );
};

export default CatalogButton; 