import React from 'react'
import style from '../SideBar/Sidebar.module.css'
import Game from '../Games/game'

function Sidebar() {
  return (
    <>
        <div className={style.sidemenu}>
            
            <div className={style.sport}>
                <div className={style.sp}>
                    <div><h4>Sports</h4></div>
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
        </div>
    </>
  )
}

export default Sidebar