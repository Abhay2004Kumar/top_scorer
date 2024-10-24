import React, { useState } from 'react';
import style from '../SideBar/Sidebar.module.css';
import { TiThMenu } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";
import Game from '../Games/game';
import { Link } from 'react-router-dom';
import { faFutbol, faTableTennis, faBaseballBall, faSpaceShuttle, faPersonRunning } from '@fortawesome/free-solid-svg-icons';


function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const games = [
    { name: 'Cricket', icon: faBaseballBall, path: '/cricket' },
    { name: 'Football', icon: faFutbol, path: '/football' },
    { name: 'Badminton', icon: faSpaceShuttle, path: '/badminton' },
    { name: 'Badminton Doubles', icon: faSpaceShuttle, path: '/badminton_d' },
    { name: 'Tennis', icon: faTableTennis, path: '/tennis' },
    { name: 'Tennis Doubles', icon: faTableTennis, path: '/tennis_d' },
    { name: 'Kabaddi', icon: faPersonRunning, path: '/kabaddi' },
  ];

  return (
    <>
      <div className={style.sidemenu}>
        {isOpen ? (
          <div className={style.sport}>
            <div className={style.sp}>
              <div>
                <h4>
                  Sports{' '}
                  <button onClick={toggleSidebar} className={style.close}>
                    <IoIosCloseCircle className={style.close} />
                  </button>
                </h4>
              </div>
              <div className={style.opt}>
                {games.map((game) => (
                  <Link to={game.path} key={game.name}>
                    <Game name={game.name} Icon={game.icon} />
                  </Link>
                ))}
              </div>
            </div>
            <div className={style.space}></div>
          </div>
        ) : (
          <div className={style.menu}>
            <button onClick={toggleSidebar}>
              <TiThMenu className={style.menu} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
