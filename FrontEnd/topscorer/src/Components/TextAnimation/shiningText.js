import React from "react";
import styles from "./ShiningText.module.css";

const ShiningText = ({text}) => {
  return (
    <div className={styles.container}>
      <p className={styles.shiningText}>{text}</p>
    </div>
  );
};

export default ShiningText;
