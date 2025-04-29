import { React, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header/Header";
import Sidebar from "./Components/SideBar/Sidebar";
import Login from "./Pages/LoginPage/login";
import Options from "./Components/Live_Upcoming/Options";
import Cricket from "./Pages/Cricket/Cricket";
import Card from "./Components/PlayerCard/Card";
import Horizontal from "./Components/HorizontalGameopt/horizontal";
import Footer_main from "./Components/Footer/Footer_main";
import Badminton from "./Pages/Badminton/Badminton";
import Badminton_D from "./Pages/Badminton_Doubles/Badminton_D";
import Football from "./Pages/Football/Football";
import Tennis from "./Pages/Tennis/Tennis";
import Tennis_D from "./Pages/Tennis_D/Tennis_D";
import Kabaddi from "./Pages/Kabaddi/Kabaddi";
import DevelopmentTeam from "./Components/DevelopmentTeam/DevelopmentTeam";
import TermsAndConditions from "./Components/TnC/Tnc";
import Home from "./Pages/Home_Page/home";
import Chat from "./Components/Chat/Chat";
import io from "socket.io-client";
import BlogFeed from "./Pages/Blog_Page/BlogFeed";
import BadmintonArchived from "./Pages/Archived/badminton_archived/badmintonArchived";
import SignupPage from "./Pages/SignUp/SignUp";
import TennisArchived from "./Pages/Archived/tennis_archived/tennisArchived";
import KabaddiArchived from "./Pages/Archived/kabbadi_archived/kabbadiArchived";
import FootballArchived from "./Pages/Archived/football_archived/footballArchived";
import CricketArchived from "./Pages/Archived/cricket_archived/cricketArchived";
import DBadmintonArchived from "./Pages/Archived/dbadminton_archived/dbadmintonArchived";
import DBTennisArchived from "./Pages/Archived/dtennis_archived/dtennisArchived";
import Comment_Box from "./Components/Comment_Box/Comment_Box";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

function Dashboard() {
  const [islogin, setislogin] = useState(false);
  const [matchD, setMatchD] = useState({
    badminton: false,
    badminton_double: false,
    tennis: false,
    tennis_D: false,
    kabbadi_M: false,
    Cricket_D: false,
  });

  const [ClientCount, setClientCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    socket.on("FullPayLoad", (payload) => {
      setMatchD(payload);
      setClientCount(payload.clients || 0);
    });
    socket.on("clientCount", (count) => {
      setClientCount(count);
    });

    return () => {
      socket.off("clientCount");
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark"); // Enable dark mode
    } else {
      document.documentElement.classList.remove("dark"); // Disable dark mode
    }
  };

  return (
    <>
      <Header islogin={islogin} setislogin={setislogin} />
      <div className="bg-white dark:bg-gray-900"> {/* Light mode: bg-white, Dark mode: bg-gray-900 */}
        <div className="flex bg-white dark:bg-gray-900"> {/* Light mode: bg-white, Dark mode: bg-gray-900 */}
          <Sidebar />
          <div className="flex-grow bg-gray-50 dark:bg-gray-900"> {/* Light mode: bg-gray-50, Dark mode: bg-gray-800 */}
            <Horizontal />
            <Routes>
              <Route
                path="cricket"
                element={<Cricket data={matchD.Cricket_D.Cricket} />}
              />
              <Route path="football" element={<Football />} />
              <Route
                path="badminton"
                element={<Badminton bd={matchD.badminton.lastMessageBD} clients={ClientCount} />}
              />
              <Route
                path="badminton_d"
                element={<Badminton_D bdoubles={matchD.badminton_double.lastMessageBDouble} />}
              />
              <Route
                path="tennis"
                element={<Tennis tt={matchD.tennis.TT} />}
              />
              <Route
                path="tennis_d"
                element={<Tennis_D ttd={matchD.tennis_D.TTD} />}
              />
              <Route
                path="kabaddi"
                element={<Kabaddi data={matchD.kabbadi_M.Kabb} kabb2={matchD} />}
              />
              <Route path="tnc" element={<TermsAndConditions />} />
              <Route path="dev++" element={<DevelopmentTeam />} />
              <Route path="login" element={<Login setislogin={setislogin} />} />
              <Route path="chat" element={<Chat />} />
              <Route path="Blog" element={<BlogFeed />} />
              <Route path="badminton_archived" element={<BadmintonArchived />} />
              <Route path="sign_up" element={<SignupPage />} />
              <Route path="tennis_archived" element={<TennisArchived />} />
              <Route path="kabaddi_archived" element={<KabaddiArchived />} />
              <Route path="football_archived" element={<FootballArchived />} />
              <Route path="cricket_archived" element={<CricketArchived />} />
              <Route path="dbadminton_archived" element={<DBadmintonArchived />} />
              <Route path="dbtennis_archived" element={<DBTennisArchived />} />
              <Route path="comBox" element={<Comment_Box />} />
            </Routes>
          </div>
        </div>
      </div>
      <div>
        <Footer_main />
      </div>
    </>
  );
}

export default Dashboard;
