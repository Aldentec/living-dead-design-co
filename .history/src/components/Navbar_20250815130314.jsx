import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="modern-navbar">
      <div className="modern-navbar-container">
        {/* Brand */}
        <Link 
          to="/" 
          className="modern-navbar-brand"
        >
          Living Dead Design Co.
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="modern-navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`modern-navbar-nav ${isOpen ? 'open' : ''}`}>
          <Link to="/shop" className="modern-nav-link">Shop</Link>
          <Link to="/custom" className="modern-nav-link">Custom</Link>
          <Link to="/about" className="modern-nav-link">About</Link>
          <Link to="/gallery" className="modern-nav-link">Gallery</Link>
          
          {user ? (
            <Link to="/account" className="modern-nav-link">Account</Link>
          ) : (
            <Link to="/login" className="modern-nav-link">Sign In / Sign Up</Link>
          )}
          
          <Link to="/cart" className="modern-cart-link">
            🛒
            {cart.totalItems > 0 && (
              <span className="modern-cart-badge">
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </span>
            )}
          </Link>
          
          {isAdmin && <Link to="/admin" className="modern-nav-link">Admin</Link>}
        </div>
      </div>
    </nav>
  );
}