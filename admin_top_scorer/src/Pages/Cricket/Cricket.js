import React, { useState } from 'react';
import style from '../Cricket/Cricket.module.css';

function Cricket() {

    // need element which will show the board view of user side
    // Match Start Option-- > team Name and no of over
    // variables
    //  logo links
    // extras
    // over_count
    // store over as array
    // W 6 4 ..... extras
    // team score 
    // extras
    // other info
    // player score count
    // bowler stats
    // calculation on client side ??









    const [team1, setTeam1] = useState({
        name: '',
        logo: '',
        score: '',
        overs: '',
    });
    const [team2, setTeam2] = useState({
        name: '',
        logo: '',
        score: '',
        overs: '',
    });
    const [scoreCard, setScoreCard] = useState([]);
    const [bowlingCard, setBowlingCard] = useState([]);

    const handleTeamChange = (e, team) => {
        const { name, value } = e.target;
        if (team === 'team1') {
            setTeam1({ ...team1, [name]: value });
        } else {
            setTeam2({ ...team2, [name]: value });
        }
    };

    const handleScoreCardChange = (index, e) => {
        const { name, value } = e.target;
        const updatedScoreCard = [...scoreCard];
        updatedScoreCard[index] = { ...updatedScoreCard[index], [name]: value };
        setScoreCard(updatedScoreCard);
    };

    const handleBowlingCardChange = (index, e) => {
        const { name, value } = e.target;
        const updatedBowlingCard = [...bowlingCard];
        updatedBowlingCard[index] = { ...updatedBowlingCard[index], [name]: value };
        setBowlingCard(updatedBowlingCard);
    };

    const addScoreCardEntry = () => {
        setScoreCard([...scoreCard, { name: '', runs: '', balls: '', fours: '', sixes: '', strikeRate: '' }]);
    };

    const addBowlingCardEntry = () => {
        setBowlingCard([...bowlingCard, { name: '', overs: '', maidens: '', runs: '', wickets: '', economy: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (e.g., save to a database)
        console.log('Teams:', team1, team2);
        console.log('Score Card:', scoreCard);
        console.log('Bowling Card:', bowlingCard);
    };

    return (
        <div className={style.maindiv}>
            <h1>Admin Cricket Page</h1>
            <form onSubmit={handleSubmit}>
                <div className={style.teamSection}>
                    <h2>Team 1</h2>
                    <input type="text" name="name" placeholder="Team Name" value={team1.name} onChange={(e) => handleTeamChange(e, 'team1')} />
                    <input type="text" name="logo" placeholder="Team Logo URL" value={team1.logo} onChange={(e) => handleTeamChange(e, 'team1')} />
                    <input type="text" name="score" placeholder="Score" value={team1.score} onChange={(e) => handleTeamChange(e, 'team1')} />
                    <input type="text" name="overs" placeholder="Overs" value={team1.overs} onChange={(e) => handleTeamChange(e, 'team1')} />
                </div>

                <div className={style.teamSection}>
                    <h2>Team 2</h2>
                    <input type="text" name="name" placeholder="Team Name" value={team2.name} onChange={(e) => handleTeamChange(e, 'team2')} />
                    <input type="text" name="logo" placeholder="Team Logo URL" value={team2.logo} onChange={(e) => handleTeamChange(e, 'team2')} />
                    <input type="text" name="score" placeholder="Score" value={team2.score} onChange={(e) => handleTeamChange(e, 'team2')} />
                    <input type="text" name="overs" placeholder="Overs" value={team2.overs} onChange={(e) => handleTeamChange(e, 'team2')} />
                </div>

                <div className={style.scoreCard}>
                    <h2>Score Card</h2>
                    {scoreCard.map((player, index) => (
                        <div key={index}>
                            <input type="text" name="name" placeholder="Player Name" value={player.name} onChange={(e) => handleScoreCardChange(index, e)} />
                            <input type="number" name="runs" placeholder="Runs" value={player.runs} onChange={(e) => handleScoreCardChange(index, e)} />
                            <input type="number" name="balls" placeholder="Balls" value={player.balls} onChange={(e) => handleScoreCardChange(index, e)} />
                            <input type="number" name="fours" placeholder="4s" value={player.fours} onChange={(e) => handleScoreCardChange(index, e)} />
                            <input type="number" name="sixes" placeholder="6s" value={player.sixes} onChange={(e) => handleScoreCardChange(index, e)} />
                            <input type="text" name="strikeRate" placeholder="S/R" value={player.strikeRate} onChange={(e) => handleScoreCardChange(index, e)} />
                        </div>
                    ))}
                    <button type="button" onClick={addScoreCardEntry}>Add Player to Score Card</button>
                </div>

                <div className={style.bowlingCard}>
                    <h2>Bowling Card</h2>
                    {bowlingCard.map((player, index) => (
                        <div key={index}>
                            <input type="text" name="name" placeholder="Bowler Name" value={player.name} onChange={(e) => handleBowlingCardChange(index, e)} />
                            <input type="number" name="overs" placeholder="Overs" value={player.overs} onChange={(e) => handleBowlingCardChange(index, e)} />
                            <input type="number" name="maidens" placeholder="Maidens" value={player.maidens} onChange={(e) => handleBowlingCardChange(index, e)} />
                            <input type="number" name="runs" placeholder="Runs" value={player.runs} onChange={(e) => handleBowlingCardChange(index, e)} />
                            <input type="number" name="wickets" placeholder="Wickets" value={player.wickets} onChange={(e) => handleBowlingCardChange(index, e)} />
                            <input type="text" name="economy" placeholder="Economy" value={player.economy} onChange={(e) => handleBowlingCardChange(index, e)} />
                        </div>
                    ))}
                    <button type="button" onClick={addBowlingCardEntry}>Add Bowler to Bowling Card</button>
                </div>

                <button type="submit">Submit Match Details</button>
            </form>
        </div>
    );
}

export default Cricket;
