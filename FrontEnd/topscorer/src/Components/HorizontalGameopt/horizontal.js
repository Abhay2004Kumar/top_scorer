import React, { useState } from 'react';
import style from '../HorizontalGameopt/horizontal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faTableTennis, faBaseballBall, faSpaceShuttle, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Horizontal() {
  const [selected, setSelected] = useState(null);

  // const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7'];

  const options = [
    { name: 'Cricket', icon: faBaseballBall, path: '/cricket' },
    { name: 'Football', icon: faFutbol, path: '/football' },
    { name: 'Badminton', icon: faSpaceShuttle, path: '/badminton' },
    { name: 'Badminton Doubles', icon: faSpaceShuttle, path: '/badminton_d' },
    { name: 'Tennis', icon: faTableTennis, path: '/tennis' },
    { name: 'Tennis Doubles', icon: faTableTennis, path: '/tennis_d' },
    { name: 'Kabaddi', icon: faPersonRunning, path: '/kabaddi' },
  ];

  const handleSelect = (index) => {
    setSelected(index);
  };
 
  return (
    <div className={style.scrollContainer}>
      {options.map((option, index) => (
        <Link to={option.path}>
        <button 
          key={index} 
          className={`${style.scrollButton} ${selected === index ? style.selected : ''}`}
          onClick={() => handleSelect(index)}
        >
        <FontAwesomeIcon icon={option.icon} style={{ float: 'left', marginRight: '1px' }} />
          {option.name}
        </button>
        </Link>
      ))}
    </div>
  );
}

export default Horizontal;
