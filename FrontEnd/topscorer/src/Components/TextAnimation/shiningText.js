import React from "react";
import styles from "./ShiningText.module.css";

const ShiningText = ({ children }) => {
  return (
    <div className={styles.container}>
      <p className={styles.shiningText}>{children}</p>
    </div>
  );
};

export default ShiningText;
