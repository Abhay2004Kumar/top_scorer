import React, { useState } from 'react'
import style from '../SideBar/Sidebar.module.css'
import { TiThMenu } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";
import Game from '../Games/game'

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
                    <Game/>
                    <Game/>
                    <Game/>
                    <Game/>
                    <Game/>
                    <Game/>
                    <Game/>
                    <Game/>
                    <Game/>
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