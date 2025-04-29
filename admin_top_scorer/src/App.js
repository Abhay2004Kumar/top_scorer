import logo from './logo.svg';
import './App.css';
import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home_Page/Home';
import Football from './Pages/Football/Football';
import Cricket from './Pages/Cricket/Cricket';
import Kabbadi from './Pages/Kabbadi/Kabbadi';
import AdminBadminton from './Pages/Badminton/Badminton';
import AdminBadminton_D from './Pages/Badminton_D/Badminton_D';
import AdminTennis from './Pages/Tennis/Tennis';
import AdminTennis_D from './Pages/Tennis_D/Admin_Tennis_D';
import Admin_Login from './Pages/Admin_Login/Admin_Login';
import toast, { Toaster } from 'react-hot-toast';
import Blog from './Pages/Blog/Blog';

// Higher-Order Component for Protected Routes
function ProtectedRoute({ isLogin, children }) {
  return isLogin ? children : <Navigate to="/signin" />;
}

function App() {

  const [change,setChange] = useState(false);
  // Initialize state with localStorage values
  const [isLogin, setIsLogin] = useState(
    !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken')
  );
  const [username, setUsername] = useState('');

  // Effect to handle login state changes (optional)
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    setIsLogin(!!accessToken && !!refreshToken);
  }, [change]);

  return (
    <>
      <Router>
        <div><Toaster /></div>
        <div className='main_div'>
          {isLogin && <Header username={username} />}
          {/* Define Routes */}
          <Routes>
            {/* Public Routes */}
            <Route
              path="/signin"
              element={!change && 
                <Admin_Login
                  setChange={setChange}
                  setusername={setUsername}
                />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/badminton"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <AdminBadminton />
                </ProtectedRoute>
              }
            />
            <Route
              path="/badmintonDoubles"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <AdminBadminton_D />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tennis"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <AdminTennis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tennis_d"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <AdminTennis_D />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kabbadi"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <Kabbadi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/football"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <Football />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cricket"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <Cricket />
                </ProtectedRoute>
              }
            />
            <Route
              path='/blogs'
              element={
                // <ProtectedRoute isLogin={isLogin}>
                  <Blog/>
                // {/* </ProtectedRoute> */}
              }
            />
          </Routes>
          {isLogin && <Footer />}
        </div>
      </Router>
    </>
  );
}

export default App;
