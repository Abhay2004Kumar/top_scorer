import React, { useState } from 'react'
import style from '../SideBar/Sidebar.module.css'
import { TiThMenu } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";
import Game from '../Games/game'
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isopen,setisopen] = useState(true);
  const toggleSidebar  = () =>{
    setisopen(!isopen);
  }
  return (
    <>
        <div className={style.sidemenu}>    
            {isopen? (

              <div className={style.sport}>
                <div className={style.sp}>
                    <div><h4>Sports <button onClick={toggleSidebar} className={style.close}><IoIosCloseCircle className={style.close} />
                                </button> </h4></div>
                    
                    <div className={style.opt}>
                    <Link to={'/cricket'}><Game/></Link>
                    <Link to={'/football'}><Game/></Link>
                    <Link to={'/badminton'}><Game/></Link>
                    <Link to={'/badminton_d'}><Game/></Link>
                    <Link to={'/tennis'}><Game/></Link>
                    <Link to={'/tennis_d'}><Game/></Link>
                    <Link to={'/kabaddi'}><Game/></Link>
              
                  </div>
                </div>
                  <div className={style.space}></div>
            </div>
            ):
             (
              <div className={style.menu}>
                <button onClick={toggleSidebar}><TiThMenu className={style.menu}/></button>
              </div>
             )
            }
            
        </div>
    </>
  )
}

export default Sidebar