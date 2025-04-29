import React, { useState } from "react";
import { TiThMenu } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";
import Game from "../Games/game";
import { Link, useLocation } from "react-router-dom";
import {
  faFutbol,
  faTableTennis,
  faBaseballBall,
  faSpaceShuttle,
  faPersonRunning,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const games = [
    { name: "Cricket", icon: faBaseballBall, path: "/dashboard/cricket" },
    { name: "Badminton", icon: faSpaceShuttle, path: "/dashboard/badminton" },
    { name: "Blogs", icon: faNewspaper, path: "/dashboard/blog" },
    {
      name: "Badminton Doubles",
      icon: faSpaceShuttle,
      path: "/dashboard/badminton_d",
    },
    { name: "Tennis", icon: faTableTennis, path: "/dashboard/tennis" },
    {
      name: "Tennis Doubles",
      icon: faTableTennis,
      path: "/dashboard/tennis_d",
    },
    { name: "Kabaddi", icon: faPersonRunning, path: "/dashboard/kabaddi" },
    { name: "Football", icon: faFutbol, path: "/dashboard/football" },
  ];

  return (
    <div
      className={`h-full ${
        isOpen ? "w-60" : "w-14"
      } sticky transition-all duration-300 bg-gray-100 dark:bg-gray-900 shadow-md hidden sm:block `}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        {isOpen && (
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Sports
          </h3>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 text-xl"
        >
          {isOpen ? <IoIosCloseCircle /> : <TiThMenu />}
        </button>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {games.map((game) => (
          <Link to={game.path} key={game.name} className="group">
            <Game
              name={isOpen ? game.name : ""}
              Icon={game.icon}
              isActive={location.pathname === game.path}
              isCollapsed={!isOpen}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
