import React from 'react'
import styles from './App.module.css'
import Header from './Components/Header/Header'
import Sidebar from './Components/SideBar/Sidebar'
import Login from './Pages/LoginPage/login'
import Options from './Components/Live_Upcoming/Options'
import Cricket from './Pages/Cricket/Cricket'
import Card from './Components/PlayerCard/Card'
import Horizontal from './Components/HorizontalGameopt/horizontal'


function App() {
  return (
    <>
     <Header/>
     <div style={{backgroundColor:"080A1F"}}>

     <div style={{display:"flex",backgroundColor:"#080A1F"}}>
     <Sidebar/>

     <div style={{width:"90vw",backgroundColor:"#001E19"}}>
      {/* <Login/> */}
      <Horizontal/>
      <Cricket/>

      </div>       
     <div style={{width:"00px",backgroundColor:"#080A1F"}}></div>       
     </div>
     </div>
     

    </>
  )
}

export default App