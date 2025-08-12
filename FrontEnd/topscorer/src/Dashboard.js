import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import axios from "./utils/axiosConfig";
import { toast } from "react-hot-toast";
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

// Protected route component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function Dashboard() {
  const [islogin, setislogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [matchD, setMatchD] = useState({
    badminton: null,
    badminton_double: null,
    tennis: null,
    tennis_D: null,
    kabbadi_M: null,
    Cricket_D: null,
    Football: null,
  });
  const [ClientCount, setClientCount] = useState(0);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/validate-token`
        );
        setislogin(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setislogin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Setup listeners once
  useEffect(() => {
    socket.on("FullPayLoad", (payload) => {
      setMatchD(payload || {});
      console.log("full data: ", payload);
    });

    socket.on("clientCount", (count) => {
      setClientCount(count ?? 0);
    });

    return () => {
      socket.off("FullPayLoad");
      socket.off("clientCount");
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div style={{ backgroundColor: "#080A1F", minHeight: "100vh" }}>
        <Header islogin={islogin} setislogin={setislogin} />
        <div style={{ display: "flex", backgroundColor: "#080A1F" }}>
          <Sidebar />
          <div style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute isAuthenticated={islogin}>
                    <Home
                      setMatchD={setMatchD}
                      ClientCount={ClientCount}
                      setClientCount={setClientCount}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cricket"
                element={
                  <Cricket data={matchD?.Cricket_D?.Cricket ?? []} />
                }
              />
              <Route
                path="/football"
                element={<Football data={matchD?.Football?.Foot ?? []} />}
              />
              <Route
                path="/badminton"
                element={
                  <Badminton
                    bd={matchD?.badminton?.lastMessageBD ?? {}}
                    clients={ClientCount}
                  />
                }
              />
              <Route
                path="/badminton_d"
                element={
                  <Badminton_D
                    bddoubles={
                      matchD?.badminton_double?.lastMessageBDouble ?? {}
                    }
                  />
                }
              />
              <Route
                path="/tennis"
                element={<Tennis tt={matchD?.tennis?.TT ?? []} />}
              />
              <Route
                path="/tennis_d"
                element={<Tennis_D ttd={matchD?.tennis_D?.TTD ?? []} />}
              />
              <Route
                path="/kabaddi"
                element={
                  <Kabaddi
                    data={matchD?.kabbadi_M?.Kabb ?? []}
                    kabb2={matchD}
                  />
                }
              />

              <Route path="/tnc" element={<TermsAndConditions />} />
              <Route path="/dev++" element={<DevelopmentTeam />} />

              <Route
                path="/login"
                element={
                  islogin ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login setislogin={setislogin} />
                  )
                }
              />

              <Route path="/chat" element={<Chat />} />
              <Route path="/Blog" element={<BlogFeed />} />
              <Route path="/badminton_archived" element={<BadmintonArchived />} />
              <Route path="/sign_up" element={<SignupPage />} />
              <Route path="/tennis_archived" element={<TennisArchived />} />
              <Route path="/kabbadi_archived" element={<KabaddiArchived />} />
              <Route path="/football_archived" element={<FootballArchived />} />
              <Route path="/cricket_archived" element={<CricketArchived />} />
              <Route path="/dbadminton_archived" element={<DBadmintonArchived />} />
              <Route path="/dtennis_archived" element={<DBTennisArchived />} />

              {/* Catch-all: redirect unknown paths to home or 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
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
