import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Custom from './pages/Custom';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import ConfirmSignup from './pages/Auth/ConfirmSignup';

import './styles/global.css';
import 'yet-another-react-lightbox/styles.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="site-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/cart" element={<Cart />} />
          
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm" element={<ConfirmSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;