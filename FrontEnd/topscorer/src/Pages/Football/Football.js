import React from 'react';
import styles from "../Football/Football.module.css";
import { SlEye } from 'react-icons/sl';

function Football() {
  return (
    <>
      <div className={styles.MainDiv}>
        <div className={styles.ScoreBoard}>
          <div className={styles.teamA}>
            <p className={styles.tname}>FCB</p>
            <div className={styles.teamA_Img}>
              
              <img className={styles.img1} src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png"></img>
            </div>
          </div>
          <div className={styles.VS}>
            <h1 className={styles.gols}> 2 - 3 </h1>
          </div>
          <div className={styles.teamB}>
          <p className={styles.tname}>Team B</p>
            <div className={styles.teamA_Img}>
              <img className={styles.img2} src="https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Valenciacf.svg/1200px-Valenciacf.svg.png"></img>
            </div>
          </div>
        </div>

        <div className={styles.textUpdate}>
          <div className={styles.predictor}>
            <div className={styles.bar}></div>
          </div>
          <p>Latest Update: Team B scored in the 85th minute!</p>
        </div>

        <div className={styles.Sumry}>
          <h2>Summary</h2>
        </div>

        <div className={styles.table}>
          <div className={styles.firstH}>
            <h4>First Half</h4>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15'</td>
                <td>Goal</td>
                <td>Team A</td>
              </tr>
              <tr>
                <td>30'</td>
                <td>Goal</td>
                <td>Team B</td>
              </tr>
              <tr>
                <td>40'</td>
                <td>Goal</td>
                <td>Team A</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.secondH}>
            <h4>Second Half</h4>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>60'</td>
                <td>Goal</td>
                <td>Team B</td>
              </tr>
              <tr>
                <td>85'</td>
                <td>Goal</td>
                <td>Team B</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Football;
