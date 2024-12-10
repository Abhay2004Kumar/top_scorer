import React from 'react';
import styles from '../Comment_Box/Comment_Box.module.css';
import { RxAvatar } from "react-icons/rx";

export default function Comment_Box({user,mssg,createdAt}) {
  return (
    <div className={styles.box}>
      <div className={styles.avatar}>
        <RxAvatar />
      </div>
      <div className={styles.commentDetails}>
        <div className={styles.name}>{user}</div>
       
        <div className={styles.commentText}>{mssg}</div>
      </div>
    </div>
  );
}
