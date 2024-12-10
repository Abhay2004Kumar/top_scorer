import logo from './logo.svg';
import './App.css';
import { React,useState, useEffect } from "react";
import Kabbadi from './Pages/Kabbadi/Kabbadi';
import Header from './Components/Header/Header';
import AdminBadminton from './Pages/Badminton/Badminton';
import Footer from './Components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home_Page/Home';
import Football from './Pages/Football/Football';
import Cricket from './Pages/Cricket/Cricket';
import AdminBadminton_D from './Pages/Badminton_D/Badminton_D';
import AdminTennis from './Pages/Tennis/Tennis';
import AdminTennis_D from './Pages/Tennis_D/Admin_Tennis_D';
import toast, { Toaster } from 'react-hot-toast';
import Admin_Login from './Pages/Admin_Login/Admin_Login';



function App() {


  return (
    <>
    <Router>
    <div><Toaster/></div>
      <div className='main_div'>
        <Header />
        
        {/* Define routes */}
        <Routes> 
          <Route path='/' element={<Home />} />
          <Route path='/badminton' element={<AdminBadminton />} />
          <Route path='/badmintonDoubles' element={<AdminBadminton_D />} />
          <Route path='/tennis' element={<AdminTennis/>} />
          <Route path='/tennis_d' element={<AdminTennis_D/>} />
          <Route path='/kabbadi' element={<Kabbadi />} />
          <Route path='/football' element={<Football />} />
          <Route path='/cricket' element={<Cricket />} />
          <Route path='/signin' element={<Admin_Login/>} />
          {/* Add other routes as needed */}
        </Routes>

        <Footer />
      </div>
    </Router>
    </>
  );
}

export default App;
