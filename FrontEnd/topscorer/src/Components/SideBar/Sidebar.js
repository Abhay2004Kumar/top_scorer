import React, { useState } from 'react';
import style from '../SideBar/Sidebar.module.css';
import { TiThMenu } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";
import Game from '../Games/game';
import { Link, useLocation } from 'react-router-dom';
import { faFutbol, faTableTennis, faBaseballBall, faSpaceShuttle, faPersonRunning , faNewspaper  } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const games = [
    { name: 'Badminton', icon: faSpaceShuttle, path: '/dashboard/badminton' },
    { name: 'Blogs', icon: faNewspaper, path: '/dashboard/blog' },
    { name: 'Badminton Doubles', icon: faSpaceShuttle, path: '/dashboard/badminton_d' },
    { name: 'Tennis', icon: faTableTennis, path: '/dashboard/tennis' },
    { name: 'Tennis Doubles', icon: faTableTennis, path: '/dashboard/tennis_d' },
    { name: 'Kabaddi', icon: faPersonRunning, path: '/dashboard/kabaddi' },
    { name: 'Football', icon: faFutbol, path: '/dashboard/football' },
    { name: 'Cricket', icon: faBaseballBall, path: '/dashboard/cricket' },
  ];

  return (
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
                  <Game
                    name={game.name}
                    Icon={game.icon}
                    isActive={location.pathname === game.path}
                  />
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
  );
}

export default Sidebar;
