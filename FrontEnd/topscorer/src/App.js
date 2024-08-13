import React from 'react'
import styles from './App.module.css'
import Header from './Components/Header/Header'
import Sidebar from './Components/SideBar/Sidebar'
import Login from './Pages/LoginPage/login'
import Card from './Components/PlayerCard/Card'


function App() {
  return (
    <>
     <Header/>
     <div style={{display:"flex"}}>
     <Sidebar/>
     <div style={{backgroundColor:"red",height:"100vh",width:"65%",backgroundColor:"#001E19"}}>
      <Card/>
      </div>       
     <div style={{backgroundColor:"red",height:"100vh",width:"30%",backgroundColor:"#080A1F"}}></div>       
     </div>

    </>
  )
}

export default App