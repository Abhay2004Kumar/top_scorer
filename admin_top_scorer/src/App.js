import logo from './logo.svg';
import './App.css';
import Kabbadi from './Pages/Kabbadi/Kabbadi';
import Header from './Components/Header/Header';
import AdminBadminton from './Pages/Badminton/Badminton';
import Footer from './Components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home_Page/Home';
import Football from './Pages/Football/Football';
import Cricket from './Pages/Cricket/Cricket';
import AdminBadminton_D from './Pages/Badminton_D/Badminton_D';

function App() {
  return (
    <Router>
      <div className='main_div'>
        <Header />
        
        {/* Define routes */}
        <Routes> 
          <Route path='/' element={<Home />} />
          <Route path='/badminton' element={<AdminBadminton />} />
          <Route path='/badmintonDoubles' element={<AdminBadminton_D />} />
          <Route path='/kabbadi' element={<Kabbadi />} />
          <Route path='/football' element={<Football />} />
          <Route path='/cricket' element={<Cricket />} />
          {/* Add other routes as needed */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
