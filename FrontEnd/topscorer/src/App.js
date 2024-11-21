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

const socket = io.connect("http://localhost:5000");

function App() {
  const[matchD,setMatchD] = useState({
    badminton:false,
    badminton_double: false,
    tennis:false,
    tennis_D: false,
  });
  
  useEffect(()=>{
    socket.on("FullPayLoad",(payload)=>{
      setMatchD((payload));
      // console.log(matchD.badminton);
    });
  },[])
  // console.log("***** ",matchD);

  return (
    <>
    <Router>
     <Header/>
     <div style={{backgroundColor:"#080A1F"}}>

     <div style={{display:"flex",backgroundColor:"#080A1F"}}>
     <Sidebar/>
     

     <div style={{width:"90vw",backgroundColor:"#001E19"}}>
      {/* <Login/> */}
      <Horizontal/>
      {/* <Card/>
      <Card/>
      <Card/> */}

      <Routes>
            <Route path='/' element={<Badminton/>} ></Route>
            <Route path='/cricket' element={<Cricket/>} ></Route>
            <Route path='/football' element={<Football/>} ></Route>
            <Route path='/badminton' element={<Badminton bd={matchD.badminton.lastMessageBD}/>} ></Route>
            <Route path='/badminton_d' element={<Badminton_D bdoubles={matchD.badminton_double.lastMessageBDouble}/>} ></Route>
            <Route path='/tennis' element={<Tennis  tt={matchD.tennis.TT} />} ></Route>
            <Route path='/tennis_d' element={<Tennis_D ttd ={matchD.tennis_D.TTD} />} ></Route>
            <Route path='/kabaddi' element={<Kabaddi/>} ></Route>
            <Route path='/tnc' element={<TermsAndConditions/>} ></Route>
            <Route path='/dev++' element={<DevelopmentTeam/>} ></Route>
            <Route path='/login' element={<Login/>} ></Route>
            <Route path='/chat' element={<Chat/>} ></Route>
            <Route path='/Blog' element={<BlogFeed/>} ></Route>
            <Route path='/badminton_archived' element={<BadmintonArchived/>}></Route>



      </Routes>

    
    
      </div>       
     <div style={{width:"00px",backgroundColor:"#080A1F"}}></div>       
     </div>
    
      
     </div>

    </Router>
    
     
      
      <div >
        <Footer_main/>
      </div>

    </>
  )
}

export default App