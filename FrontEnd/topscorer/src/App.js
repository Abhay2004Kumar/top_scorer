import { React,useState, useEffect } from "react";
import styles from './App.module.css'
import Header from './Components/Header/Header'
import Sidebar from './Components/SideBar/Sidebar'
import Login from './Pages/LoginPage/login'
import Options from './Components/Live_Upcoming/Options'
import Cricket from './Pages/Cricket/Cricket'
import Card from './Components/PlayerCard/Card'
import Horizontal from './Components/HorizontalGameopt/horizontal'
import Footer_main from './Components/Footer/Footer_main'
import Badminton from './Pages/Badminton/Badminton'
import Badminton_D from './Pages/Badminton_Doubles/Badminton_D'
import Football from './Pages/Football/Football'
import Tennis from './Pages/Tennis/Tennis'
import Tennis_D from './Pages/Tennis_D/Tennis_D'
import Kabaddi from './Pages/Kabaddi/Kabaddi'
import DevelopmentTeam from './Components/DevelopmentTeam/DevelopmentTeam'
import TermsAndConditions from './Components/TnC/Tnc'
import { BrowserRouter as Router , Route, Routes} from 'react-router-dom'
import Home from './Pages/Home_Page/home'
import Chat from './Components/Chat/Chat'
import io from "socket.io-client";
import BlogFeed from './Pages/Blog_Page/BlogFeed'
import BadmintonArchived from './Pages/Archived/badminton_archived/badmintonArchived'
import SignupPage from "./Pages/SignUp/SignUp";
import TennisArchived from "./Pages/Archived/tennis_archived/tennisArchived";
import KabaddiArchived from "./Pages/Archived/kabbadi_archived/kabbadiArchived";
import FootballArchived from "./Pages/Archived/football_archived/footballArchived";
import CricketArchived from "./Pages/Archived/cricket_archived/cricketArchived";
import DBadmintonArchived from "./Pages/Archived/dbadminton_archived/dbadmintonArchived";
import DBTennisArchived from "./Pages/Archived/dtennis_archived/dtennisArchived";

import SubscribeBtn from '../src/Components/payment/subscrbeBtn'
// import './index.css';
import toast, { Toaster} from 'react-hot-toast'
import Comment_Box from "./Components/Comment_Box/Comment_Box";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Dashboard from "./Dashboard";
const socket = io.connect(process.env.REACT_APP_BACKEND_URL);
// const socket = io.connect('http://localhost:5000/');
function App() {
  const[matchD,setMatchD] = useState({
    badminton:false,
    badminton_double: false,
    tennis:false,
    tennis_D: false,
    kabbadi_M: false,
  });
  
  const [islogin,setislogin] = useState(false);
  const [ClientCount,setClientCount] = useState(0);
  
  useEffect(()=>{
    socket.on("FullPayLoad",(payload)=>{
      setMatchD((payload));
      console.log(payload.clients);
     
      // console.log(matchD.badminton);
    });
    socket.on("clientCount", (count) => {
      setClientCount(count); // 👈 Save count in state
    });
  
    return () => {
      socket.off("clientCount");
    };
  },[])
  // console.log("***** ",matchD);

  return (
    <>
    <div><Toaster/></div>
    
      <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} ></Route>
        <Route path='/dashboard/*' element={<Dashboard/>}></Route>

      </Routes>
      </Router>


    </>
  )
}

export default App