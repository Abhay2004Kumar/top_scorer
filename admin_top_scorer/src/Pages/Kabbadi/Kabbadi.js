import React, { useState } from "react";
import styles from "../Kabbadi/Kabbadi.module.css";
import axios from "axios";
import io from "socket.io-client";
import toast from "react-hot-toast";

const socket = io.connect("http://localhost:5000");

function AdminKabaddi() {
  const [popup, setPopup] = useState(false);
  const [matchData, setMatchData] = useState({
    name: "Kabaddi",
    data: {
      teamA: {
        name: "",
        player: "",
        set1Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
        set2Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
        set3Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
        totalPoints: 0,
      },
      teamB: {
        name: "",
        player: "",
        set1Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
        set2Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
        set3Points: { raidPoints: 0, tacklePoints: 0, touchPoints: 0, bonusPoints: 0, totalPoints: 0 },
        totalPoints: 0,
      },
      currentHalf: 1,
      latestUpdate: "",
    },
  });

  const handleInputChange = (e, team, field) => {
    const value = e.target.value;
    setMatchData((prevMatchData) => ({
      ...prevMatchData,
      data: {
        ...prevMatchData.data,
        [team]: {
          ...prevMatchData.data[team],
          [field]: value,
        },
      },
    }));
  };

  const handleScoreChange = (e, team, set, scoreType) => {
    const score = parseInt(e.target.value, 10) || 0;

    setMatchData((prevMatchData) => {
      const updatedTeam = { ...prevMatchData.data[team] };

      updatedTeam[set][scoreType] = score;

      // Calculate the totalPoints for the set
      updatedTeam[set].totalPoints = Object.values(updatedTeam[set])
        .slice(0, -1)
        .reduce((acc, value) => acc + value, 0);

      // Recalculate totalPoints for the team
      updatedTeam.totalPoints = ['set1Points', 'set2Points', 'set3Points']
        .map((setKey) => updatedTeam[setKey].totalPoints)
        .reduce((acc, setTotal) => acc + setTotal, 0);

      return {
        ...prevMatchData,
        data: {
          ...prevMatchData.data,
          [team]: updatedTeam,
        },
      };
    });
  };

  // Handle form submission (final submit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate that both team names are provided
    if (!matchData.data.teamA.name || !matchData.data.teamB.name) {
      toast.error("Please fill out both team names!");
      return;
    }
    setPopup(true);
  };

  // Final submit to backend
  const submitMatchData = async () => {
    try {
      const updatedMatchData = {
        ...matchData,
        data: {
          ...matchData.data,
          latestUpdate: new Date().toISOString(), // Capture the current timestamp in ISO format
        },
      };

      await axios.post("http://localhost:5000/api/v1/sports/Createkabaddi", {
        teamA: updatedMatchData.data.teamA,
        teamB: updatedMatchData.data.teamB,
        currentHalf: updatedMatchData.data.currentHalf,
        latestUpdate: updatedMatchData.data.latestUpdate,
      });
      console.log(matchData.data);

      toast.success("Data Added Successfully!");
    } catch (error) {
      console.error("Error submitting match data:", error);
      toast.error("Failed to submit match data! Try again Check if req info is filled");
    }

    setPopup(false);
  };

  // Emit socket update for real-time updates
  const sendSocketUpdate = () => {
    
    socket.emit("data", matchData);
    console.log(matchData);
    toast.success("Match Update Sent via Socket!");
  };

  return (
    <>
      {popup && (
        <div className={styles.kabaddiCover} onClick={() => setPopup(false)}>
          <div className={styles.kabaddiPop} onClick={(e) => e.stopPropagation()}>
            <p style={{ color: "blue", textAlign: "center", fontSize: "30px" }}>
              Are you sure to submit the score?
            </p>
            <button className={styles.kabaddiYes} onClick={submitMatchData}>
              Yes (Final Submit)
            </button>
            <button className={styles.kabaddiNo} onClick={() => setPopup(false)}>
              No
            </button>
          </div>
        </div>
      )}

      <div className={styles.kabaddiMainDiv}>
        <h2 className={styles.kabaddiHeader}>Kabaddi Admin Page</h2>
        <form onSubmit={handleFormSubmit} className={styles.kabaddiAdminForm}>
          <div className={styles.kabaddiTeamsContainer}>
            {/* Team A */}
            <div className={styles.kabaddiTeamBlock}>
              <div className={styles.kabaddiBlockHeader}>Team A</div>
              <div className={styles.kabaddiBlockContent}>
                <label className={styles.kabaddiLabel}>Team A Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.data.teamA.name}
                  onChange={(e) => handleInputChange(e, "teamA", "name")}
                />
                <label className={styles.kabaddiLabel}>Player Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.data.teamA.player}
                  onChange={(e) => handleInputChange(e, "teamA", "player")}
                />

                {["set1Points", "set2Points", "set3Points"].map((set) => (
                  <div key={set}>
                    <h3>{`Set ${set.slice(3)}`}</h3>
                    {["raidPoints", "tacklePoints", "touchPoints", "bonusPoints"].map((scoreType) => (
                      <div key={scoreType}>
                        <label className={styles.kabaddiLabel}>{scoreType.replace(/([A-Z])/g, " $1")}</label>
                        <input
                          className={styles.kabaddiInput}
                          type="number"
                          value={matchData.data.teamA[set][scoreType]}
                          onChange={(e) => handleScoreChange(e, "teamA", set, scoreType)}
                        />
                      </div>
                    ))}
                    <div>
                      <label className={styles.kabaddiLabel}>Total Points for {`Set ${set.slice(3)}`}</label>
                      <input
                        className={styles.kabaddiInput}
                        type="text"
                        value={matchData.data.teamA[set].totalPoints}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className={styles.kabaddiLabel}>Total Points for Team A</label>
                  <input
                    className={styles.kabaddiInput}
                    type="text"
                    value={matchData.data.teamA.totalPoints}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className={styles.kabaddiTeamBlock}>
              <div className={styles.kabaddiBlockHeader}>Team B</div>
              <div className={styles.kabaddiBlockContent}>
                <label className={styles.kabaddiLabel}>Team B Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.data.teamB.name}
                  onChange={(e) => handleInputChange(e, "teamB", "name")}
                />
                <label className={styles.kabaddiLabel}>Player Name</label>
                <input
                  className={styles.kabaddiInput}
                  type="text"
                  value={matchData.data.teamB.player}
                  onChange={(e) => handleInputChange(e, "teamB", "player")}
                />

                {["set1Points", "set2Points", "set3Points"].map((set) => (
                  <div key={set}>
                    <h3>{`Set ${set.slice(3)}`}</h3>
                    {["raidPoints", "tacklePoints", "touchPoints", "bonusPoints"].map((scoreType) => (
                      <div key={scoreType}>
                        <label className={styles.kabaddiLabel}>{scoreType.replace(/([A-Z])/g, " $1")}</label>
                        <input
                          className={styles.kabaddiInput}
                          type="number"
                          value={matchData.data.teamB[set][scoreType]}
                          onChange={(e) => handleScoreChange(e, "teamB", set, scoreType)}
                        />
                      </div>
                    ))}
                    <div>
                      <label className={styles.kabaddiLabel}>Total Points for {`Set ${set.slice(3)}`}</label>
                      <input
                        className={styles.kabaddiInput}
                        type="text"
                        value={matchData.data.teamB[set].totalPoints}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className={styles.kabaddiLabel}>Total Points for Team B</label>
                  <input
                    className={styles.kabaddiInput}
                    type="text"
                    value={matchData.data.teamB.totalPoints}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.kabaddiFooter}>
          <button
              type="button"
              className={styles.kabaddiSocketButton}
              onClick={sendSocketUpdate}
            >
              Send Match Update (Socket)
            </button>
            <button type="submit" className={styles.kabaddiSubmitButton}>
              Submit Match Score (Final)
            </button>
            
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminKabaddi;
