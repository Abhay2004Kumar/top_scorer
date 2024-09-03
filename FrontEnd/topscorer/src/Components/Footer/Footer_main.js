import React from 'react';
import styles from '../Footer/Footer_main.module.css';
import { RiInstagramLine } from "react-icons/ri";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TermsAndConditions from '../TnC/Tnc';
import icons from '../../Project_Icon/Dark.png';
 
function Footer_main() {
  return (
    <div className={styles.foot_m}>
      <div className={styles.upper}>
        <div className={styles.uleft}>
          {/* <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Cricket_India_Crest.svg/800px-Cricket_India_Crest.svg.png" 
            className={styles.icn} 
            alt="Cricket India Crest" 
          /> */}
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={icons} alt="Dark Icon" />
        {/* <h1 className={styles.title}>Sports Updates</h1> */}
      </div>
        </div>

        <div className={styles.umid}>
          <h1>Get In Touch</h1>
          <form className={styles.form}>
            <input type='text' placeholder='Name' className={styles.uinp} />
            <input type='email' placeholder='Email' className={styles.emid} />
            <textarea placeholder='Type your message here' className={styles.msg_box} />
            <div className={styles.btnContainer}>
              <button className={styles.sb_btn}>Submit</button>
            </div>
          </form>
        </div>
        
        <div className={styles.uright}>
          <h2 className={styles.ilinks}>Important Links</h2>
          <div className={styles.LLlinks}>
            <a href="https://instagram.com/#" className={styles.link}>
              <RiInstagramLine className={styles.icon} /> Instagram
            </a>
            <a href="https://linkedin.com/in/#" className={styles.link}>
              <FaLinkedin className={styles.icon} /> LinkedIn
            </a>
            <a href="https://github.com/#" className={styles.link}>
              <FaGithub className={styles.icon} /> GitHub
            </a>
          </div>
        </div>
      </div>

      <div className={styles.lower}>
        <div className={styles.lleft}>
          <h3>© Litti Chokha</h3>
        </div>
        <div className={styles.lmid}>
          <a href="/dev++" className={styles.link}>Development Team</a>
        </div>
        <div className={styles.lright}>
          <a href="/tnc" className={styles.link}>Terms and Conditions</a>
        </div>
      </div>
    </div>
  );
}

export default Footer_main;
