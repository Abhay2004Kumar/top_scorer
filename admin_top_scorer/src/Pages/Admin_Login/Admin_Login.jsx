import React from 'react';
import styles from './Admin.module.css';

const image = "https://api.iiitu.ac.in/uploads/gallery/IMG_09491726633560530-294898103.webp";

function Admin_Login() {
  return (
    <div className={styles.container}>
      {/* Left side: Image */}
      <div className={styles.carousel}>
        <img
          src={image}
          alt="Carousel"
          className={styles.image}
        />
      </div>

      {/* Right side: Login Form */}
      <div className={styles.loginForm}>
        <h2 className={styles.header}>Welcome to Admin Panel</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              className={styles.input}
            />

          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
          </div>
        </form>
        <div className={styles.info}>
            If you don't know credentials please contact site owners, the score updation requirs
            admin username and password
        
        </div>
      </div>

    </div>
  );
}

export default Admin_Login;
