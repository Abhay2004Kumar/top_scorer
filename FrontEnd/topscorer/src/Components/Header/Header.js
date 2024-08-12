import React from 'react'
import style from '../Header/Header.module.css'

function Header() {
  return (
    <>
       <div className={style.hdiv}>
         <div className={style.logo}>
            <div className={style.lg}>
                <h2>LOGO</h2>
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