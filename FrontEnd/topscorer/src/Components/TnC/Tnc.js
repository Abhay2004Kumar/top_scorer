import React from 'react';
import styles from './Tnc.module.css';

const date = new Date(); // Get the current date and time
const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
const formattedDate = date.toLocaleDateString('en-US', options);



function TermsAndConditions() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Terms and Conditions</h1>
      <p className={styles.updated}>Last updated: {formattedDate}</p>

      <div className={styles.cards}>
        <section className={styles.card}>
          <h2 className={styles.subheading}>1. General</h2>
          <p>
            Welcome to Top Scorer. By accessing and using this website, you agree to be bound by these terms and conditions. 
            If you do not agree with any part of these terms, you should not use our website.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.subheading}>2. User Obligations</h2>
          <p>
            Users are required to provide accurate and up-to-date information when creating an account. 
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.subheading}>3. Intellectual Property Rights</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of [Your Website Name] 
            and is protected by intellectual property laws.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.subheading}>4. Limitation of Liability</h2>
          <p>
            [Your Website Name] is not responsible for any direct or indirect damages arising from the use or inability to use the website. 
            We do not guarantee the accuracy, completeness, or timeliness of the information provided.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.subheading}>5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. 
            It is your responsibility to review the terms regularly.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.subheading}>6. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of [Your Country/State].
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.subheading}>7. Contact Us</h2>
          <p>
            If you have any questions or concerns about these terms, please contact us at [Your Contact Information].
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsAndConditions;
