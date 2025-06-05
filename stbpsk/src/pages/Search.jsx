import React from 'react';
import './Search.css';
import likeIcon from '../assets/free-icon-like-3641323.png';

const Search = () => {
  return (
    <div className="search">
      <img src={likeIcon} alt="Избранное" className="like-icon" />
    </div>
  );
};

export default Search; 