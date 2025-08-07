import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Custom from './pages/Custom';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import './styles/global.css';

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
          <Route path="/gallery" element={<Cart />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;