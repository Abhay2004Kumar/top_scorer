import { useState, useEffect, useRef } from "react";
import Options from "../../Components/Live_Upcoming/Options";
import { GiTennisRacket } from "react-icons/gi";
import Badminton_Probability from "../ProbabilityPred/BadmintonPred";
import ChatComponent from "../../Components/Chat/Chat";
import ShiningText from "../../Components/TextAnimation/shiningText";
import { FaEye, FaTrophy } from "react-icons/fa";
import FireworksComponent from "../../Components/customAnimations/FireWork";

function Tennis({ tt, clients }) {
  const flag1_link =
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/640px-Flag_of_India.svg.png";
  const flag2_link =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1200px-Flag_of_the_People%27s_Republic_of_China.svg.png";

  const [wdth, setWidth] = useState(50);
  const [cracker, setCracker] = useState(false);
  const [animateScore, setAnimateScore] = useState({ teamA: false, teamB: false });
  const [winner, setWinner] = useState(null);
  const prevScores = useRef({ teamA: 0, teamB: 0 });

  const matchData = tt || {
    teamA: { name: "NA", player: "NA" },
    teamB: { name: "NA", player: "NA" },
    tmA_score: [],
    tmB_score: [],
    currentSet: 1,
    latestUpdate: "NA",
  };

  // Calculate winner if all sets are finished
  useEffect(() => {
    if (matchData.tmA_score.length >= 3 && matchData.tmB_score.length >= 3) {
      const teamASetsWon = matchData.tmA_score.reduce((acc, score, index) => {
        return acc + (parseInt(score) > parseInt(matchData.tmB_score[index]) ? 1 : 0);
      }, 0);
      
      const teamBSetsWon = 3 - teamASetsWon;
      
      if (teamASetsWon > teamBSetsWon && teamASets+teamBSets==3) {
        setWinner('teamA');
      } else if (teamASets+teamBSets==3) {
        setWinner('teamB');
      }
    } else {
      setWinner(null);
    }
  }, [matchData.tmA_score, matchData.tmB_score]);

  // Calculate probability and set width based on scores
  useEffect(() => {
    const score1 = matchData.tmA_score.length > 0
      ? parseInt(matchData.tmA_score[matchData.tmA_score.length - 1], 10)
      : 0;
    const score2 = matchData.tmB_score.length > 0
      ? parseInt(matchData.tmB_score[matchData.tmB_score.length - 1], 10)
      : 0;

    // Check if scores have changed to trigger animations
    if (score1 !== prevScores.current.teamA) {
      setAnimateScore(prev => ({ ...prev, teamA: true }));
      setTimeout(() => setAnimateScore(prev => ({ ...prev, teamA: false })), 500);
      prevScores.current.teamA = score1;
    }
    
    if (score2 !== prevScores.current.teamB) {
      setAnimateScore(prev => ({ ...prev, teamB: true }));
      setTimeout(() => setAnimateScore(prev => ({ ...prev, teamB: false })), 500);
      prevScores.current.teamB = score2;
    }

    let prbabs = Badminton_Probability(score1, score2) || 0;
    if (!isNaN(prbabs)) {
      prbabs = Math.max(0, Math.min(prbabs, 100));
      setWidth(prbabs);
    }
  }, [matchData]);

    if(cracker){

        setTimeout(() => {
          setCracker(false);
        }, 4000);
    }
 

  // Function to calculate sets won by each team
  const calculateSetsWon = () => {
    let teamASets = 0;
    let teamBSets = 0;
    
    for (let i = 0; i < Math.max(matchData.tmA_score.length, matchData.tmB_score.length); i++) {
      const scoreA = parseInt(matchData.tmA_score[i] || 0);
      const scoreB = parseInt(matchData.tmB_score[i] || 0);
      
      if (scoreA >= 21) {
        teamASets++;
      } else if (scoreB >= 21) {
        teamBSets++;
      }
    }
    
    return { teamASets, teamBSets };
  };

  const { teamASets, teamBSets } = calculateSetsWon();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans p-3 rounded-3xl shadow-lg">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mt-2">
          <Options
            cur_link="/dashboard/tennis"
            archived="/dashboard/tennis_archived"
          />
        </div>
      </div>
      {cracker && <FireworksComponent />}
        
      {/* Main Content Container */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
        {/* Scoreboard Section */}
        <ChatComponent sportName={"Tennis"} />
        <div className="flex items-center justify-center space-x-3">
          <GiTennisRacket className="text-2xl md:text-4xl text-green-600 dark:text-green-400" />
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Tennis
          </h1>
          <div className="absolute right-10 flex justify-center items-center">
            <FaEye />
            <span className="ml-1">{clients}</span>
          </div>
        </div>
        
        {/* Sets indicator */}
       
        
      

        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-blue-800 dark:to-gray-800 rounded-3xl p-8 w-full max-w-4xl mx-auto my-6 shadow-md border-2 border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Team A */}
            <div className={`flex flex-col items-center space-y-3 ${winner === 'teamA' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
              <img
                src={flag1_link}
                alt="Team A"
                className="w-20 h-14 object-contain rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-700"
              />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {matchData.teamA.name}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {matchData.teamA.player}(P)
              </p>
              {winner === 'teamA' && (
                <div className="flex items-center text-yellow-500 dark:text-yellow-300">
                  <FaTrophy className="mr-1" />
                  <span className="text-sm font-bold">Winner</span>
                </div>
              )}
            </div>

            {/* VS Section */}
            <div className="flex flex-col items-center space-y-2">
            {/* Winner announcement */}
            {winner && (
              <div className="flex justify-center items-center my-2">
                <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-full">
                  <FaTrophy className="text-yellow-500 dark:text-yellow-300 mr-2" />
                  <span className="font-bold text-yellow-800 dark:text-yellow-200 text-center">
                    {winner === 'teamA' ? matchData.teamA.name : matchData.teamB.name} wins the match!
                  </span>
                </div>
              </div>
            )}

              {!winner&&(
                <div>
                <div className="flex items-center">
                <span 
                  className={`text-4xl font-bold ${
                    animateScore.teamA 
                      ? 'text-green-500 dark:text-green-300 scale-125 transition-all duration-300' 
                      : 'text-gray-900 dark:text-white transition-all duration-300'
                  }`}
                >
                  {matchData.tmA_score.at(-1) || 0}
                </span>
                <span className="text-4xl font-bold mx-2">-</span>
                <span 
                  className={`text-4xl font-bold ${
                    animateScore.teamB 
                      ? 'text-green-500 dark:text-green-300 scale-125 transition-all duration-300' 
                      : 'text-gray-900 dark:text-white transition-all duration-300'
                  }`}
                >
                  {matchData.tmB_score.at(-1) || 0}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                Set {matchData.tmA_score.length}
              </p>
              </div>

              )}

              {matchData.tmA_score.length > 0 && (
          <div className="flex justify-center items-center my-2">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              winner === 'teamA' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {teamASets} sets

            </div>


            <span className="mx-2">-</span>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              winner === 'teamB' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {teamBSets} sets
            </div>
          </div>
        )}
            </div>

            {/* Team B */}
            <div className={`flex flex-col items-center space-y-3 ${winner === 'teamB' ? 'ring-2 ring-yellow-400 rounded-lg p-2' : ''}`}>
              <img
                src={flag2_link}
                alt="Team B"
                className="w-20 h-14 object-contain rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-700"
              />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {matchData.teamB.name}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {matchData.teamB.player}(P)
              </p>
              {winner === 'teamB' && (
                <div className="flex items-center text-yellow-500 dark:text-yellow-300">
                  <FaTrophy className="mr-1" />
                  <span className="text-sm font-bold">Winner</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Predictor Bar */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 w-full max-w-4xl mx-auto my-6 shadow-md border-2 border-gray-200 dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              style={{ width: `${wdth}%`, transition: "width 1s" }}
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
            ></div>
          </div>
          <p className="mt-4 text-center text-lg text-gray-900 dark:text-gray-300">
            {matchData.latestUpdate}
          </p>
        </div>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 w-full max-w-4xl mx-auto my-6 shadow-md border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-6 text-green-600 dark:text-green-400">
            Match Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700">
                    Flag
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700">
                    Player Name
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700">
                    Set 1
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700">
                    Set 2
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700">
                    Set 3
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700">
                    Sets Won
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={flag1_link}
                      alt="Flag 1"
                      className="w-8 h-6 mx-auto rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {matchData.teamA.player}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    parseInt(matchData.tmA_score[0]) > parseInt(matchData.tmB_score[0]) 
                      ? 'font-bold text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {matchData.tmA_score[0]}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    parseInt(matchData.tmA_score[1]) > parseInt(matchData.tmB_score[1]) 
                      ? 'font-bold text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {matchData.tmA_score[1]}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    parseInt(matchData.tmA_score[2]) > parseInt(matchData.tmB_score[2]) 
                      ? 'font-bold text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {matchData.tmA_score[2]}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                    {teamASets}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={flag2_link}
                      alt="Flag 2"
                      className="w-8 h-6 mx-auto rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {matchData.teamB.player}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    parseInt(matchData.tmB_score[0]) > parseInt(matchData.tmA_score[0]) 
                      ? 'font-bold text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {matchData.tmB_score[0]}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    parseInt(matchData.tmB_score[1]) > parseInt(matchData.tmA_score[1]) 
                      ? 'font-bold text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {matchData.tmB_score[1]}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    parseInt(matchData.tmB_score[2]) > parseInt(matchData.tmA_score[2]) 
                      ? 'font-bold text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {matchData.tmB_score[2]}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                    {teamBSets}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tennis;