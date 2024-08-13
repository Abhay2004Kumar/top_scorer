import React from 'react'
import styles from './App.module.css'
import Header from './Components/Header/Header'
import Sidebar from './Components/SideBar/Sidebar'
import Login from './Pages/LoginPage/login'
import Options from './Components/Live_Upcoming/Options'
import Cricket from './Pages/Cricket/Cricket'
import Card from './Components/PlayerCard/Card'
import Footer_main from './Components/Footer/Footer_main'


function App() {
  return (
    <>
     <Header/>
     <div style={{display:"flex",height:"120vh",backgroundColor:"#080A1F"}}>
     <Sidebar/>

     <div style={{height:"100vh",width:"65%",backgroundColor:"#001E19",padding:"10px"}}>
      {/* <Login/> */}
      <Options/>
      <Cricket/>

      
    
      </div> 
            
     <div style={{height:"100vh",width:"30%",backgroundColor:"#080A1F"}}></div>       
     </div>
     
      <div >
        <Footer_main/>
      </div>

      


    </>
  )
}

export default App