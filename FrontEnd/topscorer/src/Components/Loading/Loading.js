// Loading.js
import React from 'react';
import { FaSpinner } from 'react-icons/fa'; // Import a spinner icon
import styles from '../Loading/Loading.module.css'

const Loading = () => {
  return (
    <div className={styles.loading}>
      <FaSpinner className={styles.spinner} />
    </div>
  );
};

export default Loading;
