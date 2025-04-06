import React from 'react';
import style from '../Games/game.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Game({ name, Icon, isActive }) {
  return (
    <button
      className={`${style.option} ${isActive ? style.active : ''}`}
    >
      <FontAwesomeIcon
        icon={Icon}
        style={{ float: 'left', marginRight: '3px', marginTop: '2px' }}
      />
      {name}
    </button>
  );
}

export default Game;
