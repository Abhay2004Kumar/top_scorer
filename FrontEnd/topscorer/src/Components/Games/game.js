import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Game({ name, Icon, isActive, isCollapsed }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all 
        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}
      `}
    >
      <i className="w-5">
        <FontAwesomeIcon icon={Icon} />
      </i>
      {!isCollapsed && <span className="text-sm font-medium">{name}</span>}
    </div>
  );
}


export default Game;