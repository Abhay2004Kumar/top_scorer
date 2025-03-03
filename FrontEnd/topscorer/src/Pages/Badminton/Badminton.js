import { useState, useEffect } from "react";
import Options from '../../Components/Live_Upcoming/Options';
import { GiTennisRacket } from "react-icons/gi";
import Badminton_Probability from "../ProbabilityPred/BadmintonPred";

function Badminton({ bd }) {
  const flag1_link = "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png";
  const flag2_link = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png";

  const [wdth, setWidth] = useState(50);
  const matchData = bd || {
    teamA: { name: "NA", player: "NA" },
    teamB: { name: "NA", player: "NA" },
    tmA_score: [],
    tmB_score: [],
    currentSet: 1,
    latestUpdate: "NA"
  };

  // Calculate probability and set width based on scores
  useEffect(() => {
    let score1 = matchData.tmA_score.length > 0
      ? parseInt(matchData.tmA_score[matchData.tmA_score.length - 1], 10)
      : 0;

    let score2 = matchData.tmB_score.length > 0
      ? parseInt(matchData.tmB_score[matchData.tmB_score.length - 1], 10)
      : 0;

    let prbabs = Badminton_Probability(score1, score2) || 0;
    if (!isNaN(prbabs)) {
      prbabs = Math.max(0, Math.min(prbabs, 100));
      setWidth(prbabs);
    }
  }, [matchData]);

  return (
    <div className="bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans p-6 rounded-3xl shadow-lg">
      <Options
        cur_link="/badminton"
        archived="/badminton_archived"
      />

      {/* Scoreboard Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-4xl mx-auto my-6 shadow-md">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <GiTennisRacket className="text-2xl text-green-500 dark:text-green-400" />
          <p className="text-xl font-bold">Badminton</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Team A */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-semibold bg-green-100 dark:bg-green-800 px-4 py-2 rounded-full">{matchData.teamA.name}</p>
            <img src={flag1_link} alt="Team A" className="w-24 h-16 object-contain rounded-lg shadow-sm" />
            <p>{matchData.teamA.player}(P)</p>
          </div>

          {/* VS Section */}
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-5xl font-mono text-green-600 dark:text-green-400">{matchData.tmA_score.at(-1)} - {matchData.tmB_score.at(-1)}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Set {matchData.tmA_score.length}</p>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-semibold bg-green-100 dark:bg-green-800 px-4 py-2 rounded-full">{matchData.teamB.name}</p>
            <img src={flag2_link} alt="Team B" className="w-24 h-16 object-contain rounded-lg shadow-sm" />
            <p>{matchData.teamB.player}(P)</p>
          </div>
        </div>
      </div>

      {/* Predictor Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-4xl mx-auto my-6 shadow-md">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            style={{ width: `${wdth}%`, transition: "width 1s" }}
            className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
          ></div>
        </div>
        <p className="mt-4 text-center text-lg text-gray-700 dark:text-gray-300">{matchData.latestUpdate}</p>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-4xl mx-auto my-6 shadow-md">
        <h3 className="text-2xl font-bold text-center mb-6 text-green-600 dark:text-green-400">Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Flag</th>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Player Name</th>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Set 1</th>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Set 2</th>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Set 3</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">
                  <img src={flag1_link} alt="Flag 1" className="w-8 h-6 mx-auto rounded" />
                </td>
                <td className="px-4 py-2">{matchData.teamA.player}</td>
                <td className="px-4 py-2">{matchData.tmA_score[0]}</td>
                <td className="px-4 py-2">{matchData.tmA_score[1]}</td>
                <td className="px-4 py-2">{matchData.tmA_score[2]}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">
                  <img src={flag2_link} alt="Flag 2" className="w-8 h-6 mx-auto rounded" />
                </td>
                <td className="px-4 py-2">{matchData.teamB.player}</td>
                <td className="px-4 py-2">{matchData.tmB_score[0]}</td>
                <td className="px-4 py-2">{matchData.tmB_score[1]}</td>
                <td className="px-4 py-2">{matchData.tmB_score[2]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Badminton;