import React, { useState } from 'react';
import style from '../HorizontalGameopt/horizontal.module.css';

function Horizontal() {
  const [selected, setSelected] = useState(null);

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7'];

  const handleSelect = (index) => {
    setSelected(index);
  };

  return (
    <div className={style.scrollContainer}>
      {options.map((option, index) => (
        <button 
          key={index} 
          className={`${style.scrollButton} ${selected === index ? style.selected : ''}`}
          onClick={() => handleSelect(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Horizontal;
