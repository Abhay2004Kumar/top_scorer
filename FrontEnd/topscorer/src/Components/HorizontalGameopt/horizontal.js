import React, { useState } from 'react';
import style from '../HorizontalGameopt/horizontal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faTableTennis, faBaseballBall, faSpaceShuttle, faPersonRunning ,faNewspaper} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Horizontal() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  // const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7'];

  const options = [
    { name: 'Cricket', icon: faBaseballBall, path: '/dashboard/cricket' },
    { name: 'Football', icon: faFutbol, path: '/dashboard/football' },
    { name: 'Blogs', icon: faNewspaper, path: '/dashboard/blog' },
    { name: 'Badminton', icon: faSpaceShuttle, path: '/dashboard/badminton' },
    { name: 'Badminton Doubles', icon: faSpaceShuttle, path: '/dashboard/badminton_d' },
    { name: 'Tennis', icon: faTableTennis, path: '/dashboard/tennis' },
    { name: 'Tennis Doubles', icon: faTableTennis, path: '/dashboard/tennis_d' },
    { name: 'Kabaddi', icon: faPersonRunning, path: '/dashboard/kabaddi' },
  ];

  const handleSelect = (index) => {
    setSelected(index);
    setOpen(false);
  };
 
  return (
    <div className={style.menuBar}>
      <button
        className={style.menuButton}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="games-menu"
      >
        Browse Games
      </button>

      {open && (
        <div className={style.sheetBackdrop} onClick={() => setOpen(false)}>
          <div
            id="games-menu"
            className={style.sheet}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={style.sheetHeader}>
              <h3 className={style.sheetTitle}>Select a section</h3>
              <button className={style.closeBtn} onClick={() => setOpen(false)} aria-label="Close menu">×</button>
            </div>
            <div className={style.optionGrid}>
              {options.map((option, index) => (
                <Link to={option.path} key={option.name} className={style.optionItem} onClick={() => handleSelect(index)}>
                  <span className={style.optionIcon}>
                    <FontAwesomeIcon icon={option.icon} />
                  </span>
                  <span className={style.optionLabel}>{option.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Horizontal;
