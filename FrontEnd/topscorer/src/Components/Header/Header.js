import React from 'react'
import style from '../Header/Header.module.css'
import  icons from "../../Project_Icon/Dark.png"

function Header() {
  return (
    <>
       <div className={style.hdiv}>
         <div className={style.logo}>
            <div className={style.lg}>
            <img className='dkk' src={icons} alt="Dark Icon" />
            </div>
         </div>
         <div className={style.uprofile}>
                {/* <div className={style.login}> */}
                    <button className={style.login}>Login</button>
                {/* </div> */}  
         </div>
       </div> 
    </>
  ) 
}

export default Header