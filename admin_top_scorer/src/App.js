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
import { adminApi } from './utils/api';
import NotFound from './Pages/NotFound/NotFound';

// Secure ProtectedRoute HOC
function ProtectedRoute({ isLogin, children }) {
  return isLogin ? children : <Navigate to="/signin" />;
}

function App() {
  const [change, setChange] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setIsLogin(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await adminApi.validateToken();

        if (res.data?.success) {
          setIsLogin(true);
          setUsername(res.data.data.user.username);
          toast.success('Admin session validated successfully');
        } else {
          setIsLogin(false);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (err) {
        console.error("Token invalid or expired", err);
        setIsLogin(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Session expired. Please log in again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [change]); // re-run when login state changes

  // Show loading spinner while validating token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Validating admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <div><Toaster /></div>
        <div className='main_div'>
          {isLogin && <Header username={username} setIsLogin={setIsLogin} />}
          <Routes>
            <Route
              path="/signin"
              element={
                !isLogin ? (
                  <Admin_Login
                    setChange={setChange}
                    setusername={setUsername}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute isLogin={isLogin}><Home /></ProtectedRoute>} />
            <Route path="/badminton" element={<ProtectedRoute isLogin={isLogin}><AdminBadminton /></ProtectedRoute>} />
            <Route path="/badmintonDoubles" element={<ProtectedRoute isLogin={isLogin}><AdminBadminton_D /></ProtectedRoute>} />
            <Route path="/tennis" element={<ProtectedRoute isLogin={isLogin}><AdminTennis /></ProtectedRoute>} />
            <Route path="/tennis_d" element={<ProtectedRoute isLogin={isLogin}><AdminTennis_D /></ProtectedRoute>} />
            <Route path="/kabbadi" element={<ProtectedRoute isLogin={isLogin}><Kabbadi /></ProtectedRoute>} />
            <Route path="/football" element={<ProtectedRoute isLogin={isLogin}><Football /></ProtectedRoute>} />
            <Route path="/cricket" element={<ProtectedRoute isLogin={isLogin}><Cricket /></ProtectedRoute>} />
            <Route path='/blogs' element={<ProtectedRoute isLogin={isLogin}><Blog /></ProtectedRoute>} />

            {/* 404 Not Found — must be last */}
            <Route
              path="*"
              element={
                <ProtectedRoute isLogin={isLogin}>
                  <NotFound />
                </ProtectedRoute>
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
