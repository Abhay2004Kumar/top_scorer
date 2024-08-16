import React from 'react';
import styles from '../Footer/Footer_main.module.css';
import { RiInstagramLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function Footer_main() {
  return (
    <div className={styles.foot_m}>
      <div className={styles.upper}>
        {/* <div  className={styles.container}> */}
        <div className={styles.uleft}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Cricket_India_Crest.svg/800px-Cricket_India_Crest.svg.png" 
            className={styles.icn} 
            alt="Cricket India Crest" 
          />
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
        {/* </div> */}
        
        <div className={styles.uright}>
          <div>
          <span className={styles.ilinks}>Important Links</span>
          </div>
          <div className={styles.LLlinks}>
            <b><RiInstagramLine style={{float:"left",marginRight:"3px "}}/> Instagram/topscorer </b>

            <b><RiInstagramLine style={{float:"left",marginRight:"3px "}}/> Instagram/topscorer </b>

            <b><RiInstagramLine style={{float:"left",marginRight:"3px "}}/> Instagram/topscorer </b>
          
          </div>
        </div>
      </div>

      <div className={styles.lower}>
        <div className={styles.lleft}>
          <h3>© Litti Chokha</h3>
        </div>
        <div className={styles.lmid}>
        <h3> Development Team</h3>
        </div>
        <div className={styles.lright}>
        <h3> IIIT Una</h3>

        </div>
      </div>
    </div>
  );
}

export default Footer_main;
