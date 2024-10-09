import React from 'react';
import style from '../Kabbadi/Kabbadi.module.css';

function Kabbadi() {
  const teamAPlayers = ['Player A1', 'Player A2', 'Player A3', 'Player A4'];
  const teamBPlayers = ['Player B1', 'Player B2', 'Player B3', 'Player B4'];

  return (
    <>
      <div className={style.Main_Div}>
        <div className={style.Header}>
          <h1>Kabbadi Match Details</h1>
        </div>

        <div className={style.Team_Container}>
          {/* Form for Team A */}
          <form className={style.Team_Detail}>
            <h2>Team A Details</h2>
            <div className={style.Input_Group}>
              <label>Team A</label>
              <select>
                <option>Select Team A</option>
                <option>Team A1</option>
                <option>Team A2</option>
                <option>Team A3</option>
              </select>
            </div>

            <div className={style.Input_Group}>
              <label>Team A Logo</label>
              <input type="file" />
            </div>

            <div className={style.Input_Group}>
              <label>Player</label>
              <select>
                <option>Select Player</option>
                {teamAPlayers.map(player => (
                  <option key={player}>{player}</option>
                ))}
              </select>
            </div>

            <div className={style.Input_Group}>
              <label>Touch</label>
              <input type="number" placeholder="Enter Touch Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Tackle</label>
              <input type="number" placeholder="Enter Tackle Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Raid</label>
              <input type="number" placeholder="Enter Raid Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Bonus</label>
              <input type="number" placeholder="Enter Bonus Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Total</label>
              <input type="number" placeholder="Total Points" disabled />
            </div>

            <button type="submit" className={style.Submit_Button}>Submit</button>
          </form>

          {/* Form for Team B */}
          <form className={style.Team_Detail}>
            <h2>Team B Details</h2>
            <div className={style.Input_Group}>
              <label>Team B</label>
              <select>
                <option>Select Team B</option>
                <option>Team B1</option>
                <option>Team B2</option>
                <option>Team B3</option>
              </select>
            </div>

            <div className={style.Input_Group}>
              <label>Team B Logo</label>
              <input type="file" />
            </div>

            <div className={style.Input_Group}>
              <label>Player</label>
              <select>
                <option>Select Player</option>
                {teamBPlayers.map(player => (
                  <option key={player}>{player}</option>
                ))}
              </select>
            </div>

            <div className={style.Input_Group}>
              <label>Touch</label>
              <input type="number" placeholder="Enter Touch Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Tackle</label>
              <input type="number" placeholder="Enter Tackle Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Raid</label>
              <input type="number" placeholder="Enter Raid Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Bonus</label>
              <input type="number" placeholder="Enter Bonus Points" />
            </div>

            <div className={style.Input_Group}>
              <label>Total</label>
              <input type="number" placeholder="Total Points" disabled />
            </div>

            <button type="submit" className={style.Submit_Button}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Kabbadi;
