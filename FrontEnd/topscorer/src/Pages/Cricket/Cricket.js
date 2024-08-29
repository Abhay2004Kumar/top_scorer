import React, { useEffect, useState } from 'react'
import style from '../Cricket/cricket.module.css'
import Horizontal from '../../Components/HorizontalGameopt/horizontal'
import Options from '../../Components/Live_Upcoming/Options'

function Cricket() {
    const [teamData, setTeamData] = useState(null);
    const [scoreCard, setScoreCard] = useState(null);
    const [bowlingCard, setBowlingCard] = useState(null);

    useEffect(() => {
        // Dummy data to simulate backend response
        const dummyData = {
            teams: {
                team1: {
                    name: 'India',
                    logo: 'https://imgeng.jagran.com/images/2023/nov/Rohit-Sharma-profile1700142481090.jpg',
                    score: '234/5',
                    overs: '20.1',
                },
                team2: {
                    name: 'Australia',
                    logo: 'https://media.assettype.com/freepressjournal/2024-06/66d475a3-582c-40f3-bcf6-a8bcc64e882c/Pat_Cummins_T20_WC.jpg?width=1200',
                    score: '234/5',
                    overs: '22.3',
                },
                currentOver: [0, 1, 1, 4, 6, 0],
                lastOver: {
                    runs: 14,
                    wickets: 1,
                },
            },
            scoreCard: [
                { name: 'Rohit Sharma', runs: 45, balls: 30, fours: 5, sixes: 2, strikeRate: '150.00' },
                { name: 'Player 2', runs: 35, balls: 25, fours: 3, sixes: 1, strikeRate: '140.00' },
                { name: 'Player 3', runs: 50, balls: 32, fours: 7, sixes: 3, strikeRate: '156.25' },
            ],
            bowlingCard: [
                { name: 'Rohit Sharma', overs: 4, maidens: 0, runs: 30, wickets: 2, economy: '7.50' },
                { name: 'Player 2', overs: 4, maidens: 0, runs: 35, wickets: 1, economy: '8.75' },
                { name: 'Player 3', overs: 4, maidens: 1, runs: 32, wickets: 3, economy: '8.00' },
            ],
        };

        // Simulating data fetch and setting state
        setTeamData(dummyData.teams);
        setScoreCard(dummyData.scoreCard);
        setBowlingCard(dummyData.bowlingCard);
    }, []);

    if (!teamData || !scoreCard || !bowlingCard) {
        return <div>Loading...</div>; // Show a loading indicator while data is being set
    }

    return (
        <>
            <div className={style.maindiv}>
                <Options />
                <div className={style.teamslogo}>
                    <div className={style.tone}>
                        <div className={style.img1}>
                            <img src={teamData.team1.logo} alt={`${teamData.team1.name} logo`} />
                        </div>
                        <div className={style.score}>
                            <p>{teamData.team1.score}</p>
                            <p className={style.over}>{teamData.team1.overs}</p>
                        </div>
                    </div>

                    <div className={style.ttwo}>
                        <div className={style.img2}>
                            <img src={teamData.team2.logo} alt={`${teamData.team2.name} logo`} />
                        </div>
                        <div className={style.score}>
                            <p>{teamData.team2.score}</p>
                            <p className={style.over}>{teamData.team2.overs}</p>
                        </div>
                    </div>
                </div>

                {/* predictor box and current over */}
                <div className={style.predictorbox}>
                    <div className={style.predic}>
                        <div className={style.win}></div>
                    </div>
                    <div className={style.currover}>
                        <div className={style.thisover}>
                            {teamData.currentOver.map((ball, index) => (
                                <div key={index} className={style.ball}></div>
                            ))}
                        </div>
                        <div className={style.status}>
                            <p>Last Over {teamData.lastOver.runs} Runs {teamData.lastOver.wickets} Wicket</p>
                        </div>
                    </div>
                </div>

                {/* scorebox */}
                <div className={style.scorebox}>
                    <div className={style.scoretxt}>
                        <h3>Score Card</h3>
                    </div>
                    <div className={style.teamopt}>
                        <button>{teamData.team1.name}</button>
                        <button>{teamData.team2.name}</button>
                    </div>
                    <div className={style.performance}>
                        <div className="table-container">
                            <table className="live-match-table">
                                <thead>
                                    <tr>
                                        <th className={style.batman}>Batsman</th>
                                        <th>R</th>
                                        <th>B</th>
                                        <th>4s</th>
                                        <th>6s</th>
                                        <th>S/R</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scoreCard.map((player, index) => (
                                        <tr key={index}>
                                            <td>{player.name}</td>
                                            <td>{player.runs}</td>
                                            <td>{player.balls}</td>
                                            <td>{player.fours}</td>
                                            <td>{player.sixes}</td>
                                            <td>{player.strikeRate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className={style.scorebox}>
                    <div className={style.performance}>
                        <div className="table-container">
                            <table className="live-match-table">
                                <thead>
                                    <tr>
                                        <th className={style.batman}>Bowling</th>
                                        <th>O</th>
                                        <th>M</th>
                                        <th>R</th>
                                        <th>W</th>
                                        <th>Econ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bowlingCard.map((player, index) => (
                                        <tr key={index}>
                                            <td>{player.name}</td>
                                            <td>{player.overs}</td>
                                            <td>{player.maidens}</td>
                                            <td>{player.runs}</td>
                                            <td>{player.wickets}</td>
                                            <td>{player.economy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cricket;
