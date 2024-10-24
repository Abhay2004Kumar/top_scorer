import React from 'react';
import style from '../Games/game.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Game({ name, Icon }) {
  
  return (
    <button className={style.option}>
      
        <FontAwesomeIcon icon={Icon} style={{ float: 'left', marginRight: '3px' }} />
      <b>{name}</b>
    </button>
  );
}

export default Game;
