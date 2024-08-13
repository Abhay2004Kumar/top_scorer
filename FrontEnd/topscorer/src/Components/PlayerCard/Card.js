import React, { useEffect, useState } from 'react';
import styles from '../PlayerCard/Card.module.css';

export const Card = () => {
  const [player, setPlayer] = useState({
    name: "",
    role: "",
    stats: [],
    number: "",
    imageUrl: "",
    colors: {
      primary: "#004db1",
      secondary: "#187cff",
      accent: "#000A27"
    }
  });

  useEffect(() => {
    // Simulating data fetch from backend
    const fetchData = () => {
      const fetchedData = {
        name: "Virat Kohli",
        role: "Cricket",
        stats: [
          { label: "Strike Rate", value: 145 },
          { label: "Best Score", value: '263*' },
          { label: "Win Rate", value: '74%' }
        ],
        number: 45,
        imageUrl: "https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png",
        colors: {
          primary: "#000A27", // Example: Darker Shade
          secondary: "#004db1", // Example: Light Blue
          accent: "#187cff" // Example: More Light Blue
        }
      };

      setPlayer(fetchedData);
    };

    fetchData(); // Call the function to fetch and set the data
  }, []);

  return (
    <>
      <div
        className={styles.outer}
        style={{ backgroundColor: player.colors.primary }}
      >
        <div className={styles.upper}>
          <div
            className={styles.uleft}
            style={{ backgroundColor: player.colors.secondary }}
          >
            <div
              className={styles.s_name}
              style={{ backgroundColor: player.colors.primary }}
            >
              <h3>{player.role}</h3>
            </div>
            <div className={styles.flag}></div>
            <div className={styles.ctry}></div>
            <div className={styles.P_Profile}></div>
          </div>

          <div
            className={styles.uright}
            style={{ backgroundColor: player.colors.accent }}
          >
            <img className={styles.P_Image} src={player.imageUrl} alt={player.name}></img>
            <div className={styles.P_Name}>
              <h2>{player.name}</h2>
            </div>
          </div>
        </div>

        <div className={styles.lower}>
          <div
            className={styles.lleft}
            style={{ backgroundColor: player.colors.primary }}
          >
            <table>
              <tbody>
                {player.stats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.label}:</td>
                    <td>{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className={styles.lright}
            style={{ backgroundColor: player.colors.primary }}
          >
            <h1 className={styles.P_No}>{player.number}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
