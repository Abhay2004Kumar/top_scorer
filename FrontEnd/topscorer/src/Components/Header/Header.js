import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import icons from '../../Project_Icon/Dark.png';

function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={icons} alt="Dark Icon" />
        {/* <h1 className={styles.title}>Sports Updates</h1> */}
      </div>
      <nav className={styles.nav}>
        <a href="/" className={styles.navLink}>Home</a>
        <a href="/chat" className={styles.navLink}>Chat</a>
        <button className={styles.login} onClick={handleLoginClick}>Login</button>
      </nav>
    </header>
  );
}

export default Header;
