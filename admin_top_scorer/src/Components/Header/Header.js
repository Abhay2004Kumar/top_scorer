import React from 'react';
import style from '../Header/Header.module.css';

function Header() {
  const navigateTo = (path) => {
    window.location.href = path;  // Simple navigation using window.location
  };

  return (
    <>
      {/* Header Section */}
      <header className={style.Header}>
        <div className={style.Logo}>
          <img src="/logo.png" alt="Logo" />  {/* Replace with your logo path */}
          <h1>Sports Admin</h1>
        </div>
        <nav className={style.Nav}>
          <button className={style.Nav_Button} onClick={() => navigateTo('/')}>Home</button>
          <button className={style.Nav_Button} onClick={() => navigateTo('/signin')}>Sign In</button>
        </nav>
      </header>

      {/* Horizontal Bar for Sports Options */}
      <div className={style.Sports_Bar}>
        <button className={style.Sports_Button} onClick={() => navigateTo('/kabbadi')}>Kabbadi</button>
        <button className={style.Sports_Button} onClick={() => navigateTo('/football')}>Football</button>
        <button className={style.Sports_Button} onClick={() => navigateTo('/Badminton')}>Badminton</button>
        <button className={style.Sports_Button} onClick={() => navigateTo('/BadmintonDoubles')}>Badminton_D</button>

        <button className={style.Sports_Button} onClick={() => navigateTo('/tennis')}>Tennis</button>
        <button className={style.Sports_Button} onClick={() => navigateTo('/Badminton')}>Tennis_D</button>
        <button className={style.Sports_Button} onClick={() => navigateTo('/cricket')}>Cricket</button>
      </div>
    </>
  );
}

export default Header;
