import React from 'react';
import style from '../Footer/Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import the desired icons
// import logo from '../../assets/logo.svg'; // Adjust the path to your logo file

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.logoContainer}>
          <img src='https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FIndian_Institute_of_Information_Technology%2C_Una&psig=AOvVaw2uHGvmMJUJAnS7xsNV_P2V&ust=1728374658229000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCODl6r3n-4gDFQAAAAAdAAAAABAE' alt="Logo" className={style.logo} />
        </div>
        <div className={style.info}>
          <p>&copy; 2024 Sports Admin. All rights reserved.</p>
          <p>Contact: info@sportsadmin.com</p>
          <p>Follow us on social media:</p>
          <div className={style.socialMedia}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
